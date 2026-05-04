import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import Navigation from '@/components/Navigation'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export default function InfoPage() {
  useDocumentMeta({
    title: 'About — Franchec Crespo',
    description: 'Design leader based in LA. 18+ years across Nike SNKRS, .SWOOSH, Apple, and Critical Mass. Working at the intersection of product design, brand, and immersive experiences.',
    canonical: 'https://franchec.com/info',
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const redOffsetRef = useRef<SVGFEOffsetElement>(null)
  const blueOffsetRef = useRef<SVGFEOffsetElement>(null)

  const handleImgEnter = useCallback(() => {
    gsap.to(redOffsetRef.current, { attr: { dx: -2 }, duration: 0.3, ease: 'power2.out' })
    gsap.to(blueOffsetRef.current, { attr: { dx: 2 }, duration: 0.3, ease: 'power2.out' })
  }, [])

  const handleImgLeave = useCallback(() => {
    gsap.to(redOffsetRef.current, { attr: { dx: 0 }, duration: 0.3, ease: 'power2.out' })
    gsap.to(blueOffsetRef.current, { attr: { dx: 0 }, duration: 0.3, ease: 'power2.out' })
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    if (!contentRef.current) return
    const targets = contentRef.current.querySelectorAll('[data-animate]')
    gsap.fromTo(
      targets,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      }
    )
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: '#ffffff',
        color: '#000000',
        position: 'relative',
      }}
    >
      <Navigation theme="light" showCenteredName={true} />

      {/* Fixed profile image */}
      <div
        ref={contentRef}
        className="flex flex-col md:flex-row px-4 md:pr-16 pb-16 pt-[120px] md:pt-[180px]"
        style={{
          gap: '32px',
          alignItems: 'flex-start',
        }}
      >
        {/* SVG filter for chromatic aberration */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <filter id="chroma-split" colorInterpolationFilters="sRGB">
              <feOffset ref={redOffsetRef} in="SourceGraphic" dx="0" dy="0" result="red-shifted" />
              <feOffset in="SourceGraphic" dx="0" dy="0" result="green-base" />
              <feOffset ref={blueOffsetRef} in="SourceGraphic" dx="0" dy="0" result="blue-shifted" />
              <feColorMatrix in="red-shifted" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
              <feColorMatrix in="green-base" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
              <feColorMatrix in="blue-shifted" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
              <feBlend mode="screen" in="red" in2="green" result="rg" />
              <feBlend mode="screen" in="rg" in2="blue" />
            </filter>
          </defs>
        </svg>

        {/* Left: Profile image */}
        <div
          data-animate
          onMouseEnter={handleImgEnter}
          onMouseLeave={handleImgLeave}
          className="w-full md:w-[40vw]"
          style={{
            opacity: 0,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img
            src="/images/profile-photo.jpg"
            alt="Franchec Crespo"
            style={{
              width: '100%',
              display: 'block',
              filter: 'url(#chroma-split) grayscale(10%)',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>

        {/* Spacer */}
        <div className="hidden md:block" style={{ width: '48px', flexShrink: 0 }} />

        {/* Right: Bio content */}
        <div className="w-full md:max-w-[500px]" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Top meta row */}
          <div
            data-animate
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              opacity: 0,
            }}
          >
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05rem', color: '#000000', lineHeight: 1.2 }}>
                FRANCHEC CRESPO
                <br />
                BASED IN LA
              </p>
            </div>
            <div className="md:text-left" style={{ textAlign: 'left', justifySelf: 'end' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05rem', color: '#000000', lineHeight: 1.2 }}>
                18 YRS.
                <br />
                EXPERIENCE
              </p>
            </div>
          </div>

          {/* Main bio headline */}
          <h1
            data-animate
            style={{
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: 1.4,
              color: '#000000',
              opacity: 0,
              letterSpacing: 'normal',
            }}
          >
            I am a creative leader who dances between the worlds of Product Design, Art Direction, and Tech. The industry's never known exactly where to place me. But that space in-between? That's where the real design begins.
          </h1>

          {/* Secondary bio */}
          <p
            data-animate
            style={{
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: 1.4,
              color: '#000000',
              opacity: 0,
              maxWidth: '100%',
            }}
          >
            I'm a storyteller, driven to craft beautiful, unexpected experiences that make people pause and ask, "Is this real?" I'm inspired by work that lives at the intersection of product design, 3D technologies, and immersive experiences. That's where I aim to keep building, shaping the future of storytelling and commerce in meaningful, memorable ways.
          </p>

          {/* Contact link */}
          <div data-animate style={{ opacity: 0 }}>
            <a
              href="mailto:francheccrespo@gmail.com"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: '#000000',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.4)',
                paddingBottom: '2px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#000000'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.4)'
              }}
            >
              CONTACT ME
            </a>
          </div>

          {/* Experience section */}
          <div data-animate style={{ opacity: 0, marginTop: 48 }}>
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05rem',
                textTransform: 'uppercase',
                marginBottom: 32,
              }}
            >
              Experience
            </h2>

            {[
              { company: 'SNKRS @ NIKE', title: 'PRODUCT DESIGN DIRECTOR', dates: '09/25 – PRESENT' },
              { company: '.SWOOSH @ NIKE', title: 'PRODUCT DESIGN DIRECTOR', dates: '07/22 – 09/25' },
              { company: 'APPLE', title: 'SENIOR INTERACTIVE ART DIRECTOR', dates: '10/20 – 07/22' },
              { company: 'APPLE', title: 'INTERACTIVE ART DIRECTOR', dates: '11/17 – 10/20' },
              { company: 'CRITICAL MASS', title: 'ART DIRECTOR', dates: '02/16 – 11/17' },
              { company: 'AND MUCH MORE', title: '', dates: '05/07 – 02/16' },
            ].map((role, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '20px 0',
                  borderTop: '1px solid rgba(0,0,0,0.15)',
                }}
              >
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.05rem' }}>{role.company}</p>
                  {role.title && (
                    <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.05rem' }}>{role.title}</p>
                  )}
                </div>
                <p style={{ fontSize: 12, fontWeight: 400, whiteSpace: 'nowrap', letterSpacing: '0.05rem' }}>{role.dates}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
