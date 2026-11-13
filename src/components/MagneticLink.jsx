import { useRef } from 'react'

export default function MagneticLink({
  href,
  children,
  className = '',
  target,
  rel,
}) {
  const linkRef = useRef(null)

  const moveTowardPointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - (bounds.left + bounds.width / 2)) * 0.22
    const y = (event.clientY - (bounds.top + bounds.height / 2)) * 0.22
    linkRef.current.style.setProperty(
      '--magnetic-x',
      `${Math.max(-20, Math.min(20, x))}px`,
    )
    linkRef.current.style.setProperty(
      '--magnetic-y',
      `${Math.max(-20, Math.min(20, y))}px`,
    )
  }

  const resetPosition = () => {
    linkRef.current.style.setProperty('--magnetic-x', '0px')
    linkRef.current.style.setProperty('--magnetic-y', '0px')
  }

  return (
    <span
      className="magnetic-link-area"
      onMouseEnter={moveTowardPointer}
      onMouseMove={moveTowardPointer}
      onMouseLeave={resetPosition}
    >
      <a
        ref={linkRef}
        href={href}
        target={target}
        rel={rel}
        className={`magnetic-link ${className}`}
      >
        {children}
      </a>
    </span>
  )
}
