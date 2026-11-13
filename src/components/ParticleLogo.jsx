import { useEffect, useRef } from 'react'

const SAMPLE_SIZE = 400
const SAMPLE_STEP = 6
const COLORS = ['#00f2fe', '#4facfe']

export default function ParticleLogo({
  src,
  alt = 'Logo',
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Não foi possível inicializar o Canvas da logo.')
    }

    const image = new Image()
    const sampleCanvas = document.createElement('canvas')
    sampleCanvas.width = SAMPLE_SIZE
    sampleCanvas.height = SAMPLE_SIZE
    const sampleContext = sampleCanvas.getContext('2d', {
      willReadFrequently: true,
    })
    if (!sampleContext) {
      throw new Error('Não foi possível preparar a imagem da logo.')
    }

    let particles = []
    let frame = 0
    let width = 0
    let height = 0
    let scale = 1
    let pointer = null
    let visible = true
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      scale = Math.min(width, height) / SAMPLE_SIZE
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      if (particles.length) draw()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      if (!particles.length) return

      context.save()
      context.translate((width - SAMPLE_SIZE * scale) / 2, (height - SAMPLE_SIZE * scale) / 2)
      context.scale(scale, scale)

      for (const particle of particles) {
        if (!reducedMotion && pointer) {
          const dx = particle.x - pointer.x
          const dy = particle.y - pointer.y
          const distance = Math.hypot(dx, dy)
          const radius = 76

          if (distance > 0 && distance < radius) {
            const force = (1 - distance / radius) * 2.8
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
          }
        }

        if (!reducedMotion) {
          particle.vx += (particle.originX - particle.x) * 0.035
          particle.vy += (particle.originY - particle.y) * 0.035
          particle.vx *= 0.86
          particle.vy *= 0.86
          particle.x += particle.vx
          particle.y += particle.vy
        }

        context.globalAlpha = particle.alpha
        context.fillStyle = particle.color
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }

      context.restore()
    }

    const animate = () => {
      if (!visible || reducedMotion) {
        frame = 0
        return
      }
      draw()
      frame = window.requestAnimationFrame(animate)
    }

    const sampleImage = () => {
      const imageScale = Math.min(
        (SAMPLE_SIZE * 0.88) / image.naturalWidth,
        (SAMPLE_SIZE * 0.88) / image.naturalHeight,
      )
      const imageWidth = image.naturalWidth * imageScale
      const imageHeight = image.naturalHeight * imageScale
      sampleContext.clearRect(0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
      sampleContext.drawImage(
        image,
        (SAMPLE_SIZE - imageWidth) / 2,
        (SAMPLE_SIZE - imageHeight) / 2,
        imageWidth,
        imageHeight,
      )

      const { data } = sampleContext.getImageData(
        0,
        0,
        SAMPLE_SIZE,
        SAMPLE_SIZE,
      )
      particles = []

      for (let y = 0; y < SAMPLE_SIZE; y += SAMPLE_STEP) {
        for (let x = 0; x < SAMPLE_SIZE; x += SAMPLE_STEP) {
          const alpha = data[(y * SAMPLE_SIZE + x) * 4 + 3] / 255
          if (alpha < 0.2) continue

          particles.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            alpha,
            size: 0.7 + alpha * 0.65,
            color: COLORS[Math.floor((x / SAMPLE_SIZE) * COLORS.length)],
          })
        }
      }

      resize()
      if (!reducedMotion && visible) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    const updatePointer = (event) => {
      const bounds = canvas.getBoundingClientRect()
      const offsetX = (width - SAMPLE_SIZE * scale) / 2
      const offsetY = (height - SAMPLE_SIZE * scale) / 2
      pointer = {
        x: (event.clientX - bounds.left - offsetX) / scale,
        y: (event.clientY - bounds.top - offsetY) / scale,
      }
    }

    const clearPointer = () => {
      pointer = null
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && particles.length && !reducedMotion && !frame) {
        frame = window.requestAnimationFrame(animate)
      } else if (!visible && frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    })
    visibilityObserver.observe(canvas)
    canvas.addEventListener('pointermove', updatePointer)
    canvas.addEventListener('pointerleave', clearPointer)
    const onImageLoad = () => sampleImage()
    image.addEventListener(
      'error',
      () => console.error(`Não foi possível carregar a imagem da logo: ${src}`),
      { once: true },
    )
    image.addEventListener('load', onImageLoad, { once: true })
    image.src = src

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      canvas.removeEventListener('pointermove', updatePointer)
      canvas.removeEventListener('pointerleave', clearPointer)
      image.removeEventListener('load', onImageLoad)
    }
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={`particle-logo ${className}`}
    />
  )
}
