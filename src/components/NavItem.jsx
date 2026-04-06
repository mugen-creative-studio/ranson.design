import { useRef, useState, useEffect, useCallback } from 'react'
import styles from './NavItem.module.css'

export default function NavItem({ icon: Icon, label, isActive, clickTargetRef, sectionId, onClick }) {
  const labelRef = useRef(null)
  const measurerRef = useRef(null)
  const pillRef = useRef(null)
  const animationRef = useRef(null)
  const labelAnimRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => {
    if (measurerRef.current) {
      setLabelWidth(measurerRef.current.scrollWidth)
    }
  }, [label])

  const initializedRef = useRef(false)

  const ICON_CONTAINER = 24
  const PADDING_H = 16
  const GAP = 8
  const BORDER = 1

  // Default: border + padding-left + icon + padding-right + border (label hidden)
  const collapsedWidth = BORDER + PADDING_H + ICON_CONTAINER + PADDING_H + BORDER
  // Expanded: border + padding-left + icon + gap + label + padding-right + border
  const expandedWidth = BORDER + PADDING_H + ICON_CONTAINER + GAP + labelWidth + PADDING_H + BORDER

  // Figma states
  const HOVER_STYLES = {
    background: 'var(--color-bg-hover)',
    borderColor: 'var(--color-bdr-bound)',
    boxShadow: 'var(--shadow-xs)',
    color: 'var(--color-fg-secondary)',
  }
  const ACTIVE_STYLES = {
    background: 'var(--color-bg-component)',
    borderColor: 'transparent',
    boxShadow: 'var(--shadow-xs)',
    color: 'var(--color-text)',
  }
  const DEFAULT_STYLES = {
    background: 'transparent',
    borderColor: 'transparent',
    boxShadow: 'none',
    color: 'var(--color-text)',
  }

  useEffect(() => {
    if (!initializedRef.current && isActive && pillRef.current && labelRef.current && labelWidth > 0) {
      initializedRef.current = true
      pillRef.current.style.width = `${expandedWidth}px`
      pillRef.current.style.background = ACTIVE_STYLES.background
      pillRef.current.style.boxShadow = ACTIVE_STYLES.boxShadow
      pillRef.current.style.color = ACTIVE_STYLES.color
      labelRef.current.style.width = `${labelWidth}px`
      labelRef.current.style.opacity = '1'
    } else if (!initializedRef.current && labelWidth > 0) {
      initializedRef.current = true
    }
  }, [isActive, labelWidth, expandedWidth])

  const clearInlineStyles = useCallback(() => {
    if (pillRef.current) {
      pillRef.current.style.width = ''
      pillRef.current.style.background = ''
      pillRef.current.style.borderColor = ''
      pillRef.current.style.boxShadow = ''
      pillRef.current.style.color = ''
    }
    if (labelRef.current) {
      labelRef.current.style.width = ''
      labelRef.current.style.opacity = ''
    }
  }, [])

  const animate = useCallback((expand, fast) => {
    if (!pillRef.current || !labelRef.current) return

    clearInlineStyles()

    if (animationRef.current) {
      animationRef.current.cancel()
      animationRef.current = null
    }
    if (labelAnimRef.current) {
      labelAnimRef.current.cancel()
      labelAnimRef.current = null
    }

    const duration = fast ? 200 : 450
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'

    const targetStyles = fast ? ACTIVE_STYLES : HOVER_STYLES

    if (expand) {
      const circleWidth = PADDING_H + ICON_CONTAINER + PADDING_H

      const pillKeyframes = [
        {
          width: `${collapsedWidth}px`,
          ...DEFAULT_STYLES,
          offset: 0,
        },
        {
          width: `${circleWidth}px`,
          ...targetStyles,
          offset: 0.3,
        },
        {
          width: `${expandedWidth}px`,
          ...targetStyles,
          offset: 1,
        },
      ]

      animationRef.current = pillRef.current.animate(pillKeyframes, {
        duration,
        easing,
        fill: 'forwards',
      })

      labelAnimRef.current = labelRef.current.animate(
        [
          { width: '0px', opacity: 0, offset: 0 },
          { width: '0px', opacity: 0, offset: 0.3 },
          { width: `${labelWidth}px`, opacity: 1, offset: 1 },
        ],
        { duration, easing, fill: 'forwards' }
      )
    } else {
      const circleWidth = PADDING_H + ICON_CONTAINER + PADDING_H

      const pillKeyframes = [
        {
          width: `${expandedWidth}px`,
          ...targetStyles,
          offset: 0,
        },
        {
          width: `${circleWidth}px`,
          ...targetStyles,
          offset: 0.7,
        },
        {
          width: `${collapsedWidth}px`,
          ...DEFAULT_STYLES,
          offset: 1,
        },
      ]

      animationRef.current = pillRef.current.animate(pillKeyframes, {
        duration,
        easing,
        fill: 'forwards',
      })

      labelAnimRef.current = labelRef.current.animate(
        [
          { width: `${labelWidth}px`, opacity: 1, offset: 0 },
          { width: '0px', opacity: 0, offset: 0.5 },
          { width: '0px', opacity: 0, offset: 1 },
        ],
        { duration, easing, fill: 'forwards' }
      )
    }
  }, [labelWidth, collapsedWidth, expandedWidth, clearInlineStyles])

  const [hovered, setHovered] = useState(false)
  const prevActiveRef = useRef(isActive)

  const handleMouseEnter = () => {
    // Don't trigger hover on the active item or during click navigation
    if (isActive || clickTargetRef?.current !== null) return
    setHovered(true)
    animate(true, false)
  }

  const handleMouseLeave = () => {
    if (!hovered) return
    setHovered(false)
    if (!isActive && clickTargetRef?.current !== sectionId) {
      animate(false, false)
    }
  }

  useEffect(() => {
    const wasActive = prevActiveRef.current
    const clickTarget = clickTargetRef?.current
    const isClickNav = clickTarget !== null
    const isThisTheTarget = clickTarget === sectionId

    // During a click navigation, ignore intermediate sections
    // Allow: the target (expanding) and the source (collapsing)
    const isLeavingActive = !isActive && wasActive
    if (isClickNav && !isThisTheTarget && !isLeavingActive) {
      // Don't update prevActiveRef — pretend we never saw this change
      return
    }

    prevActiveRef.current = isActive

    if (isActive && !wasActive) {
      if (hovered || (isClickNav && isThisTheTarget)) {
        // Already expanded (from hover or click) — just swap to active colors
        if (pillRef.current) {
          pillRef.current.animate(
            [
              { ...HOVER_STYLES },
              { ...ACTIVE_STYLES },
            ],
            { duration: 150, easing: 'ease-out', fill: 'forwards' }
          )
        }
      } else {
        animate(true, !isClickNav)
      }
    } else if (!isActive && wasActive) {
      if (hovered) {
        if (pillRef.current) {
          pillRef.current.animate(
            [
              { ...ACTIVE_STYLES },
              { ...HOVER_STYLES },
            ],
            { duration: 150, easing: 'ease-out', fill: 'forwards' }
          )
        }
      } else {
        animate(false, !isClickNav)
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
