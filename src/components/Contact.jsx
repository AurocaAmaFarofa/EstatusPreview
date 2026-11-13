import { MessageCircle } from 'lucide-react'
import { wa } from '../data'
import Reveal from './Reveal'
import SoundBar from './SoundBar'

export default function Contact() {
  return (
    <section id="contato" className="relative isolate px-5 pb-32">
      <Reveal className="contact-glass relative z-10 mx-auto max-w-5xl rounded-3xl p-7 text-center md:p-16">
        <h2 className="h2">Vem pra Estatus.</h2>
        <p className="mx-auto mt-5 max-w-md text-base text-muted">
          Entre em contato para consultar reservas.
        </p>
        <a
          href={wa('Olá! Gostaria de consultar reservas no Estatus Lounge.')}
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-8"
        >
          <MessageCircle size={18} />
          Reservar pelo WhatsApp
        </a>
        <p className="mt-6 text-base font-bold tracking-wide text-gold">
          WhatsApp: (49) 99113-2624
        </p>
      </Reveal>
      <SoundBar className="absolute bottom-0 left-0 z-0 block h-48 w-full opacity-90" />
    </section>
  )
}
