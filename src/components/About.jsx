import { Sparkles, Wine, Beer, Music, Users, ShieldCheck } from 'lucide-react'
import Reveal from './Reveal'
const ITEMS = [
  [Sparkles, 'Ambiente moderno e descontraído'],
  [Wine, 'Drinks e coquetéis'],
  [Beer, 'Seleção de cervejas'],
  [Music, 'Música e entretenimento'],
  [Users, 'Espaço para grupos e happy hour'],
  [ShieldCheck, 'Atendimento e segurança'],
]
export default function About() {
  return (
    <section
      id="sobre"
      className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:py-36"
    >
      <Reveal>
        <h2 className="h2">
          O lugar para a sua noite começar e não querer acabar.
        </h2>
        <p className="mt-6 max-w-md text-lg text-white/65">
          A Estatus é bar, tabacaria e casa de eventos. Chegue com os amigos,
          peça um drink, ouça boa música e fique pelo tempo que a noite pedir.
        </p>
      </Reveal>
      <ul className="divide-y divide-white/10 self-center">
        {ITEMS.map(([Icon, t], i) => (
          <Reveal key={t} delay={i * 60}>
            <li className="flex items-center gap-5 py-5 text-lg font-medium">
              <Icon className="text-cyan" size={22} />
              {t}
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
