import { useEffect } from 'react'
import { useLocation } from 'react-router'
import useActiveSection, { SECTIONS } from '../hooks/useActiveSection.js'
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
      <nav className={styles.nav}>
        {SECTIONS.map((id) => (
          <button
            key={id}
            className={`${styles.navItem} ${active === id ? styles.active : ''}`}
            onClick={() => scrollTo(id)}
          >
            {id}
          </button>
        ))}
      </nav>
      <main className={styles.main}>
        <section id="hero" className={styles.section}>Hero</section>
        <section id="projects" className={styles.section}>Projects</section>
        <section id="about" className={styles.section}>About</section>
        <section id="contact" className={styles.section}>Contact</section>
      </main>
    </div>
  )
}
