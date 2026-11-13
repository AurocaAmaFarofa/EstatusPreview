import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, Clock, MessageCircle, X } from 'lucide-react'
import { EVENTS, wa } from '../data'
import Reveal from './Reveal'

const EVENT_FIELDS = new Set([
  'title',
  'date',
  'time',
  'desc',
  'img',
  'image',
  'imageUrl',
  'grad',
  'poster',
  'cartaz',
  'posterUrl',
  'isExample',
  'status',
  'startsAt',
])

const TRANSITION_MS = 480
const cardFrames = new WeakMap()

function supportsCardTilt() {
  return (
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getModalTargetRect() {
  const mobile = window.innerWidth < 768
  const margin = mobile ? 10 : 28

  const width = Math.min(mobile ? 720 : 960, window.innerWidth - margin * 2)

  const height = Math.min(mobile ? 900 : 700, window.innerHeight - margin * 2)

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  }
}

export default function Events() {
  const [selected, setSelected] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const closeTimerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)

  // Movimento 3D dos cards

  const handleCardMouseMove = (event) => {
    if (!supportsCardTilt()) return

    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const moveX = (x - 0.5) * 24
    const moveY = (y - 0.5) * 24
    const rotateX = (0.5 - y) * 8
    const rotateY = (x - 0.5) * 8
    const halo = card.parentElement

    window.cancelAnimationFrame(cardFrames.get(card))
    const frame = window.requestAnimationFrame(() => {
      card.style.setProperty('--card-move-x', `${moveX}px`)
      card.style.setProperty('--card-move-y', `${moveY}px`)
      card.style.setProperty('--card-rotate-x', `${rotateX}deg`)
      card.style.setProperty('--card-rotate-y', `${rotateY}deg`)
      card.style.setProperty('--card-pointer-x', `${x * 100}%`)
      card.style.setProperty('--card-pointer-y', `${y * 100}%`)
      card.style.setProperty('--card-glow-opacity', '1')
      halo?.style.setProperty('--card-pointer-x', `${x * 100}%`)
      halo?.style.setProperty('--card-pointer-y', `${y * 100}%`)
      halo?.style.setProperty('--card-glow-opacity', '1')
    })
    cardFrames.set(card, frame)
  }

  const handleCardMouseLeave = (event) => {
    const card = event.currentTarget
    const halo = card.parentElement

    window.cancelAnimationFrame(cardFrames.get(card))
    const frame = window.requestAnimationFrame(() => {
      card.style.setProperty('--card-move-x', '0px')
      card.style.setProperty('--card-move-y', '0px')
      card.style.setProperty('--card-rotate-x', '0deg')
      card.style.setProperty('--card-rotate-y', '0deg')
      card.style.setProperty('--card-glow-opacity', '0')
      halo?.style.setProperty('--card-glow-opacity', '0')
    })
    cardFrames.set(card, frame)
  }

  const openEvent = (event, trigger) => {
    window.clearTimeout(closeTimerRef.current)

    const rect = trigger.getBoundingClientRect()

    const originRect = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }

    setIsExpanded(false)
    setSelected({ event, trigger, originRect })
  }

  const closeEvent = () => {
    if (!selected) return

    window.clearTimeout(closeTimerRef.current)

    // O modal retorna à posição original do card.
    setIsExpanded(false)

    closeTimerRef.current = window.setTimeout(() => {
      setSelected(null)
    }, TRANSITION_MS)
  }

  useEffect(() => {
    if (!selected) return undefined

    // Dois frames garantem que o navegador registre
    // a posição inicial antes de iniciar a expansão.
    let secondFrame

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsExpanded(true)
        closeButtonRef.current?.focus()
      })
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeEvent()
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button:not([disabled]), a[href]'
        )

        if (!focusable.length) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(firstFrame)

      if (secondFrame) {
        window.cancelAnimationFrame(secondFrame)
      }

      document.removeEventListener('keydown', handleKeyDown)

      if (selected.trigger?.isConnected) {
        selected.trigger.focus()
      }
    }

    // O listener acompanha o evento selecionado.
    // closeEvent utiliza os dados atuais desse evento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    return () => window.clearTimeout(closeTimerRef.current)
  }, [])

  const modalRect = selected ? getModalTargetRect() : null

  const activeRect = selected
    ? isExpanded
      ? modalRect
      : selected.originRect
    : null

  return (
    <>
      <section
        id="eventos"
        aria-hidden={selected ? 'true' : undefined}
        className="relative overflow-hidden bg-graphite py-24 md:py-36"
      >
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-turquoise/30 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="h2">Próximos eventos</h2>

            <p className="mt-4 max-w-lg text-white/65">
              Festas, shows e noites com atrações. Os eventos abaixo são
              exemplos visuais e serão trocados pela programação real.
            </p>
          </Reveal>

          <div
            className={`events-scroller -mx-5 mt-10 gap-5 px-5 pb-3 ${
              EVENTS.length === 1
                ? 'flex justify-center overflow-visible md:mx-0 md:px-0 md:pb-0'
                : 'flex snap-x snap-mandatory overflow-x-auto md:mx-0 md:grid md:auto-rows-fr md:grid-cols-3 md:gap-9 md:overflow-visible md:px-0 md:pb-0'
            }`}
          >
            {EVENTS.map((event, index) => {
              const cardImage = event.img || event.image || event.imageUrl

              return (
                <Reveal
                  key={`${event.title}-${index}`}
                  delay={index * 120}
                  className={
                    EVENTS.length === 1
                      ? 'w-full max-w-md'
                      : 'w-[62%] shrink-0 snap-center md:w-auto md:shrink'
                  }
                >
                  <div className="relative isolate h-full">
                    <div
                      aria-hidden="true"
                      className="event-card-halo pointer-events-none absolute inset-0 rounded-[2rem]"
                    />
                    <article
                      role="button"
                      tabIndex={0}
                      aria-haspopup="dialog"
                      aria-label={`Abrir detalhes do evento ${event.title}`}
                      onClick={(e) => openEvent(event, e.currentTarget)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          openEvent(event, e.currentTarget)
                        }
                      }}
                      onMouseMove={handleCardMouseMove}
                      onMouseLeave={handleCardMouseLeave}
                      className="event-card group relative z-10 flex h-full cursor-pointer select-none flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-[#1b2b35] via-surface to-bg outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <div
                        data-event-visual
                        className={`event-card-visual relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${
                          event.grad || 'from-surface-2 to-bg'
                        }`}
                      >
                        {cardImage && (
                          <img
                            src={cardImage}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        )}

                        <div className="grain absolute inset-0 opacity-20 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      </div>

                      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 md:px-6 md:pb-7">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {event.isExample && (
                            <span className="rounded-full border border-gold/45 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
                              Evento de exemplo
                            </span>
                          )}
                          {event.status && (
                            <span className="rounded-full border border-white/25 px-3 py-1 text-xs font-bold text-text">
                              {event.status}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-3xl leading-tight text-text">
                          {event.title}
                        </h3>

                        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gold">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={15} />
                            {event.date}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Clock size={15} />
                            {event.time}
                          </span>
                        </p>

                        <p className="mt-2 line-clamp-2 text-base text-muted">
                          {event.desc}
                        </p>

                        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-text transition group-hover:text-gold">
                          <MessageCircle size={17} />
                          Ver detalhes e reservar
                        </span>
                      </div>
                    </article>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {selected &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2147483000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              isolation: 'isolate',
            }}
          >
            {/* Fundo escuro com desfoque */}
            <button
              type="button"
              aria-label="Fechar detalhes do evento"
              tabIndex={-1}
              onClick={closeEvent}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 0,
                background: 'rgba(0, 0, 0, 0.52)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                opacity: isExpanded ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms ease`,
                cursor: 'default',
              }}
            />

            {/* Modal que se expande a partir do card */}
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-dialog-title"
              tabIndex={-1}
              style={{
                position: 'fixed',
                zIndex: 1,

                left: activeRect.left,
                top: activeRect.top,
                width: activeRect.width,
                height: activeRect.height,

                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
                overflowY: isExpanded ? 'auto' : 'hidden',

                borderRadius: isExpanded
                  ? window.innerWidth < 768
                    ? 24
                    : 30
                  : 30,

                background: 'rgba(21, 21, 27, 0.94)',
                color: '#F5F3EE',

                border: '1px solid rgba(255, 255, 255, 0.18)',

                backdropFilter: 'blur(28px) saturate(155%)',
                WebkitBackdropFilter: 'blur(28px) saturate(155%)',
                containerType: 'inline-size',

                boxShadow: '0 25px 100px rgba(0, 0, 0, 0.55)',

                transition: [
                  `left ${TRANSITION_MS}ms cubic-bezier(.22, 1, .36, 1)`,
                  `top ${TRANSITION_MS}ms cubic-bezier(.22, 1, .36, 1)`,
                  `width ${TRANSITION_MS}ms cubic-bezier(.22, 1, .36, 1)`,
                  `height ${TRANSITION_MS}ms cubic-bezier(.22, 1, .36, 1)`,
                  `border-radius ${TRANSITION_MS}ms ease`,
                ].join(', '),

                willChange: 'left, top, width, height',
              }}
            >
              {(() => {
                const { event } = selected

                const eventImage = event.img || event.image || event.imageUrl

                const posterImage =
                  event.poster || event.cartaz || event.posterUrl || eventImage

                const backgroundImage = eventImage || posterImage

                const additionalInfo = Object.entries(event).filter(
                  ([key, value]) =>
                    !EVENT_FIELDS.has(key) &&
                    ['string', 'number', 'boolean'].includes(typeof value)
                )

                return (
                  <>
                    {/* Botão de fechar */}
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={closeEvent}
                      aria-label="Fechar detalhes do evento"
                      className="absolute right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/70 text-text shadow-lg backdrop-blur-xl transition-all duration-300 hover:rotate-90 hover:border-gold hover:bg-gold hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      <X size={21} strokeWidth={2.5} />
                    </button>

                    {/* Conteúdo principal */}
                    <div className="event-dialog-layout grid min-h-min flex-none grid-cols-1 md:min-h-0 md:flex-1">
                      {/* Área da imagem e do cartaz */}
                      <div
                        className={`relative flex h-[42dvh] min-h-[250px] max-h-[420px] items-center justify-center overflow-hidden bg-gradient-to-br ${
                          event.grad || 'from-slate-800 to-slate-950'
                        } md:h-full md:min-h-0 md:max-h-none`}
                      >
                        {/* Imagem de fundo do evento */}
                        {backgroundImage && (
                          <img
                            src={backgroundImage}
                            alt=""
                            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl"
                          />
                        )}

                        <div className="absolute inset-0 bg-black/20" />

                        {/* Cartaz */}
                        {posterImage ? (
                          <img
                            src={posterImage}
                            alt={``}
                            className="relative z-10 max-h-full max-w-full object-contain px-3 py-3 drop-shadow-2xl"
                          />
                        ) : (
                          <div className="relative z-10 px-8 text-center">
                            <p className="font-display text-3xl font-extrabold">
                              {event.title}
                            </p>
                            <p className="mt-3 text-sm text-white/60">
                              Cartaz não disponível
                            </p>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                      </div>

                      {/* Área das informações */}
                      <div className="min-h-0 overflow-x-hidden md:overflow-y-auto md:overscroll-contain">
                        <div className="px-5 py-6 sm:px-7 md:px-8 md:py-9">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                            Informações do evento
                          </p>

                          <h2
                            id="event-dialog-title"
                            className="mt-3 break-words font-display text-3xl font-extrabold leading-tight sm:text-4xl"
                          >
                            {event.title}
                          </h2>

                          {/* Data e horário */}
                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                                <CalendarDays size={19} />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs text-muted">Data</p>
                                <p className="mt-1 break-words text-sm font-semibold text-white">
                                  {event.date || 'A definir'}
                                </p>
                              </div>
                            </div>

                            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                                <Clock size={19} />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs text-muted">Horário</p>
                                <p className="mt-1 break-words text-sm font-semibold text-white">
                                  {event.time || 'A definir'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Descrição */}
                          {event.desc && (
                            <div className="mt-7">
                              <h3 className="text-sm font-bold text-white">
                                Sobre o evento
                              </h3>

                              <p className="mt-2 text-base leading-relaxed text-muted">
                                {event.desc}
                              </p>
                            </div>
                          )}

                          {/* Outras informações */}
                          {additionalInfo.length > 0 && (
                            <div className="mt-6">
                              <h3 className="mb-3 text-sm font-bold text-white">
                                Mais informações
                              </h3>

                              <dl className="grid gap-3 sm:grid-cols-2">
                                {additionalInfo.map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="min-w-0 rounded-xl border border-white/10 bg-white/[0.06] p-3"
                                  >
                                    <dt className="text-xs font-bold uppercase tracking-wider text-gold">
                                      {key}
                                    </dt>

                                    <dd className="mt-1 break-words text-sm text-text">
                                      {String(value)}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          )}

                          {/* WhatsApp */}
                          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <a
                              href={wa(
                                `Olá! Quero informações sobre o evento "${event.title}".`
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-primary inline-flex w-full items-center justify-center gap-2 text-center sm:w-auto"
                            >
                              <MessageCircle size={18} />
                              Consultar ou reservar pelo WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
