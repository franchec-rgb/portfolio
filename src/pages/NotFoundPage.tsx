import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'

export default function NotFoundPage() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Background image */}
      <img
        src="/images/pr-background.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Subtle dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.25)',
          pointerEvents: 'none',
        }}
      />

      {/* Navigation */}
      <Navigation theme="dark" showCenteredName={true} />

      {/* Center info block */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 'clamp(48px, 10vw, 120px)',
          alignItems: 'flex-start',
        }}
      >
        {[0, 1].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: '#fff',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Page not found
            </span>
            <Link
              to="/"
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: '#fff',
                textTransform: 'uppercase',
                textDecoration: 'underline',
                whiteSpace: 'nowrap',
              }}
            >
              Back home
            </Link>
          </div>
        ))}
      </div>

      {/* Large "404" text at the bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          lineHeight: 0.85,
          pointerEvents: 'none',
          userSelect: 'none',
          padding: '0 clamp(0px, 1vw, 16px)',
        }}
      >
        {['4', '0', '4'].map((digit, i) => (
          <span
            key={i}
            style={{
              fontSize: 'clamp(180px, 25vw, 340px)',
              fontWeight: 400,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.85,
            }}
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  )
}
