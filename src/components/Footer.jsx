import {
  CircleAlert,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
} from 'lucide-react'
import {
  ADDRESS,
  INSTAGRAM_URL,
  LINKS,
  MAP_ROUTE,
  wa,
} from '../data'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface px-5 pb-8 pt-12 md:pt-16">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center">
        <div className="flex items-center gap-3 text-gold">
          <CircleAlert size={28} aria-hidden="true" />
          <div>
            <p className="font-display text-3xl leading-none">18+</p>
            <p className="mt-1 text-sm font-bold text-text">
              Venda proibida para menores de 18 anos
            </p>
          </div>
        </div>
        <p className="font-display text-5xl leading-none tracking-wide text-text">
          ESTATUS
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 py-8 md:grid-cols-3 md:gap-10">
        <nav aria-label="Navegação do rodapé">
          <h2 className="font-display text-2xl text-text">Navegação</h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="inline-flex min-h-11 min-w-11 items-center text-base text-muted transition hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-2xl text-text">Contato</h2>
          <div className="mt-3 flex items-center gap-2">
            <a
              href={wa()}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp do Estatus Lounge"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-text transition hover:border-gold hover:text-gold"
            >
              <MessageCircle size={20} />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do Estatus Lounge"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-text transition hover:border-gold hover:text-gold"
            >
              <Instagram size={20} />
            </a>
            <span className="text-base font-bold text-gold">
              (49) 99113-2624
            </span>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-text">Localização</h2>
          <p className="mt-4 flex gap-3 text-base text-muted">
            <MapPin className="mt-1 shrink-0 text-gold" size={18} />
            {ADDRESS}
          </p>
          <p className="mt-3 flex gap-3 text-base text-muted">
            <Clock className="mt-1 shrink-0 text-gold" size={18} />
            A partir das 18h
          </p>
          <a
            href={MAP_ROUTE}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-gold hover:text-text"
          >
            <Navigation size={17} />
            Abrir rota no Google Maps
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-sm text-muted">
        Beba com moderação.
      </p>
    </footer>
  )
}
