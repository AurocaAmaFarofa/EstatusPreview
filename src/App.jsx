import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Events from './components/Events'
import Gallery from './components/Gallery'
import Experience from './components/Experience'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Marquee from './components/Marquee'
import Spotlight from './components/Spotlight'
export default function App() {
  return (
    <>
      <Spotlight />
      <Header />
      <main>
        <Hero />
        <div className="bg-cyan py-3 font-display text-xl font-extrabold text-ink md:text-3xl">
          <Marquee text="EVENTOS ✦ DRINKS ✦ MÚSICA ✦ AO VIVO ✦" speed={100} />
        </div>
        <About />
        <Events />
        <Gallery />
        <Experience />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
