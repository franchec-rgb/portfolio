import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LETTERS = 'FRANCHEC'.split('')

interface BackgroundNameProps {
  color?: string
  onReady?: () => void
}

export default function BackgroundName({ color = '#000000', onReady }: BackgroundNameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[]
    const container = containerRef.current
    if (!container || letters.length === 0) return

    gsap.set(container, {
      opacity: 1,
      position: 'fixed',
      top: '50%',
      bottom: 'auto',
      left: 0,
      right: 0,
      yPercent: -50,
    })

    // All letters start invisible
    gsap.set(letters, { opacity: 0, y: 20 })

    const tl = gsap.timeline()

    // Phase 1: reveal letters one by one
    tl.to(letters, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.3,
    })

    // Brief pause after full word is visible
    tl.to({}, { duration: 0.4 })

    tl.to(container, {
      top: '100%',
      yPercent: -100,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => onReadyRef.current?.(),
    })

    return () => { tl.kill() }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        lineHeight: 0.85,
        opacity: 0,
      }}
    >
      <span
        style={{
          display: 'block',
          fontWeight: 800,
          fontSize: 'clamp(6rem, 19.5vw, 24rem)',
          color,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          userSelect: 'none',
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { letterRefs.current[i] = el }}
            style={{ display: 'inline-block' }}
          >
            {letter}
          </span>
        ))}
      </span>
    </div>
  )
}
