import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { projects } from '@/data/projects'
import { useNavigate } from 'react-router-dom'

const TOTAL = projects.length
const CARD_GAP = 14

export default function CardCarousel({ startAnimation = false }: { startAnimation?: boolean }) {
  const navigate = useNavigate()
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const labelRef = useRef<HTMLDivElement>(null)

  const target = useRef(0)
  const current = useRef(0)
  const prevCurrent = useRef(0)
  const smoothVel = useRef(0)
  const introDone = useRef(false)
  const dragging = useRef(false)
  const dragY0 = useRef(0)
  const dragTarget0 = useRef(0)
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activeIdx, setActiveIdx] = useState(0)
  const [showLabel, setShowLabel] = useState(false)

  // Card dimensions derived from viewport
  const dims = useCallback(() => {
    const vw = window.innerWidth
    const w = Math.min(vw * 0.48, 820)
    const h = w * 0.57
    return { w, h, step: h + CARD_GAP }
  }, [])

  const snap = useCallback(() => {
    if (snapTimer.current) clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      const { step } = dims()
      target.current = Math.round(target.current / step) * step
    }, 150)
  }, [dims])

  // Position a card given its index and the current scroll value
  const positionCard = useCallback((card: HTMLDivElement, index: number, scroll: number, vel: number) => {
    const { w, h, step } = dims()
    const vh = window.innerHeight
    const centerY = (vh - h) / 2
    const loopLen = step * TOTAL

    card.style.width = `${w}px`
    card.style.height = `${h}px`

    // Card's raw Y = its slot position minus scroll
    let y = centerY + index * step - scroll

    // Modular wrap so cards loop infinitely
    y = ((y % loopLen) + loopLen + step) % loopLen - step
    // Shift range so it wraps around the viewport
    if (y > vh + h * 0.5) y -= loopLen
    if (y < -h * 1.5) y += loopLen

    card.style.transform = `translate3d(-50%, ${y}px, 0) skewY(${vel * 0.6}deg)`

    // Visibility
    const visible = y > -h && y < vh + h
    card.style.visibility = visible ? 'visible' : 'hidden'

    // Detect active (closest to center)
    const distFromCenter = Math.abs(y + h / 2 - vh / 2)
    return { y, distFromCenter }
  }, [dims])

  // ── Main RAF loop (only runs AFTER intro) ──
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!introDone.current) return

      // Lerp scroll
      const diff = target.current - current.current
      if (Math.abs(diff) > 0.3) {
        current.current += diff * 0.1
      } else {
        current.current = target.current
      }

      // Velocity for skew distortion
      const rawVel = current.current - prevCurrent.current
      smoothVel.current += (rawVel - smoothVel.current) * 0.2
      if (Math.abs(smoothVel.current) < 0.01) smoothVel.current = 0
      prevCurrent.current = current.current

      // Position all cards
      let closest = { idx: 0, dist: Infinity }
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const { distFromCenter } = positionCard(card, i, current.current, smoothVel.current)
        if (distFromCenter < closest.dist) {
          closest = { idx: i, dist: distFromCenter }
        }
      })
      if (closest.idx !== activeIdx) setActiveIdx(closest.idx)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [positionCard, activeIdx])

  // ── Intro animation ──
  useEffect(() => {
    if (!startAnimation) return

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const { w, h, step } = dims()
    const vh = window.innerHeight
    const centerY = (vh - h) / 2

    // Set initial state: clip from bottom, positioned at final Y but shifted down
    cards.forEach((card, i) => {
      card.style.width = `${w}px`
      card.style.height = `${h}px`
      card.style.visibility = 'visible'
      card.style.opacity = '1'
      card.style.clipPath = 'inset(100% 0 0 0)'
      const finalY = centerY + i * step
      card.style.transform = `translate3d(-50%, ${finalY + 50}px, 0)`
    })

    // Stagger from center outward
    const sorted = cards
      .map((card, i) => ({ card, i }))
      .sort((a, b) => {
        const dA = Math.min(a.i, TOTAL - a.i)
        const dB = Math.min(b.i, TOTAL - b.i)
        return dA - dB
      })

    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => {
        introDone.current = true
        cards.forEach(c => { c.style.clipPath = 'none' })
        setTimeout(() => setShowLabel(true), 200)
      },
    })

    sorted.forEach(({ card, i: cardIdx }, sortOrder) => {
      const finalY = centerY + cardIdx * step
      tl.to(card, {
        clipPath: 'inset(0% 0 0 0)',
        transform: `translate3d(-50%, ${finalY}px, 0)`,
        duration: 0.9,
        ease: 'power3.inOut',
      }, sortOrder * 0.1)
    })

    return () => { tl.kill() }
  }, [startAnimation, dims])

  // ── Wheel ──
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (!introDone.current) return
      e.preventDefault()
      const dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY
      target.current += dy * 0.6
      snap()
    }
    window.addEventListener('wheel', handler, { passive: false })
    return () => window.removeEventListener('wheel', handler)
  }, [snap])

  // ── Pointer drag ──
  useEffect(() => {
    const down = (e: PointerEvent) => {
      if (!introDone.current) return
      if ((e.target as HTMLElement).closest('a, button')) return
      dragging.current = true
      dragY0.current = e.clientY
      dragTarget0.current = target.current
    }
    const move = (e: PointerEvent) => {
      if (!dragging.current) return
      target.current = dragTarget0.current - (e.clientY - dragY0.current)
    }
    const up = () => {
      if (!dragging.current) return
      dragging.current = false
      snap()
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [snap])

  // ── Label fade on active change ──
  useEffect(() => {
    if (!labelRef.current || !showLabel) return
    gsap.fromTo(labelRef.current,
      { opacity: 0, x: -6 },
      { opacity: 1, x: 0, duration: 0.28, ease: 'power2.out', overwrite: true },
    )
  }, [activeIdx, showLabel])

  const proj = projects[activeIdx]
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div ref={wrapRef} style={{ position: 'fixed', inset: 0, zIndex: 10, overflow: 'hidden', cursor: 'grab' }}>
      {projects.map((p, i) => (
        <div
          key={p.id}
          ref={el => { cardRefs.current[i] = el }}
          onClick={() => introDone.current && navigate(`/project/${p.slug}`)}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            willChange: 'transform, clip-path',
            cursor: 'pointer',
            overflow: 'hidden',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <img
            src={p.coverImage}
            alt={p.title}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', userSelect: 'none' }}
          />
        </div>
      ))}

      {showLabel && (
        <div
          ref={labelRef}
          style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'flex-start', gap: 48,
            opacity: 0, userSelect: 'none', pointerEvents: 'none', zIndex: 200,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#000', whiteSpace: 'nowrap' }}>
            {pad(activeIdx + 1)}/{pad(TOTAL)}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#000', textTransform: 'uppercase', maxWidth: 160, lineHeight: 1.3 }}>
            {proj?.title}
          </span>
        </div>
      )}
    </div>
  )
}
