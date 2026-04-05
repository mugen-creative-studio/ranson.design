import { useEffect } from 'react'
import { useLocation } from 'react-router'
import useActiveSection from '../hooks/useActiveSection.js'
import LeftNav from '../components/LeftNav.jsx'
import HeroSection from '../components/HeroSection.jsx'
import styles from './Home.module.css'

export default function Home() {
  const active = useActiveSection()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.layout}>
      <LeftNav active={active} onNavigate={scrollTo} />
      <main className={styles.main}>
        <HeroSection />
        <section id="projects" className={styles.placeholder}>Projects</section>
        <section id="about" className={styles.placeholder}>About</section>
        <section id="contact" className={styles.placeholder}>Contact</section>
      </main>
    </div>
  )
}
