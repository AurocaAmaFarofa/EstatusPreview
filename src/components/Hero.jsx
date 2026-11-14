import { useEffect, useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { HERO_BG, MAP_ROUTE } from '../data'
import MagneticLink from './MagneticLink'
import ParticleLogo from './ParticleLogo'

function isOpenNow() {
  return new Date().getHours() >= 18
}

export default function Hero() {
  const [openNow, setOpenNow] = useState(isOpenNow)

  useEffect(() => {
    const updateOpenStatus = () => setOpenNow(isOpenNow())
    const timer = window.setInterval(updateOpenStatus, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-20 pt-24 md:pb-12"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,15,.9)_0%,rgba(5,11,15,.72)_48%,rgba(5,11,15,.32)_100%),linear-gradient(0deg,#0B0B0E_0%,transparent_38%,rgba(5,11,15,.2)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-4 md:grid-cols-[1.2fr_.8fr] md:gap-12">
        <div className="relative order-1 text-center md:text-left">
          <h1 className="relative z-10 font-display text-[clamp(3.25rem,10vw,7.25rem)] leading-[.94] tracking-tight text-text">
            <span className="block">Sua noite tem</span>
            <span className="block text-[#08a6d9]">Endereço.</span>
          </h1>
        </div>

        <div className="order-2 flex justify-center md:justify-end">
          <div className="relative flex aspect-square w-[min(90vw,560px)] items-center justify-center">
            <div
              className="pointer-events-none absolute inset-0 text-white"
              aria-hidden="true"
            >
              <svg viewBox="0 0 900 900" className="hero-orbit h-full w-full">
                <defs>
                  <path
                    id="hero-orbit-path"
                    d="M 450,450 m -420,0 a 420,420 0 1,1 840,0 a 420,420 0 1,1 -840,0"
                  />
                </defs>

                <text
                  fill="currentColor"
                  fillOpacity=".28"
                  fontSize="19"
                  fontWeight="700"
                  letterSpacing="5"
                >
                  <textPath
                    href="#hero-orbit-path"
                    textLength="2639"
                    lengthAdjust="spacing"
                  >
                    MÚSICA ✦ DRINKS ✦ EVENTOS ✦ SUA NOITE TEM ENDEREÇO ✦ MÚSICA
                    ✦ DRINKS ✦ EVENTOS ✦ SUA NOITE TEM ENDEREÇO ✦
                  </textPath>
                </text>
              </svg>
            </div>

            <div className="relative z-10 w-[74%]">
              <ParticleLogo
                src={`${import.meta.env.BASE_URL}img/logo-estatus.png`}
                alt="Estatus Lounge"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-8 w-full max-w-3xl text-center md:mt-0">
        <p className="text-sm text-white/80 sm:text-base">
          Música, experiências, drinks e momentos inesquecíveis.
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/90">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} className="text-[#00f2fe]" />
            Dionísio Cerqueira – SC
          </span>

          <span className="font-display text-base text-text">
            {openNow ? 'Aberto agora' : 'A partir das 18h'}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <MagneticLink href="#eventos" className="hero-cta-primary">
            Confira os eventos
            <ArrowUpRight size={18} />
          </MagneticLink>

          <MagneticLink
            href={MAP_ROUTE}
            target="_blank"
            rel="noreferrer"
            className="hero-cta-secondary"
          >
            Como chegar
            <ArrowUpRight size={18} />
          </MagneticLink>
        </div>
      </div>
    </section>
  )
}
