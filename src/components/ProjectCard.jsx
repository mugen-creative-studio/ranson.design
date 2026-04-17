import { useEffect, useRef, useState } from 'react'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ id, title, description, image, isRevealed, onCenter }) {
  const cardRef = useRef(null)
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
        onCenter?.(id, false)
        return
      }
      const el = cardRef.current
      if (!el) return
      observer = new IntersectionObserver(
        ([entry]) => {
          onCenter?.(id, entry.isIntersecting)
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
  }, [id, onCenter])

  // Lose the local tap-close state when this card stops being the revealed one.
  useEffect(() => {
    if (!isRevealed) setExpanded(false)
  }, [isRevealed])

  function handleClick() {
    if (!window.matchMedia('(max-width: 991px)').matches) return
    if (!isRevealed) return
    setExpanded((e) => !e)
  }

  const revealed = isRevealed && !expanded

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
