import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router'
import useActiveSection from '../hooks/useActiveSection.js'
import useSectionSnap from '../hooks/useSectionSnap.js'
import LeftNav from '../components/LeftNav.jsx'
import HeroSection from '../components/HeroSection.jsx'
import ProjectsHeader from '../components/ProjectsHeader.jsx'
import SecNav from '../components/SecNav.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import AboutHeader from '../components/AboutHeader.jsx'
import styles from './Home.module.css'

export default function Home() {
  const active = useActiveSection()
  const { hash } = useLocation()
  const navigateTo = useSectionSnap()
  const [projectCategory, setProjectCategory] = useState('professional')
  const [fading, setFading] = useState(false)
  const pendingCategory = useRef(null)

  useEffect(() => {
    if (hash) {
      const idx = ['hero', 'projects', 'about', 'contact'].indexOf(hash.slice(1))
      if (idx !== -1) navigateTo(idx)
    }
  }, [])

  function scrollTo(id) {
    const idx = ['hero', 'projects', 'about', 'contact'].indexOf(id)
    if (idx !== -1) navigateTo(idx)
  }

  function handleCategoryChange(category) {
    if (category === projectCategory) return
    pendingCategory.current = category
    setFading(true)
  }

  function handleFadeEnd(e) {
    if (e.propertyName !== 'opacity') return
    if (pendingCategory.current) {
      setProjectCategory(pendingCategory.current)
      pendingCategory.current = null
    }
    setFading(false)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.leftColumn}>
        <LeftNav active={active} onNavigate={scrollTo} />
      </div>
      <main className={styles.main}>
        <section id="hero" className={styles.section}>
          <HeroSection />
        </section>
        <section id="projects" className={styles.section}>
          <div className={styles.projectsContent}>
            <ProjectsHeader />
            <SecNav selection={projectCategory} onSelect={handleCategoryChange} />
            <div
              className={`${styles.projectGrid} ${styles.projectGridWrapper} ${fading ? styles.projectGridFading : ''}`}
              onTransitionEnd={handleFadeEnd}
            >
              <ProjectCard title="Project Title" description="Project Description" layout="vertical" />
              <ProjectCard title="Project Title" description="Project Description" layout="vertical" />
              <ProjectCard title="Project Title" description="Project Description" layout="vertical" />
            </div>
          </div>
        </section>
        <section id="about" className={styles.section}>
          <AboutHeader />
        </section>
        <section id="contact" className={`${styles.section} ${styles.placeholder}`}>Contact</section>
      </main>
      <div className={styles.rightColumn} />
    </div>
  )
}
