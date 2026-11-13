// Faixa de texto em movimento contínuo. 'text' se repete; o conteúdo é duplicado para o loop ser perfeito.
export default function Marquee({ text, reverse = false, speed = 30, className = '' }) {
  const row = Array.from({ length: 6 }, (_, i) => <span key={i} className="px-6">{text}</span>)
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <div className="marquee flex w-max" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        <div className="flex">{row}</div><div className="flex">{row}</div>
      </div>
    </div>
  )
}
