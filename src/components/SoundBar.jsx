import { useEffect, useRef } from 'react'

// Sound bar horizontal sem áudio: as barras sobem da base a cada batida (BPM).
const COLOR = '#08A6D9'
const BPM = 60
const BAR = 6 // largura de cada barra (px)
const GAP = 12 // espaço entre barras (px)

const rnd = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export default function SoundBar({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    const x = c.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const t0 = performance.now()
    let raf,
      W = 0,
      H = 0,
      visible = false

    // Ajusta o canvas ao tamanho real na tela (nítido e sem distorcer)
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = c.clientWidth
      H = c.clientHeight
      c.width = W * dpr
      c.height = H * dpr
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (still) draw(performance.now())
    }

    const draw = (now) => {
      const t = (now - t0) / 1000
      const beats = (t * BPM) / 60
      const beatIdx = Math.floor(beats)
      const phase = beats % 1

      const kick = Math.exp(-phase * 6)
      const snare = 0.5 * Math.exp(-Math.abs(phase - 0.5) * 18)
      const beat = kick + snare
      const ease = 1 - Math.pow(1 - phase, 3)

      x.clearRect(0, 0, W, H)
      x.lineCap = 'round'
      x.lineWidth = BAR
      x.strokeStyle = COLOR
      x.shadowColor = COLOR
      x.shadowBlur = 7 + beat * 5

      const maxBars = window.innerWidth < 768 ? 32 : Infinity
      const N = Math.min(Math.floor(W / (BAR + GAP)), maxBars)
      const offset = (W - N * (BAR + GAP) + GAP) / 2 + BAR / 2

      x.beginPath()
      for (let i = 0; i < N; i++) {
        const px = offset + i * (BAR + GAP)

        const prev = rnd(beatIdx - 1, i)
        const next = rnd(beatIdx, i)
        const mix = prev + (next - prev) * ease
        const wave = Math.sin(i * 0.25 - beats * Math.PI) * 0.2
        const level = Math.min(1, Math.max(0, mix + wave))

        // Barras do meio um pouco mais altas que as das pontas (apague esta linha e use env = 1 se não gostar)
        const env = 0.55 + 0.45 * Math.sin((Math.PI * i) / Math.max(N - 1, 1))
        const idle = Math.sin(t * 3 + i * 0.5) * 3
        const len = Math.min(
          H - 6,
          H * (0.34 + level * 0.8 * env + beat * 0.18) + idle,
        )

        x.moveTo(px, H - 4)
        x.lineTo(px, H - 4 - len)
      }
      x.stroke()

      if (!still && visible) raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !still && !raf) raf = requestAnimationFrame(draw)
      if (!visible && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    observer.observe(c)
    if (still) draw(performance.now())

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
