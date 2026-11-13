import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

const ROWS = [
  ['Drinks', 'Coquetéis especiais, feitos para a noite.'],
  ['Cervejas', 'Geladas no ponto certo.'],
  ['Shows', 'Música e atrações para ouvir e dançar.'],
  ['Amigos', 'Mesa, grupo e happy hour sem pressa.'],
  ['Segurança', 'Conforto para você só curtir.'],
]

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef([])

  useEffect(() => {
    let frame = 0
    const updateActiveItem = () => {
      if (frame) return

      frame = window.requestAnimationFrame(() => {
        frame = 0
        const viewportCenter = window.innerHeight / 2
        let closestIndex = -1
        let closestDistance = Infinity

        itemRefs.current.forEach((item, index) => {
          if (!item) return

          const rect = item.getBoundingClientRect()
          const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter)
          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        })

        if (closestIndex !== -1) {
          setActiveIndex((current) =>
            current === closestIndex ? current : closestIndex,
          )
        }
      })
    }

    updateActiveItem()
    window.addEventListener('scroll', updateActiveItem, { passive: true })
    window.addEventListener('resize', updateActiveItem)

    return () => {
      window.removeEventListener('scroll', updateActiveItem)
      window.removeEventListener('resize', updateActiveItem)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(60%_80%_at_100%_50%,rgba(8,166,217,.12),transparent)] py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        {ROWS.map(([title, description], index) => {
          const active = activeIndex === index

          return (
            <Reveal key={title} delay={index * 50}>
              <div
                ref={(item) => {
                  itemRefs.current[index] = item
                }}
                className={`relative flex flex-col justify-between gap-2 py-5 transition-opacity duration-500 md:flex-row md:items-end md:py-7 ${
                  active ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <span
                  className={`experience-label origin-left font-display text-[clamp(2rem,8vw,5.5rem)] leading-none ${
                    active ? 'text-gold' : 'text-text'
                  }`}
                  style={{ transform: `scale(${active ? 'var(--experience-scale)' : '1'})` }}
                >
                  {title}
                </span>
                <span className="text-base text-muted md:max-w-xs md:pb-2">
                  {description}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500 ${
                    active ? 'bg-gold/70' : 'bg-white/20'
                  }`}
                  style={{ transform: `scaleX(${active ? 1 : 0.35})` }}
                />
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
