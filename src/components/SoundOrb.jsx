import { useEffect, useRef } from 'react'

// Visualizador circular sem áudio: as barras reagem a cada batida (BPM).
const N = 96 // quantidade de barras
const COLOR = 'rgb(0, 148, 201)' // cor única (azul-ciano)
const BPM = 80 // velocidade da batida

// Pseudo-aleatório determinístico: mesmo (batida, barra) sempre dá o mesmo valor
const rnd = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export default function SoundOrb({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    const x = c.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf
    const t0 = performance.now()

    const draw = (now) => {
      const t = (now - t0) / 1000
      const beats = (t * BPM) / 60 // quantas batidas já passaram
      const beatIdx = Math.floor(beats) // número da batida atual
      const phase = beats % 1 // posição dentro da batida (0 a 1)

      const kick = Math.exp(-phase * 6) // pulso forte no início do tempo
      const snare = 0.5 * Math.exp(-Math.abs(phase - 0.5) * 18) // pulso no meio
      const beat = kick + snare

      // Suavização: as barras migram para o novo nível ao longo da batida
      const ease = 1 - Math.pow(1 - phase, 3)

      x.clearRect(0, 0, 800, 800)
      x.lineCap = 'round'
      x.lineWidth = 7
      x.strokeStyle = COLOR
      x.shadowColor = COLOR
      x.shadowBlur = 14 + beat * 10

      x.beginPath()
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2

        // Nível anterior e novo nível da barra, sorteados por batida
        const prev = rnd(beatIdx - 1, i)
        const next = rnd(beatIdx, i)
        const mix = prev + (next - prev) * ease

        // Onda que percorre o círculo, avançando uma posição por batida
        const wave = Math.sin(i * 0.25 - beats * Math.PI) * 0.2

        const level = Math.min(1, Math.max(0, mix + wave))
        const idle = Math.sin(t * 3 + i * 0.5) * 6
        const len = 14 + level * (70 + beat * 90) + idle
        const r0 = 215 + beat * 10

        const cos = Math.cos(a),
          sin = Math.sin(a)
        x.moveTo(400 + cos * r0, 400 + sin * r0)
        x.lineTo(400 + cos * (r0 + len), 400 + sin * (r0 + len))
      }
      x.stroke()

      if (!still) raf = requestAnimationFrame(draw)
    }

    if (still) draw(performance.now())
    else raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={ref}
      width="800"
      height="800"
      aria-hidden="true"
      className={className}
    />
  )
}
