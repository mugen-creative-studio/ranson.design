import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import styles from './FloorNavItem.module.css'

const PADDING_H = 16
const ICON = 22
const GAP = 8
const COLLAPSED = 96

export default function FloorNavItem({ icon, label, isActive, onClick }) {
  const measurerRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(0)
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState(false)

  useLayoutEffect(() => {
    if (measurerRef.current) {
      setLabelWidth(measurerRef.current.scrollWidth)
    }
  }, [label])

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const expanded = isActive || hovered
  const expandedWidth = PADDING_H + ICON + GAP + labelWidth + PADDING_H
  const width = expanded ? expandedWidth : COLLAPSED

  return (
    <button
      type="button"
      className={`${styles.item} ${isActive ? styles.active : ''} ${expanded ? styles.expanded : ''} ${ready ? styles.ready : ''}`}
      style={{ width: `${width}px` }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span
        className={styles.label}
        style={{ width: expanded ? `${labelWidth}px` : 0 }}
      >
        {label}
      </span>
      <span ref={measurerRef} className={styles.measurer} aria-hidden="true">
        {label}
      </span>
    </button>
  )
}
