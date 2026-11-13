import { useEffect, useRef } from 'react'
// Luz suave que segue o mouse (só aparece em telas com mouse).
export default function Spotlight() {
  const r = useRef(null)
  useEffect(() => {
    const m = e => { r.current.style.background = `radial-gradient(420px circle at ${e.clientX}px ${e.clientY}px, rgba(0,194,160,.10), transparent 60%)` }
    window.addEventListener('pointermove', m); return () => window.removeEventListener('pointermove', m)
  }, [])
  return <div ref={r} className="pointer-events-none fixed inset-0 z-40 hidden [@media(hover:hover)]:block" />
}
