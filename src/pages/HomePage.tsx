import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { projects } from '@/data/projects'
import { usePageTransition } from '@/context/TransitionContext'

const TOTAL = projects.length
const CARD_GAP = 14

const VERT = `
  uniform float uBarrelVel;
  uniform float uNormY;
  uniform float uCardRatio;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dx = (uv.x - 0.5) * 2.0;
    float dy = uNormY + (uv.y - 0.5) * uCardRatio;
    float dist2 = dx * dx + dy * dy;
    float bv = smoothstep(0.0, 0.2, uBarrelVel) * uBarrelVel;
    pos.z -= min(dist2 * bv * 150.0, 400.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = `
  uniform sampler2D uTexture;
  uniform float uVelocity;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;
  varying vec2 vUv;

  void main() {
    float ia = uImageSize.x / uImageSize.y;
    float pa = uPlaneSize.x / uPlaneSize.y;
    vec2 uv = vUv;

    if (ia > pa) {
      float s = pa / ia;
      uv.x = vUv.x * s + (1.0 - s) * 0.5;
    } else {
      float s = ia / pa;
      uv.y = vUv.y * s + (1.0 - s) * 0.5;
    }

    float rgbOff = uVelocity * 0.0015;
    float r = texture2D(uTexture, vec2(uv.x + rgbOff, uv.y)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, vec2(uv.x - rgbOff, uv.y)).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`

interface PlaneData {
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
  video?: HTMLVideoElement
}

let introHasPlayed = false
let savedActiveIdx: number | null = null

export default function HomePage() {
  const { triggerTransition } = usePageTransition()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const projNumRef = useRef<HTMLDivElement>(null)
  const projTitleRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(savedActiveIdx ?? 0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)
  const smoothVel = useRef(0)
  const barrelVel = useRef(0)
  const prevScroll = useRef(0)
  const introDone = useRef(false)
  const dragging = useRef(false)
  const dragStart = useRef(0)
  const dragTarget0 = useRef(0)
  const lastInputTime = useRef(0)
  const dimsRef = useRef({ vw: 0, vh: 0, w: 0, h: 0, step: 0, fov: 50, camZ: 0, mobile: false })

  const getDims = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const mobile = vw < 768
    const w = mobile ? vw * 0.88 : Math.min(vw * 0.42, 720)
    const h = w * 0.62
    const step = (mobile ? w : h) + (mobile ? 6 : CARD_GAP)
    const fov = 50
    const halfFov = (fov * 0.5 * Math.PI) / 180
    const camZ = vh / (2 * Math.tan(halfFov))
    return { vw, vh, w, h, step, fov, camZ, mobile }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const initDims = getDims()
    dimsRef.current = initDims
    const { vw, vh, w, h, fov, camZ } = initDims

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(vw, vh)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(fov, vw / vh, 0.1, 2000)
    camera.position.z = camZ

    const loader = new THREE.TextureLoader()
    const planes: PlaneData[] = []

    projects.forEach((p) => {
      const geo = new THREE.PlaneGeometry(w, h, 32, 32)
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: new THREE.Texture() },
          uVelocity: { value: 0 },
          uBarrelVel: { value: 0 },
          uNormY: { value: 0 },
          uCardRatio: { value: 2 * h / vh },
          uImageSize: { value: new THREE.Vector2(1, 1) },
          uPlaneSize: { value: new THREE.Vector2(w, h) },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.visible = false
      scene.add(mesh)

      if (p.coverVideo) {
        const video = document.createElement('video')
        video.src = p.coverVideo
        video.crossOrigin = 'anonymous'
        video.loop = true
        video.muted = true
        video.playsInline = true
        video.preload = 'auto'

        const videoTex = new THREE.VideoTexture(video)
        videoTex.minFilter = THREE.LinearFilter
        videoTex.magFilter = THREE.LinearFilter
        videoTex.generateMipmaps = false

        video.addEventListener('loadeddata', () => {
          mat.uniforms.uTexture.value = videoTex
          mat.uniforms.uImageSize.value.set(video.videoWidth, video.videoHeight)
          mesh.visible = true
        })

        planes.push({ mesh, material: mat, video })
      } else {
        planes.push({ mesh, material: mat })

        loader.load(p.coverImage, (tex) => {
          tex.minFilter = THREE.LinearFilter
          tex.magFilter = THREE.LinearFilter
          tex.generateMipmaps = false

          mat.uniforms.uTexture.value = tex
          mat.uniforms.uImageSize.value.set(tex.image.width, tex.image.height)
          mesh.visible = true
        })
      }
    })

    const nameEl = nameRef.current
    const navEl = navRef.current
    const canvasWrap = canvasWrapRef.current
    const projNumEl = projNumRef.current
    const projTitleEl = projTitleRef.current

    const skipIntro = introHasPlayed
    const restoredIdx = savedActiveIdx
    const introProgress = { value: skipIntro ? 1 : 0 }
    let introTl: gsap.core.Timeline | null = null

    if (skipIntro) {
      const idx = restoredIdx ?? 0
      scrollTarget.current = idx * initDims.step
      scrollCurrent.current = idx * initDims.step

      if (nameEl) gsap.set(nameEl, { scale: 1, top: '100%', yPercent: -100, zIndex: 0, visibility: 'visible' })
      if (navEl) gsap.set(navEl, { opacity: 1 })
      if (projNumEl) gsap.set(projNumEl, { opacity: 1 })
      if (projTitleEl) gsap.set(projTitleEl, { opacity: 1 })
      if (canvasWrap) gsap.set(canvasWrap, { opacity: 1 })

      introProgress.value = 0
      introTl = gsap.timeline()
      introTl.to(introProgress, {
        value: 1,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          introDone.current = true
        },
      })
    } else {
      if (nameEl) gsap.set(nameEl, { yPercent: -50, scale: 0.5, visibility: 'visible' })
      if (navEl) gsap.set(navEl, { opacity: 0 })
      if (canvasWrap) gsap.set(canvasWrap, { opacity: 0 })
      if (projNumEl) gsap.set(projNumEl, { opacity: 0 })
      if (projTitleEl) gsap.set(projTitleEl, { opacity: 0 })

      introTl = gsap.timeline({ delay: 0.2 })

      if (nameEl) {
        introTl.to(nameEl, {
          scale: 1,
          top: '100%',
          yPercent: -100,
          duration: 1.4,
          ease: 'power3.inOut',
        })
      }

      if (nameEl) {
        introTl.set(nameEl, { zIndex: 0 })
      }

      if (canvasWrap) {
        introTl.to(canvasWrap, {
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
        })
      }

      introTl.to(introProgress, {
        value: 1,
        duration: 1.0,
        ease: 'power3.out',
        onComplete: () => {
          introDone.current = true
          introHasPlayed = true
        },
      }, '<')

      if (navEl) {
        introTl.to(navEl, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '<')
      }

      if (projNumEl) {
        introTl.to(projNumEl, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '<')
      }

      if (projTitleEl) {
        introTl.to(projTitleEl, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '<')
      }
    }

    let raf: number
    let closestIdx = savedActiveIdx ?? 0

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const d = dimsRef.current
      const loopLen = d.step * TOTAL

      if (introDone.current) {
        const elapsed = performance.now() - lastInputTime.current
        if (elapsed > 80 && !dragging.current) {
          const t = Math.min((elapsed - 80) / 500, 1)
          const nearest = Math.round(scrollTarget.current / d.step) * d.step
          const snapDiff = nearest - scrollTarget.current
          if (Math.abs(snapDiff) < 0.3) {
            scrollTarget.current = nearest
          } else {
            scrollTarget.current += snapDiff * t * 0.06
          }
        }

        const diff = scrollTarget.current - scrollCurrent.current
        scrollCurrent.current += Math.abs(diff) > 0.05 ? diff * 0.1 : diff
      } else if (!skipIntro) {
        scrollCurrent.current = 0
      }

      const rawVel = scrollCurrent.current - prevScroll.current
      smoothVel.current += (rawVel - smoothVel.current) * 0.18
      if (Math.abs(smoothVel.current) < 0.001) smoothVel.current = 0

      barrelVel.current *= 0.93
      if (barrelVel.current < 0.001) barrelVel.current = 0

      prevScroll.current = scrollCurrent.current

      let closest = { idx: 0, dist: Infinity }

      planes.forEach(({ mesh, material }, i) => {
        material.uniforms.uVelocity.value = smoothVel.current
        material.uniforms.uBarrelVel.value = barrelVel.current

        if (d.mobile) {
          const centerX = (d.vw - d.w) / 2
          let x = centerX + i * d.step - scrollCurrent.current
          x = ((x % loopLen) + loopLen + d.step) % loopLen - d.step
          if (x > d.vw + d.w * 0.5) x -= loopLen
          if (x < -d.w * 1.5) x += loopLen

          const threeX = x + d.w / 2 - d.vw / 2
          mesh.position.set(threeX, 0, 0)
          material.uniforms.uNormY.value = 0

          const visible = x > -d.w && x < d.vw + d.w
          if (material.uniforms.uTexture.value.image) mesh.visible = visible

          if (!introDone.current) {
            const prog = introProgress.value
            mesh.position.x = threeX + (1 - prog) * 200
            mesh.scale.set(0.8 + prog * 0.2, 0.8 + prog * 0.2, 1)
            material.opacity = prog
          } else {
            mesh.scale.set(1, 1, 1)
          }

          const distFromCenter = Math.abs(x + d.w / 2 - d.vw / 2)
          if (distFromCenter < closest.dist) closest = { idx: i, dist: distFromCenter }
        } else {
          const centerY = (d.vh - d.h) / 2
          let y = centerY + i * d.step - scrollCurrent.current
          y = ((y % loopLen) + loopLen + d.step) % loopLen - d.step
          if (y > d.vh + d.h * 0.5) y -= loopLen
          if (y < -d.h * 1.5) y += loopLen

          const threeY = d.vh / 2 - (y + d.h / 2)
          mesh.position.set(0, threeY, 0)
          material.uniforms.uNormY.value = threeY / (d.vh / 2)

          const visible = y > -d.h && y < d.vh + d.h
          if (material.uniforms.uTexture.value.image) mesh.visible = visible

          if (!introDone.current) {
            const prog = introProgress.value
            mesh.position.y = threeY + (1 - prog) * 200
            mesh.scale.set(0.8 + prog * 0.2, 0.8 + prog * 0.2, 1)
            material.opacity = prog
          } else {
            mesh.scale.set(1, 1, 1)
          }

          const distFromCenter = Math.abs(y + d.h / 2 - d.vh / 2)
          if (distFromCenter < closest.dist) closest = { idx: i, dist: distFromCenter }
        }
      })

      if (closest.idx !== closestIdx) {
        closestIdx = closest.idx
        setActiveIdx(closest.idx)

        planes.forEach(({ video }, i) => {
          if (!video) return
          if (i === closest.idx) {
            video.currentTime = 0
            video.play()
          } else {
            video.pause()
          }
        })
      }

      renderer.render(scene, camera)
    }

    raf = requestAnimationFrame(tick)

    const onResize = () => {
      const d = getDims()
      dimsRef.current = d
      renderer.setSize(d.vw, d.vh)
      camera.aspect = d.vw / d.vh
      camera.position.z = d.camZ
      camera.updateProjectionMatrix()

      planes.forEach(({ mesh, material }) => {
        const newGeo = new THREE.PlaneGeometry(d.w, d.h, 32, 32)
        mesh.geometry.dispose()
        mesh.geometry = newGeo
        material.uniforms.uPlaneSize.value.set(d.w, d.h)
        material.uniforms.uCardRatio.value = 2 * d.h / d.vh
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      introTl?.kill()
      renderer.dispose()
      planes.forEach(({ mesh, material, video }) => {
        mesh.geometry.dispose()
        material.dispose()
        if (video) {
          video.pause()
          video.src = ''
          video.load()
        }
      })
    }
  }, [getDims])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    savedActiveIdx = activeIdx
  }, [activeIdx])

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (!introDone.current) return
      e.preventDefault()
      const d = dimsRef.current
      const raw = d.mobile
        ? (e.deltaMode === 1 ? e.deltaX * 40 : e.deltaX) || (e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY)
        : (e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY)
      scrollTarget.current += raw * 0.4
      barrelVel.current = Math.min(Math.max(barrelVel.current, Math.abs(raw) * 0.015), 2)
      lastInputTime.current = performance.now()
    }
    window.addEventListener('wheel', handler, { passive: false })
    return () => window.removeEventListener('wheel', handler)
  }, [])

  useEffect(() => {
    let pointerDown = false
    let lastDragClient = 0

    const down = (e: PointerEvent) => {
      if (!introDone.current) return
      if ((e.target as HTMLElement).closest('a, button')) return
      pointerDown = true
      dragging.current = false
      const d = dimsRef.current
      const pos = d.mobile ? e.clientX : e.clientY
      dragStart.current = pos
      dragTarget0.current = scrollTarget.current
      lastDragClient = pos
    }
    const move = (e: PointerEvent) => {
      if (!pointerDown) return
      e.preventDefault()
      const d = dimsRef.current
      const pos = d.mobile ? e.clientX : e.clientY
      if (!dragging.current) {
        if (Math.abs(pos - dragStart.current) < 5) return
        dragging.current = true
      }
      const dragDelta = Math.abs(pos - lastDragClient)
      barrelVel.current = Math.min(Math.max(barrelVel.current, dragDelta * 0.02), 2)
      lastDragClient = pos
      lastInputTime.current = performance.now()
      scrollTarget.current = dragTarget0.current - (pos - dragStart.current)
    }
    const up = () => {
      pointerDown = false
      if (!dragging.current) return
      dragging.current = false
      lastInputTime.current = performance.now()
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])


  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#151515',
        overflow: 'hidden',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* FRANCHEC intro text */}
      <div
        ref={nameRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          zIndex: 20,
          pointerEvents: 'none',
          textAlign: 'center',
          lineHeight: 1,
          visibility: 'hidden',
        }}
      >
        <span
          style={{
            fontFamily: "'Host Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '19vw',
            color: '#fff',
            whiteSpace: 'nowrap',
            display: 'block',
            letterSpacing: '-0.03em',
          }}
        >
          FRANCHEC
        </span>
      </div>

      {/* Three.js canvas */}
      <div
        ref={canvasWrapRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Fixed UI overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          color: '#fff',
          padding: '24px 28px',
        }}
      >
        {/* Top nav */}
        <nav
          ref={navRef}
          style={{
            position: 'absolute',
            top: 12,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pointerEvents: 'auto',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            fontWeight: 500,
            letterSpacing: 'normal',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#fff',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Work
          </Link>
          <div style={{ display: 'flex', gap: 24 }}>
            <a
              href="/info"
              onClick={(e) => {
                e.preventDefault()
                triggerTransition('/info')
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Info
            </a>
            <a
              href="mailto:francheccrespo@gmail.com"
              className="hidden md:inline"
              style={{
                color: '#fff',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              Contact
            </a>
          </div>
        </nav>

        {isMobile ? (
          <div
            ref={projNumRef}
            style={{
              position: 'absolute',
              bottom: '22%',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.75rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            <span>
              {String(activeIdx + 1).padStart(2, '0')}/{String(TOTAL).padStart(2, '0')}
            </span>
            <span>{projects[activeIdx].title}</span>
          </div>
        ) : (
          <>
            {/* Project number — left of card */}
            <div
              ref={projNumRef}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 'calc((100% - min(42%, 720px)) / 2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 400,
                letterSpacing: '0.1em',
                color: '#fff',
              }}
            >
              {String(activeIdx + 1).padStart(2, '0')}/{String(TOTAL).padStart(2, '0')}
            </div>

            {/* Project title — right of card */}
            <div
              ref={projTitleRef}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: 'calc((100% - min(42%, 720px)) / 2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              {projects[activeIdx].title}
            </div>
          </>
        )}

      </div>

      {/* Invisible click targets for cards */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          onClick={() => {
            if (introDone.current) {
              triggerTransition(`/project/${projects[activeIdx].slug}`)
            }
          }}
          style={{
            width: isMobile ? '75%' : '42%',
            maxWidth: isMobile ? undefined : 720,
            aspectRatio: '100/62',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        />
      </div>
    </div>
  )
}
