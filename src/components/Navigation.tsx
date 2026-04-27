import { Link } from 'react-router-dom'
import { usePageTransition } from '@/context/TransitionContext'

interface NavigationProps {
  theme?: 'light' | 'dark'
  showCenteredName?: boolean
}

export default function Navigation({ theme = 'light', showCenteredName = false }: NavigationProps) {
  const color = theme === 'dark' ? 'text-white' : 'text-black'
  const { triggerTransition } = usePageTransition()

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-start justify-between ${color}`}
      style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', fontWeight: 500, letterSpacing: 'normal', padding: '12px 16px' }}
    >
      <Link
        to="/"
        className="uppercase hover:underline transition-all"
      >
        WORK
      </Link>

      {showCenteredName && (
        <Link
          to="/"
          className="uppercase absolute left-1/2 -translate-x-1/2 top-3"
          style={{ fontWeight: 700, fontSize: 'clamp(18px, 7vw, 54px)', letterSpacing: 'normal', lineHeight: 1 }}
        >
          FRANCHEC
        </Link>
      )}

      <div className="flex items-start gap-6">
        <a
          href="/info"
          className="uppercase hover:underline transition-all cursor-pointer"
          onClick={(e) => {
            e.preventDefault()
            triggerTransition('/info')
          }}
        >
          INFO
        </a>
        <a
          href="mailto:hello@franchec.com"
          className="uppercase hover:underline transition-all hidden md:inline"
        >
          CONTACT
        </a>
      </div>
    </nav>
  )
}
