import { useEffect, useRef, useState } from 'react'
import { CalendarDays, MapPin, Menu, MessageCircle, X } from 'lucide-react'
import { LINKS, MAP_ROUTE, wa } from '../data'

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    const updateHeader = () => setSolid(window.scrollY > 40)
    updateHeader()

    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFrame = window.requestAnimationFrame(() =>
      closeRef.current?.focus()
    )

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }

      if (event.key !== 'Tab' || !menuRef.current) return

      const focusable = menuRef.current.querySelectorAll(
        'button:not([disabled]), a[href]'
      )

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
      triggerRef.current?.focus()
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/5 transition-all duration-300 ${
          solid || open
            ? 'bg-bg/95 shadow-lg shadow-black/20 backdrop-blur-md'
            : ''
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 ${
            solid ? 'h-14 md:h-16' : 'h-16 md:h-20'
          }`}
        >
          <a
            href="#inicio"
            aria-label="Estatus Lounge"
            className="inline-flex min-h-11 min-w-11 items-center"
          >
            <img
              src={`${import.meta.env.BASE_URL}img/logo-estatus.png`}
              alt="Estatus Lounge"
              className={`w-auto transition-[height] duration-300 ${
                solid ? 'h-9 md:h-10' : 'h-10 md:h-12'
              }`}
            />
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-8 md:flex"
          >
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="inline-flex min-h-11 min-w-11 items-center text-sm font-semibold text-muted transition hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            ref={triggerRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition hover:bg-white/10 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-0 z-[60] flex flex-col justify-center overflow-y-auto bg-bg px-7 py-8 animate-[menu-in_300ms_cubic-bezier(.2,.8,.2,1)_both] md:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu()
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={closeMenu}
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-text transition hover:border-gold hover:text-gold"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>

          <nav aria-label="Navegação mobile" className="flex flex-col gap-5">
            {LINKS.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={closeMenu}
                className="font-display text-5xl leading-none text-text transition hover:text-gold"
                style={{ transitionDelay: `${index * 35}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <nav
        aria-label="Ações rápidas"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-white/10 bg-surface/95 px-2 pt-1 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.25rem)' }}
      >
        <a
          href="#eventos"
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs font-bold text-muted transition hover:text-gold"
        >
          <CalendarDays size={18} />
          Eventos
        </a>

        <a
          href={wa('Olá! Gostaria de consultar reservas no Estatus Lounge.')}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs font-bold text-gold transition hover:text-text"
          aria-label="Reservar pelo WhatsApp"
        >
          <MessageCircle size={18} />
          Reservar
        </a>

        <a
          href={MAP_ROUTE}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs font-bold text-muted transition hover:text-gold"
        >
          <MapPin size={18} />
          Como chegar
        </a>
      </nav>
    </>
  )
}
