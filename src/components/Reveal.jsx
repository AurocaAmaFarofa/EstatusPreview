import { useEffect, useRef } from 'react'
export default function Reveal({ children, delay = 0, className = '' }) {
  const r = useRef(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { e.target.classList.add('in'); io.disconnect() } }, { threshold: 0.12 })
    io.observe(r.current)
    return () => io.disconnect()
  }, [])
  return <div ref={r} style={{ '--d': `${delay}ms` }} className={`reveal ${className}`}>{children}</div>
}
