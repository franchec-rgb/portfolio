import { useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import InfoPage from '@/pages/InfoPage'
import ProjectPage from '@/pages/ProjectPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { TransitionProvider } from '@/context/TransitionContext'

export default function App() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <BrowserRouter>
      <TransitionProvider overlayRef={overlayRef} pageRef={pageRef}>
        <div
          ref={overlayRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998,
            background: '#000',
            display: 'none',
            pointerEvents: 'none',
          }}
        />
        <div ref={pageRef}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </TransitionProvider>
    </BrowserRouter>
  )
}
