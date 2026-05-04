import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import Navigation from '@/components/Navigation'
import { getProjectById, getNextProject } from '@/data/projects'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  const project = id ? getProjectById(id) : undefined
  const nextProject = project ? getNextProject(project.nextProject) : undefined

  useDocumentMeta({
    title: project ? `${project.title} — Franchec Crespo` : 'Project not found — Franchec Crespo',
    description: project?.description,
    canonical: project ? `https://franchec.com/project/${project.slug}` : undefined,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  useEffect(() => {
    if (!contentRef.current) return
    const els = contentRef.current.querySelectorAll('[data-animate]')
    gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.45 }
    )
  }, [id])

  const [footerH, setFooterH] = useState(0)

  useEffect(() => {
    if (!footerRef.current) return
    const measure = () => setFooterH(footerRef.current?.offsetHeight ?? 0)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(footerRef.current)
    return () => ro.disconnect()
  }, [id])

  useEffect(() => {
    if (!marqueeRef.current) return
    const el = marqueeRef.current
    const tween = gsap.to(el, {
      xPercent: -50,
      duration: 8,
      ease: 'none',
      repeat: -1,
    })
    return () => { tween.kill() }
  }, [id])

  if (!project) {
    return (
      <div style={{ padding: '40px', color: '#fff', background: '#151515', minHeight: '100vh' }}>
        <p>Project not found.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        overflowX: 'clip',
      }}
    >
      {/* Main content area — scrolls over the fixed footer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: '#151515',
          color: '#fff',
          marginBottom: footerH,
        }}
      >
        <Navigation theme="dark" showCenteredName={true} />

        <div
          ref={contentRef}
          className="flex flex-col md:grid pt-[120px] md:pt-[180px] px-4 md:pl-4 md:pr-16 pb-40"
          style={{
            gridTemplateColumns: '70% 1fr',
            gap: '32px',
          }}
        >
        {/* Image gallery — below copy on mobile, left on desktop */}
        <div
          data-animate
          className="order-2 md:order-1"
          style={{ opacity: 0, display: 'flex', flexDirection: 'column', gap: 0 }}
        >
          {[project.coverVideo || project.coverImage, ...project.images].map((entry, i, arr) => {
            if (Array.isArray(entry)) {
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    marginBottom: i < arr.length - 1 ? 12 : 0,
                  }}
                >
                  {entry.map((src, j) => {
                    const isPairVideo = src.endsWith('.mp4') || src.endsWith('.webm')
                    return (
                    <div
                      key={j}
                      style={{
                        flex: 1,
                        aspectRatio: '3/4',
                        background: '#1a1a1a',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {isPairVideo ? (
                        <video
                          src={src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <img
                          src={src}
                          alt={`${project.title} — image ${i + 1}-${j + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(${120 + (i * 2 + j) * 30}deg, #1a1a1a, #252525)`,
                          zIndex: -1,
                        }}
                      />
                    </div>
                    )
                  })}
                </div>
              )
            }

            const isVideo = entry.endsWith('.mp4') || entry.endsWith('.webm')
            return (
              <div
                key={i}
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  background: '#1a1a1a',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: i < arr.length - 1 ? 12 : 0,
                }}
              >
                {isVideo ? (
                  <video
                    src={entry}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <img
                    src={entry}
                    alt={`${project.title} — image ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(${120 + i * 30}deg, #1a1a1a, #252525)`,
                    zIndex: -1,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Project metadata — on top on mobile, right on desktop */}
        <div
          className="order-1 md:order-2 md:sticky md:top-[120px] md:max-h-[calc(100vh-140px)] md:overflow-y-auto md:self-start"
          style={{
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {/* Title */}
          <div data-animate style={{ opacity: 0 }}>
            <h1
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 20px)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#fff',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
              }}
            >
              {project.title}
            </h1>
          </div>

          {/* Description */}
          <div data-animate style={{ opacity: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {project.longDescription.split('\n\n').map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.72)',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Year + Brand row */}
          <div
            data-animate
            style={{
              opacity: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              paddingTop: 20,
            }}
          >
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase' }}>
                YEAR
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{project.year}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase' }}>
                BRAND
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>{project.client}</p>
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* Next Project footer — fixed behind content, revealed on scroll */}
      {nextProject && (
        <div
          ref={footerRef}
          onClick={() => navigate(`/project/${nextProject.slug}`)}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            background: '#ffffff',
            cursor: 'pointer',
            padding: '180px 40px 180px',
            overflow: 'hidden',
          }}
        >
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: 'rgba(0,0,0,0.5)',
              marginBottom: 12,
              textTransform: 'uppercase',
              textAlign: 'right',
            }}
          >
            NEXT PROJECT
          </p>
          <div
            ref={marqueeRef}
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                style={{
                  fontWeight: 500,
                  fontSize: '19vw',
                  color: '#000000',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  paddingRight: '0.3em',
                  flexShrink: 0,
                }}
              >
                {nextProject.title}
              </span>
            ))}
          </div>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              color: 'rgba(0,0,0,0.35)',
              position: 'absolute',
              bottom: 24,
              left: 40,
              textTransform: 'uppercase',
            }}
          >
            ©2026 Franchec Crespo. All Rights Reserved.
          </p>
        </div>
      )}
    </div>
  )
}
