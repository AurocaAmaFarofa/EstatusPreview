import { Clock, MapPin, Navigation } from 'lucide-react'
import { ADDRESS, MAP_EMBED, MAP_ROUTE } from '../data'
import Reveal from './Reveal'

export default function Location() {
  return (
    <section
      id="localizacao"
      className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-5 md:gap-10 md:py-32"
    >
      <Reveal className="md:col-span-2">
        <h2 className="h2">Como chegar</h2>
        <p className="mt-6 flex gap-3 text-base leading-relaxed text-text">
          <MapPin className="mt-1 shrink-0 text-gold" size={20} />
          {ADDRESS}
        </p>
        <p className="mt-4 flex gap-3 text-base text-muted">
          <Clock className="mt-1 shrink-0 text-gold" size={20} />
          A partir das 18h
        </p>
        <a
          href={MAP_ROUTE}
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-7"
        >
          <Navigation size={18} />
          Abrir rota no Google Maps
        </a>
      </Reveal>
      <Reveal delay={100} className="md:col-span-3">
        <iframe
          title="Mapa do Estatus Lounge"
          src={MAP_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-64 w-full rounded-3xl border border-white/10 [filter:grayscale(1)_invert(.9)_contrast(.9)] md:h-full md:min-h-[24rem]"
        />
      </Reveal>
    </section>
  )
}
