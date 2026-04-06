import { useRef, useState, useEffect, useCallback } from 'react'
import styles from './NavItem.module.css'

export default function NavItem({ icon: Icon, label, isActive, onClick }) {
  const labelRef = useRef(null)
  const measurerRef = useRef(null)
  const pillRef = useRef(null)
  const animationRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => {
    if (measurerRef.current) {
      setLabelWidth(measurerRef.current.scrollWidth)
    }
  }, [label])

  const initializedRef = useRef(false)

  const ICON_SIZE = 22
  const PILL_PADDING_COLLAPSED = 5
  const PILL_PADDING_V = 8
  const PILL_PADDING_H = 16
  const GAP = 8

  const collapsedWidth = ICON_SIZE + PILL_PADDING_COLLAPSED * 2
  const expandedWidth = PILL_PADDING_H + ICON_SIZE + GAP + labelWidth + PILL_PADDING_H

  useEffect(() => {
    if (!initializedRef.current && isActive && pillRef.current && labelRef.current && labelWidth > 0) {
      initializedRef.current = true
      const bgColor = 'var(--color-bg-component)'
      pillRef.current.style.width = `${expandedWidth}px`
      pillRef.current.style.padding = `${PILL_PADDING_V}px ${PILL_PADDING_H}px`
      pillRef.current.style.background = bgColor
      labelRef.current.style.width = `${labelWidth}px`
      labelRef.current.style.opacity = '1'
    } else if (!initializedRef.current && labelWidth > 0) {
      initializedRef.current = true
    }
  }, [isActive, labelWidth, expandedWidth])

  const animate = useCallback((expand, fast) => {
    if (!pillRef.current || !labelRef.current) return

    // Clear any inline styles from initialization
    if (pillRef.current) {
      pillRef.current.style.width = ''
      pillRef.current.style.padding = ''
      pillRef.current.style.background = ''
    }
    if (labelRef.current) {
      labelRef.current.style.width = ''
      labelRef.current.style.opacity = ''
    }

    if (animationRef.current) {
      animationRef.current.cancel()
      animationRef.current = null
    }

    const duration = fast ? 200 : 450
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'

    const bgColor = fast ? 'var(--color-bg-component)' : 'var(--color-bg-hover)'
    const bgFrom = expand ? 'transparent' : bgColor
    const bgTo = expand ? bgColor : 'transparent'

    const circleWidth = ICON_SIZE + PILL_PADDING_V * 2

    if (expand) {
      const pillKeyframes = [
        {
          width: `${collapsedWidth}px`,
          padding: `${PILL_PADDING_COLLAPSED}px`,
          background: bgFrom,
          offset: 0,
        },
        {
          width: `${circleWidth}px`,
          padding: `${PILL_PADDING_V}px`,
          background: bgTo,
          offset: 0.3,
        },
        {
          width: `${expandedWidth}px`,
          padding: `${PILL_PADDING_V}px ${PILL_PADDING_H}px`,
          background: bgTo,
          offset: 1,
        },
      ]

      animationRef.current = pillRef.current.animate(pillKeyframes, {
        duration,
        easing,
        fill: 'forwards',
      })

      labelRef.current.animate(
        [
          { width: '0px', opacity: 0, offset: 0 },
          { width: '0px', opacity: 0, offset: 0.3 },
          { width: `${labelWidth}px`, opacity: 1, offset: 1 },
        ],
        { duration, easing, fill: 'forwards' }
      )
    } else {
      const pillKeyframes = [
        {
          width: `${expandedWidth}px`,
          padding: `${PILL_PADDING_V}px ${PILL_PADDING_H}px`,
          background: bgFrom,
          offset: 0,
        },
        {
          width: `${circleWidth}px`,
          padding: `${PILL_PADDING_V}px`,
          background: bgFrom,
          offset: 0.7,
        },
        {
          width: `${collapsedWidth}px`,
          padding: `${PILL_PADDING_COLLAPSED}px`,
          background: bgTo,
          offset: 1,
        },
      ]

      animationRef.current = pillRef.current.animate(pillKeyframes, {
        duration,
        easing,
        fill: 'forwards',
      })

      labelRef.current.animate(
        [
          { width: `${labelWidth}px`, opacity: 1, offset: 0 },
          { width: '0px', opacity: 0, offset: 0.5 },
          { width: '0px', opacity: 0, offset: 1 },
        ],
        { duration, easing, fill: 'forwards' }
      )
    }
  }, [labelWidth, collapsedWidth, expandedWidth])

  const [hovered, setHovered] = useState(false)
  const prevActiveRef = useRef(isActive)

  const handleMouseEnter = () => {
    setHovered(true)
    animate(true, false)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (!isActive) {
      animate(false, false)
    }
  }

  useEffect(() => {
    const wasActive = prevActiveRef.current
    prevActiveRef.current = isActive

    if (isActive && !wasActive) {
      if (hovered) {
        // Already expanded from hover — just swap the background color
        if (pillRef.current) {
          pillRef.current.animate(
            [
              { background: 'var(--color-bg-hover)' },
              { background: 'var(--color-bg-component)' },
            ],
            { duration: 150, easing: 'ease-out', fill: 'forwards' }
          )
        }
      } else {
        animate(true, true)
      }
    } else if (!isActive && wasActive) {
      if (hovered) {
        // Still hovered — swap back to hover color
        if (pillRef.current) {
          pillRef.current.animate(
            [
              { background: 'var(--color-bg-component)' },
              { background: 'var(--color-bg-hover)' },
            ],
            { duration: 150, easing: 'ease-out', fill: 'forwards' }
          )
        }
      } else {
        animate(false, true)
      }
    }
  }, [isActive, hovered, animate])

  return (
    <button className={styles.item} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div ref={pillRef} className={styles.pill}>
        <span className={styles.icon}>
          <Icon size={22} strokeWidth={1.5} />
        </span>
        <span ref={labelRef} className={styles.label}>
          {label}
        </span>
      </div>
      <span ref={measurerRef} className={styles.measurer}>
        {label}
      </span>
    </button>
  )
}
