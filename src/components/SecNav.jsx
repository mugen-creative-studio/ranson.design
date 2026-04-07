import { useRef, useState, useEffect } from 'react'
import SecNavItem from './SecNavItem.jsx'
import styles from './SecNav.module.css'

export default function SecNav({ selection, onSelect }) {
  const profRef = useRef(null)
  const persRef = useRef(null)
  const [metrics, setMetrics] = useState({ profWidth: 0, persWidth: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (profRef.current && persRef.current) {
      setMetrics({
        profWidth: profRef.current.offsetWidth,
        persWidth: persRef.current.offsetWidth,
      })
      setReady(true)
    }
  }, [])

  const isProfessional = selection === 'professional'
  const translateX = isProfessional ? 0 : metrics.profWidth

  return (
    <div className={styles.container} role="tablist">
      {ready && (
        <div
          className={styles.indicator}
          style={{
            width: isProfessional ? metrics.profWidth : metrics.persWidth,
            transform: `translateX(${translateX}px)`,
          }}
        />
      )}
      <div className={styles.items}>
        <span ref={profRef}>
          <SecNavItem
            label="Professional"
            selected={isProfessional}
            onClick={() => { if (!isProfessional) onSelect('professional') }}
          />
        </span>
        <span ref={persRef}>
          <SecNavItem
            label="Personal"
            selected={!isProfessional}
            onClick={() => { if (isProfessional) onSelect('personal') }}
          />
        </span>
      </div>
    </div>
  )
}
