import { useEffect, useRef, useState } from 'react'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ title, description, image }) {
  const cardRef = useRef(null)
  const [centered, setCentered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 991px)')
    let observer = null

    function setup() {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      if (!mql.matches) {
        setCentered(false)
        return
      }
      const el = cardRef.current
      if (!el) return
      observer = new IntersectionObserver(
        ([entry]) => {
          setCentered(entry.isIntersecting)
          if (!entry.isIntersecting) setExpanded(false)
        },
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
      )
      observer.observe(el)
    }

    setup()
    mql.addEventListener('change', setup)
    return () => {
      mql.removeEventListener('change', setup)
      if (observer) observer.disconnect()
    }
  }, [])

  function handleClick() {
    if (!window.matchMedia('(max-width: 991px)').matches) return
    if (!centered) return
    setExpanded((e) => !e)
  }

  const revealed = centered && !expanded

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${revealed ? styles.revealed : ''}`}
      onClick={handleClick}
    >
      <div
        className={styles.imageArea}
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
