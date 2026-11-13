import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { GALLERY } from '../data'
import Reveal from './Reveal'

const photos = GALLERY.filter((photo) => photo.isRealPhoto && photo.src)

const sizeClasses = {
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const touchStartRef = useRef(null)

  useEffect(() => {
    if (selectedIndex === null) return undefined

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
    )

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowRight') {
        setSelectedIndex((index) => (index + 1) % photos.length)
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((index) => (index - 1 + photos.length) % photos.length)
      }
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll(
          '[role="dialog"] button:not([disabled])',
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
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousBodyOverflow
      triggerRef.current?.focus()
    }
  }, [selectedIndex])

  if (photos.length === 0) {
    return <section id="galeria" className="sr-only" aria-hidden="true" />
  }

  const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex]
  const showPrevious = () =>
    setSelectedIndex((index) => (index - 1 + photos.length) % photos.length)
  const showNext = () => setSelectedIndex((index) => (index + 1) % photos.length)

  return (
    <>
      <section id="galeria" className="mx-auto max-w-7xl px-5 py-20 md:py-32">
        <Reveal>
          <h2 className="h2">Galeria</h2>
          <p className="mt-4 max-w-lg text-base text-muted">
            Clima, luz e gente. Em breve, mais fotos reais do Estatus.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 items-start gap-3 md:grid-cols-3 md:gap-5">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget
                setSelectedIndex(index)
              }}
              aria-label={`Ampliar foto: ${photo.label}`}
              className={`group relative min-h-11 w-full overflow-hidden rounded-2xl bg-surface-2 text-left shadow-lg transition-shadow hover:shadow-2xl focus-visible:outline ${sizeClasses[photo.size] || sizeClasses.landscape}`}
            >
              <img
                src={photo.src}
                alt={photo.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-10 text-sm font-bold text-white">
                {photo.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {selectedPhoto &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ampliada: ${selectedPhoto.label}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedIndex(null)
            }}
            onTouchStart={(event) => {
              touchStartRef.current = event.changedTouches[0].clientX
            }}
            onTouchEnd={(event) => {
              if (touchStartRef.current === null) return
              const distance = event.changedTouches[0].clientX - touchStartRef.current
              if (Math.abs(distance) > 50) {
                if (distance > 0) showPrevious()
                else showNext()
              }
              touchStartRef.current = null
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Fechar galeria"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-bg text-text"
            >
              <X />
            </button>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-bg text-text md:left-8"
            >
              <ArrowLeft />
            </button>
            <figure className="flex max-h-[85vh] max-w-[85vw] flex-col items-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.label}
                loading="lazy"
                className="max-h-[78vh] max-w-full object-contain"
              />
              <figcaption className="mt-3 text-center text-base text-text">
                {selectedPhoto.label}
              </figcaption>
            </figure>
            <button
              type="button"
              data-lightbox-next
              onClick={showNext}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-bg text-text md:right-8"
            >
              <ArrowRight />
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
