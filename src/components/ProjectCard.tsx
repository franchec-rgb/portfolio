import { forwardRef, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  isActive?: boolean
  // CardCarousel registers a per-frame draw function here so it can push
  // rel position + scroll velocity without triggering React re-renders
  onDrawReady?: (draw: (rel: number, velocity: number) => void) => void
}

export const CARD_WIDTH = 520
export const CARD_HEIGHT = 350

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, isActive = false, onDrawReady }, ref) => {
    const navigate = useNavigate()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)
    const imgLoadedRef = useRef(false)

    const handleClick = () => navigate(`/project/${project.slug}`)

    const draw = useCallback((_rel: number, _velocity: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

      if (!imgLoadedRef.current || !imgRef.current) {
        const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
        grad.addColorStop(0, '#d0d0d0')
        grad.addColorStop(0.5, '#e8e8e8')
        grad.addColorStop(1, '#c8c8c8')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
        return
      }

      const img = imgRef.current
      const scale = Math.max(CARD_WIDTH / img.width, CARD_HEIGHT / img.height)
      const sw = CARD_WIDTH / scale
      const sh = CARD_HEIGHT / scale
      const sx = (img.width - sw) / 2
      const sy = (img.height - sh) / 2

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, CARD_WIDTH, CARD_HEIGHT)
    }, [])

    // Load image once, then draw the initial state
    useEffect(() => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
        img.onload = () => {
        imgRef.current = img
        imgLoadedRef.current = true
        draw(0, 0)   // initial draw with zero velocity
      }
      img.src = project.coverImage
    }, [project.coverImage, draw])

    // Register draw function with CardCarousel
    useEffect(() => {
      onDrawReady?.(draw)
    }, [draw, onDrawReady])

    return (
      <div
        ref={ref}
        onClick={handleClick}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: 'absolute',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
          boxShadow: isActive
            ? '0 24px 60px rgba(0,0,0,0.22)'
            : '0 8px 30px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />

        {/* Hover overlay */}
        <div
          className="card-hover-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0)',
            transition: 'background 0.3s ease',
            transform: 'translateZ(1px)',
            pointerEvents: 'none',
          }}
        />
      </div>
    )
  }
)

ProjectCard.displayName = 'ProjectCard'
export default ProjectCard
