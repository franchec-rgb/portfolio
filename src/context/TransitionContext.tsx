import { createContext, useContext, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

interface TransitionContextValue {
  triggerTransition: (url: string) => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function usePageTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('usePageTransition must be used within TransitionProvider')
  return ctx
}

export function TransitionProvider({
  overlayRef,
  pageRef,
  children,
}: {
  overlayRef: React.RefObject<HTMLDivElement | null>
  pageRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  const animating = useRef(false)

  const triggerTransition = useCallback((url: string) => {
    if (animating.current) return
    const overlay = overlayRef.current
    const page = pageRef.current
    if (!overlay || !page) return
    animating.current = true

    gsap.set(page, { position: 'relative', zIndex: 999 })
    gsap.set(overlay, { display: 'block', opacity: 1 })

    const recede = gsap.to(page, {
      scale: 0.9,
      opacity: 0.3,
      duration: 0.3,
      ease: 'power2.inOut',
    })

    gsap.delayedCall(0.2, () => {
      recede.kill()
      navigate(url)
      gsap.set(page, { scale: 1, opacity: 1, y: '100vh' })

      gsap.to(page, {
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' })
          gsap.set(page, { clearProps: 'transform,position,zIndex,opacity' })
          animating.current = false
        },
      })
    })
  }, [navigate, overlayRef, pageRef])

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}
