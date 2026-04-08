import { useState, useRef, useEffect } from 'react'
import styles from './SecNav.module.css'

const SecNav = ({ defaultSelection = 'prof', onChange }) => {
  const options = [
    { label: 'Professional', value: 'prof' },
    { label: 'Personal', value: 'pers' },
  ]

  const [activeIndex, setActiveIndex] = useState(
    options.findIndex((o) => o.value === defaultSelection)
  )
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const containerRef = useRef(null)
  const optionRefs = useRef([])
  const [measurements, setMeasurements] = useState([])

  useEffect(() => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const newMeasurements = optionRefs.current.map((el) => {
      if (!el) return { left: 0, width: 0 }
      const rect = el.getBoundingClientRect()
      return {
        left: rect.left - containerRect.left,
        width: rect.width,
      }
    })
    setMeasurements(newMeasurements)
  }, [])

  const handleSelect = (index) => {
    setActiveIndex(index)
    onChange?.(options[index].value)
  }

  const rawPillLeft = measurements[activeIndex]?.left ?? 0
  const pillLeft = rawPillLeft - 2
  const pillWidth = measurements[activeIndex]?.width ?? 0

  const rawHoverLeft = hoveredIndex !== null ? (measurements[hoveredIndex]?.left ?? 0) : 0
  const hoverLeft = rawHoverLeft - 2
  const hoverWidth = hoveredIndex !== null ? (measurements[hoveredIndex]?.width ?? 0) : 0
  const showHover = hoveredIndex !== null && hoveredIndex !== activeIndex

  const clipPath = pillWidth > 0
    ? `inset(2px calc(100% - ${pillLeft + pillWidth}px) 2px ${pillLeft}px round var(--radius-round))`
    : 'inset(0 100% 0 0)'

  return (
    <div ref={containerRef} className={styles.container} role="tablist">
      {/* Hover pill */}
      <div
        className={`${styles.hoverPill} ${showHover ? styles.hoverPillVisible : ''}`}
        style={{ width: hoverWidth || 'auto', transform: `translateX(${hoverLeft}px)` }}
      />

      {/* Active sliding pill */}
      <div
        className={styles.activePill}
        style={{ width: pillWidth || 'auto', transform: `translateX(${pillLeft}px)` }}
      />

      {/* Base label buttons */}
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => (optionRefs.current[index] = el)}
          className={styles.button}
          role="tab"
          aria-selected={index === activeIndex}
          onClick={() => handleSelect(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {option.label}
        </button>
      ))}

      {/* Clipped overlay — white text masked to the pill */}
      <div
        aria-hidden="true"
        className={styles.overlay}
        style={{ clipPath }}
      >
        {options.map((option) => (
          <span key={option.value} className={styles.overlayLabel}>
            {option.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SecNav
