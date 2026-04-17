import { useRef, useEffect, useLayoutEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { MonitorUp, Component, Sticker, SmartphoneNfc, X } from 'lucide-react'
import styles from './MobileNav.module.css'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: MonitorUp },
  { id: 'projects', label: 'Projects', icon: Component },
  { id: 'about', label: 'About', icon: Sticker },
  { id: 'contact', label: 'Contact', icon: SmartphoneNfc },
]

/* ── Figma geometry ─────────────────────────────────── */
const BAR_W    = 58
const BAR_H    = 401
const CP       = 4
const IH       = 50
const ITEM_Y   = [4, 89, 175, 262]
const GPAD     = 30   // extra padding inside the goo-layer so blur doesn't clip
const ORGANISM_W = 160

const BAR_LEFT   = ORGANISM_W - BAR_W + GPAD  // 132
const ACTIVE_W   = { hero: 130, projects: 162, about: 132, contact: 151 }
const ACTIVE_H   = IH + 2 * CP                // 58

const COLLAPSED_W = 76
const COLLAPSED_H = COLLAPSED_W
const GLOW_SIZE   = 100

/* ── Timing ─────────────────────────────────────────── */
const T_COLLAPSE = 200
const T_MOVE     = 300
const T_EXPAND   = 240
const EASE       = 'cubic-bezier(0.4, 0, 0.12, 1)'
/** Must match `.blobBar` transition in MobileNav.module.css (bar growing to full height). */
const T_BAR_OPEN_MS = 600

/* ── Helpers ────────────────────────────────────────── */
const pillTop        = (idx) => ITEM_Y[idx] - CP + GPAD
const pillLeft       = (aW)  => BAR_LEFT + BAR_W - aW
const pillLeftCollapsed = ()  => BAR_LEFT + (BAR_W - COLLAPSED_W) / 2

function setTrans(el, props, dur) {
  if (!el) return
  el.style.transition = props.map(p => `${p} ${dur}ms ${EASE}`).join(', ')
}

function glowCenter(idx) {
  const cx = ORGANISM_W - BAR_W / 2
  const cy = ITEM_Y[idx] + IH / 2
  return { x: cx - GLOW_SIZE / 2, y: cy - GLOW_SIZE / 2 }
}

/* ── SVG filter (rendered once via a portal-free inline SVG) ── */
function GooeyFilter() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <filter
          id="gooey-mobile"
          x="-40%" y="-10%" width="180%" height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur" mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            result="goo"
          />
        </filter>
      </defs>
    </svg>
  )
}

/* ── Component ──────────────────────────────────────── */
/* ── Scrub thresholds: item centers, used to map touch-y → item index ── */
const ITEM_CENTER_Y = ITEM_Y.map(y => y + IH / 2)           // [29, 114, 200, 287]
const SCRUB_THRESHOLDS = [
  (ITEM_CENTER_Y[0] + ITEM_CENTER_Y[1]) / 2,                 // 71.5
  (ITEM_CENTER_Y[1] + ITEM_CENTER_Y[2]) / 2,                 // 157
  (ITEM_CENTER_Y[2] + ITEM_CENTER_Y[3]) / 2,                 // 243.5
]
function idxFromY(y) {
  if (y < SCRUB_THRESHOLDS[0]) return 0
  if (y < SCRUB_THRESHOLDS[1]) return 1
  if (y < SCRUB_THRESHOLDS[2]) return 2
  return 3
}

export default function MobileNav({ active, onNavigate }) {
  const activeBlobRef = useRef(null)
  const barBlobRef    = useRef(null)
  const glowRef       = useRef(null)
  const btnRefs       = useRef([])
  const labelRefs     = useRef([])
  const organismRef   = useRef(null)

  const currentPageRef = useRef(null)
  const animatingRef   = useRef(false)
  const commandedRef   = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef(null)
  const closeTimerRef = useRef(null)
  const scrubbingRef = useRef(false)
  const scrubStartYRef = useRef(0)
  const startedClosedRef = useRef(false)
  const hoveredIdxRef = useRef(null)
  const lastScrubSectionRef = useRef(null)
  const dwellTimerRef = useRef(null)
  const blobStateRef = useRef(null)

  const CLOSE_DELAY = 2500
  const SCRUB_THRESHOLD_PX = 6

  /* Measure label widths for button sizing */
  const measurerRefs = useRef([])
  const [labelWidths, setLabelWidths] = useState({})
  /** True once the bar blob overlaps the active row — then show active pill + labels (organic grow). */
  const [chromeRevealed, setChromeRevealed] = useState(false)
  const activeChromeRef = useRef(active)
  activeChromeRef.current = active
  const wasNavOpenRef = useRef(false)

  useEffect(() => {
    const widths = {}
    NAV_ITEMS.forEach((item, i) => {
      if (measurerRefs.current[i]) {
        widths[item.id] = measurerRefs.current[i].scrollWidth
      }
    })
    setLabelWidths(widths)
  }, [])

  /* Reveal active pill + chrome when measured bar overlaps the active item row (not a fixed delay). */
  useLayoutEffect(() => {
    if (!isOpen) {
      setChromeRevealed(false)
      return
    }

    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setChromeRevealed(true)
      return
    }

    setChromeRevealed(false)

    const minOverlapPx = 10
    const t0 = performance.now()
    const maxMs = T_BAR_OPEN_MS + 100

    let raf = 0
    const tick = () => {
      const idx = NAV_ITEMS.findIndex(n => n.id === activeChromeRef.current)
      const rowTop = idx >= 0 ? ITEM_Y[idx] : 0
      const rowBottom = idx >= 0 ? rowTop + IH : 0

      const bar = barBlobRef.current
      const org = organismRef.current
      if (!bar || !org) {
        setChromeRevealed(true)
        return
      }
      const br = bar.getBoundingClientRect()
      const or = org.getBoundingClientRect()
      const barTop = br.top - or.top
      const barBottom = br.bottom - or.top

      const elapsed = performance.now() - t0
      if (idx < 0) {
        if (elapsed >= maxMs) setChromeRevealed(true)
        else raf = requestAnimationFrame(tick)
        return
      }

      const overlap = Math.min(barBottom, rowBottom) - Math.max(barTop, rowTop)

      if (overlap >= minOverlapPx || elapsed >= maxMs) {
        setChromeRevealed(true)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isOpen])

  /* Inline width/height/left/top from animateTo/setStateImmediate override CSS; on close, clear so .nav:not(.open) .blobActive { opacity:0 } wins. */
  useLayoutEffect(() => {
    if (isOpen) return
    const el = activeBlobRef.current
    if (!el) return
    el.style.transition = 'none'
    for (const p of ['opacity', 'width', 'height', 'left', 'top']) {
      el.style.removeProperty(p)
    }
  }, [isOpen])

  /* ── Position helpers ──────────────────────────── */
  const positionGlow = useCallback((idx, show) => {
    const el = glowRef.current
    if (!el) return
    const pos = glowCenter(idx)
    el.style.left   = pos.x + 'px'
    el.style.top    = pos.y + 'px'
    el.style.width  = GLOW_SIZE + 'px'
    el.style.height = GLOW_SIZE + 'px'
    if (show !== undefined) el.style.opacity = show ? '1' : '0'
  }, [])

  const positionButtons = useCallback((activeIdx, aW) => {
    const overflow = aW - BAR_W

    NAV_ITEMS.forEach((_, i) => {
      const btn   = btnRefs.current[i]
      const label = labelRefs.current[i]
      if (!btn) return

      btn.style.top        = ITEM_Y[i] + 'px'
      btn.style.transition = 'none'

      if (i === activeIdx) {
        btn.classList.add(styles.active)
        btn.style.width = (aW - 2 * CP) + 'px'
        btn.style.right = CP + 'px'
        btn.style.left  = 'auto'
        if (label) {
          label.style.opacity  = '1'
          label.style.maxWidth = '120px'
        }
      } else {
        btn.classList.remove(styles.active)
        btn.style.width = '50px'
        btn.style.right = CP + 'px'
        btn.style.left  = 'auto'
        if (label) {
          label.style.opacity  = '0'
          label.style.maxWidth = '0'
        }
      }
    })
  }, [])

  /* ── Set state immediately (no animation) ──── */
  const setStateImmediate = useCallback((pageId) => {
    currentPageRef.current = pageId
    const idx = NAV_ITEMS.findIndex(n => n.id === pageId)
    const aW  = ACTIVE_W[pageId]

    // Bar blob is now driven by CSS (.nav.open .blobBar) — no imperative positioning.

    // Active blob — geometry set inline; CSS handles opacity transition
    const blob = activeBlobRef.current
    if (blob) {
      blob.style.left   = pillLeft(aW) + 'px'
      blob.style.top    = pillTop(idx) + 'px'
      blob.style.width  = aW + 'px'
      blob.style.height = ACTIVE_H + 'px'
    }

    positionButtons(idx, aW)
  }, [positionButtons])

  /* Close path strips blob inline geometry; active sync skips setStateImmediate when active === currentPageRef — restore pill blob layout on open only. */
  useLayoutEffect(() => {
    const justOpened = !wasNavOpenRef.current && isOpen
    wasNavOpenRef.current = isOpen
    if (!isOpen || !justOpened) return
    const pageId = NAV_ITEMS.find(n => n.id === active)?.id
    if (!pageId) return
    setStateImmediate(pageId)
  }, [isOpen, active, setStateImmediate])

  /* ── Animated transition ───────────────────── */
  const animateTo = useCallback((pageId) => {
    if (pageId === currentPageRef.current || animatingRef.current || scrubbingRef.current) return
    animatingRef.current = true

    const fromId  = currentPageRef.current
    const fromIdx = NAV_ITEMS.findIndex(n => n.id === fromId)
    const toIdx   = NAV_ITEMS.findIndex(n => n.id === pageId)
    const fromW   = ACTIVE_W[fromId]
    const toW     = ACTIVE_W[pageId]

    const blob = activeBlobRef.current
    const glow = glowRef.current

    // Deactivate old button
    const oldBtn   = btnRefs.current[fromIdx]
    const oldLabel = labelRefs.current[fromIdx]
    if (oldBtn) {
      oldBtn.classList.remove(styles.active)
      oldBtn.style.transition = `width ${T_COLLAPSE}ms ${EASE}`
      oldBtn.style.width = '50px'
    }
    if (oldLabel) {
      oldLabel.style.transition = `opacity 0.1s ease, max-width ${T_COLLAPSE}ms ${EASE}`
      oldLabel.style.opacity  = '0'
      oldLabel.style.maxWidth = '0'
    }

    /* ── PHASE 1: COLLAPSE ── */
    setTrans(blob, ['width', 'height', 'left', 'top'], T_COLLAPSE)
    blob.style.width  = COLLAPSED_W + 'px'
    blob.style.height = COLLAPSED_H + 'px'
    blob.style.left   = pillLeftCollapsed() + 'px'
    blob.style.top    = (ITEM_Y[fromIdx] + IH / 2 - COLLAPSED_H / 2 + GPAD) + 'px'

    // Glow: fade in
    glow.style.transition = 'none'
    positionGlow(fromIdx, false)
    glow.offsetHeight // force reflow
    glow.style.transition = `opacity ${T_COLLAPSE}ms ${EASE}`
    glow.style.opacity = '1'

    setTimeout(() => {
      if (scrubbingRef.current) { animatingRef.current = false; return }
      /* ── PHASE 2: MOVE ── */
      setTrans(blob, ['top'], T_MOVE)
      blob.style.top = (ITEM_Y[toIdx] + IH / 2 - COLLAPSED_H / 2 + GPAD) + 'px'

      // Glow: travel
      glow.style.transition = `top ${T_MOVE}ms ${EASE}, opacity ${T_MOVE}ms ${EASE}`
      const dest = glowCenter(toIdx)
      glow.style.top = dest.y + 'px'

      setTimeout(() => {
        if (scrubbingRef.current) { animatingRef.current = false; return }
        /* ── PHASE 3: EXPAND ── */
        setTrans(blob, ['width', 'height', 'left', 'top'], T_EXPAND)
        blob.style.width  = toW + 'px'
        blob.style.height = ACTIVE_H + 'px'
        blob.style.left   = pillLeft(toW) + 'px'
        blob.style.top    = pillTop(toIdx) + 'px'

        // Glow: fade out
        glow.style.transition = `opacity ${T_EXPAND}ms ${EASE}`
        glow.style.opacity = '0'

        // Activate new button
        const newBtn   = btnRefs.current[toIdx]
        const newLabel = labelRefs.current[toIdx]
        if (newBtn) {
          newBtn.classList.add(styles.active)
          newBtn.style.transition = `width ${T_EXPAND}ms ${EASE}`
          newBtn.style.width = (toW - 2 * CP) + 'px'
        }
        if (newLabel) {
          newLabel.style.transition =
            `opacity 0.2s ease ${T_EXPAND * 0.4}ms, max-width 0.25s ${EASE} ${T_EXPAND * 0.3}ms`
          newLabel.style.opacity  = '1'
          newLabel.style.maxWidth = '120px'
        }

        setTimeout(() => {
          currentPageRef.current = pageId
          animatingRef.current = false
          if (newLabel) newLabel.style.transition = 'none'
        }, T_EXPAND + 100)

      }, T_MOVE)
    }, T_COLLAPSE)
  }, [positionGlow])

  /* ── Sync with external active prop ──────── */
  useEffect(() => {
    if (!active) return
    // During a scrub, the scrub's own state machine (expandAtIdx on dwell,
    // clearAllActive on row crossing) owns the pill state. Observer-driven
    // active updates mid-scroll would otherwise re-expand a row the user
    // has already scrubbed past.
    if (scrubbingRef.current) return
    const pageId = NAV_ITEMS.find(n => n.id === active)?.id
    if (!pageId) return

    // If we've commanded a direct jump (click), ignore observer updates
    // until the observer reports the commanded target.
    if (commandedRef.current) {
      if (pageId === commandedRef.current) commandedRef.current = null
      return
    }

    if (currentPageRef.current === null) {
      setStateImmediate(pageId)
    } else if (pageId !== currentPageRef.current) {
      animateTo(pageId)
    }
  }, [active, setStateImmediate, animateTo])

  /* ── Open/close management ─────────────────── */
  const cancelCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelCloseTimer()
    closeTimerRef.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY)
  }, [cancelCloseTimer])

  const closeNav = useCallback(() => {
    cancelCloseTimer()
    setIsOpen(false)
  }, [cancelCloseTimer])

  const openNav = useCallback(() => {
    setIsOpen(true)
    scheduleClose()
  }, [scheduleClose])

  /* Outside pointer / outside touchmove → close */
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeNav()
    }
    const onOutsideTouchMove = (e) => {
      // Touches that begin inside the nav (scrub) must not close it.
      if (navRef.current && navRef.current.contains(e.target)) return
      closeNav()
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('touchmove', onOutsideTouchMove, { passive: true })

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('touchmove', onOutsideTouchMove)
    }
  }, [isOpen, closeNav])

  /* Cleanup timer on unmount */
  useEffect(() => () => cancelCloseTimer(), [cancelCloseTimer])

  /* ── Scrub: sphere tracks finger, expands on dwell or release ── */
  useEffect(() => {
    const el = navRef.current
    if (!el) return

    const DWELL_MS = 140
    const collapsedTopFromCenter = (centerY) => centerY - COLLAPSED_H / 2 + GPAD

    const clearDwell = () => {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current)
        dwellTimerRef.current = null
      }
    }

    const clearAllActive = () => {
      btnRefs.current.forEach((btn, i) => {
        if (!btn) return
        btn.classList.remove(styles.active)
        btn.style.transition = `width 150ms ${EASE}, color 150ms ${EASE}`
        btn.style.width = '50px'
        btn.style.color = ''
        const label = labelRefs.current[i]
        if (label) {
          label.style.transition = `opacity 120ms ease, max-width 150ms ${EASE}`
          label.style.opacity = '0'
          label.style.maxWidth = '0'
        }
      })
    }

    const collapseToSphere = (centerY) => {
      const blob = activeBlobRef.current
      if (!blob) return
      setTrans(blob, ['width', 'height', 'left', 'top'], T_COLLAPSE)
      blob.style.width  = COLLAPSED_W + 'px'
      blob.style.height = COLLAPSED_H + 'px'
      blob.style.left   = pillLeftCollapsed() + 'px'
      blob.style.top    = collapsedTopFromCenter(centerY) + 'px'
      blobStateRef.current = 'sphere'
    }

    const trackSphereTo = (centerY) => {
      const blob = activeBlobRef.current
      if (!blob) return
      blob.style.transition = 'none'
      blob.style.top = collapsedTopFromCenter(centerY) + 'px'
    }

    const expandAtIdx = (idx) => {
      const id = NAV_ITEMS[idx].id
      const aW = ACTIVE_W[id]
      const blob = activeBlobRef.current
      const btn = btnRefs.current[idx]
      const label = labelRefs.current[idx]

      if (blob) {
        setTrans(blob, ['width', 'height', 'left', 'top'], T_EXPAND)
        blob.style.width  = aW + 'px'
        blob.style.height = ACTIVE_H + 'px'
        blob.style.left   = pillLeft(aW) + 'px'
        blob.style.top    = pillTop(idx) + 'px'
      }
      if (btn) {
        btn.classList.add(styles.active)
        btn.style.transition = `width ${T_EXPAND}ms ${EASE}`
        btn.style.width = (aW - 2 * CP) + 'px'
      }
      if (label) {
        label.style.transition =
          `opacity 0.2s ease ${T_EXPAND * 0.4}ms, max-width 0.25s ${EASE} ${T_EXPAND * 0.3}ms`
        label.style.opacity  = '1'
        label.style.maxWidth = '120px'
      }
      blobStateRef.current = 'pill'
      currentPageRef.current = id
      commandedRef.current = id
      animatingRef.current = false
    }

    const scheduleDwell = (idx) => {
      clearDwell()
      dwellTimerRef.current = setTimeout(() => {
        dwellTimerRef.current = null
        if (scrubbingRef.current) expandAtIdx(idx)
      }, DWELL_MS)
    }

    const onTouchStart = (e) => {
      scrubbingRef.current = false
      scrubStartYRef.current = e.touches[0].clientY
      cancelCloseTimer()
      clearDwell()
      lastScrubSectionRef.current = null
      // If this touch is the one that opens the nav, don't treat later moves
      // in the same gesture as a scrub — jitter near the closed button can
      // otherwise read as "thumb at bottom of bar → scroll to contact".
      startedClosedRef.current = !isOpen
      if (!isOpen) openNav()
    }

    const onTouchMove = (e) => {
      if (startedClosedRef.current) return
      const touch = e.touches[0]
      const delta = Math.abs(touch.clientY - scrubStartYRef.current)
      if (!scrubbingRef.current && delta < SCRUB_THRESHOLD_PX) return

      const rect = organismRef.current?.getBoundingClientRect()
      if (!rect) return

      e.preventDefault()

      const centerY = Math.max(IH / 2, Math.min(316 - IH / 2, touch.clientY - rect.top))
      const idx = idxFromY(centerY)

      // Scrub follows thumb one-to-one: INSTANT scroll bypasses
      // useSectionSnap.navigateTo's isAnimating + cooldown locks. Release
      // still uses onNavigate (onTouchEnd) for a smooth final settle.
      if (idx !== lastScrubSectionRef.current) {
        document
          .getElementById(NAV_ITEMS[idx].id)
          ?.scrollIntoView({ behavior: 'auto', block: 'start' })
        lastScrubSectionRef.current = idx
      }

      if (blobStateRef.current === 'pill' && idx === hoveredIdxRef.current) return

      if (!scrubbingRef.current) {
        scrubbingRef.current = true
        animatingRef.current = true
        clearAllActive()
        collapseToSphere(centerY)
      } else if (blobStateRef.current === 'pill') {
        clearAllActive()
        collapseToSphere(centerY)
      } else {
        trackSphereTo(centerY)
      }

      hoveredIdxRef.current = idx
      scheduleDwell(idx)
    }

    const onTouchEnd = () => {
      clearDwell()
      lastScrubSectionRef.current = null
      if (startedClosedRef.current) {
        // Keep the flag set briefly so the synthesized click that iOS fires
        // after touchend can't hit a nav item that just slid into the touch spot.
        setTimeout(() => { startedClosedRef.current = false }, 350)
        scheduleClose()
        return
      }
      if (!scrubbingRef.current) {
        scheduleClose()
        return
      }
      scrubbingRef.current = false
      justScrubbedRef.current = true

      const finalIdx = hoveredIdxRef.current
      if (finalIdx !== null) {
        if (blobStateRef.current !== 'pill' ||
            NAV_ITEMS[finalIdx].id !== currentPageRef.current) {
          expandAtIdx(finalIdx)
        }
        onNavigate(NAV_ITEMS[finalIdx].id)
      } else {
        animatingRef.current = false
      }
      scheduleClose()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      clearDwell()
    }
  }, [isOpen, openNav, onNavigate, cancelCloseTimer, scheduleClose])

  /* ── Click handlers ────────────────────────── */
  const justScrubbedRef = useRef(false)

  const handleNavItemClick = useCallback((id) => {
    if (justScrubbedRef.current) {
      justScrubbedRef.current = false
      return
    }
    // Ignore the synthesized click that iOS fires immediately after the
    // tap-to-open gesture — it can otherwise land on the nav item that
    // slid into the tap location (e.g. Contact at bottom-right).
    if (startedClosedRef.current) return
    const wasActive = id === currentPageRef.current
    if (wasActive) {
      closeNav()
      return
    }
    commandedRef.current = id
    animateTo(id)
    onNavigate(id)
    scheduleClose()
  }, [animateTo, onNavigate, closeNav, scheduleClose])

  const activeItem = NAV_ITEMS.find(n => n.id === active) || NAV_ITEMS[0]
  const ActiveIcon = activeItem.icon

  const tree = (
    <nav
      ref={navRef}
      className={`${styles.nav} ${isOpen ? styles.open : ''} ${isOpen && chromeRevealed ? styles.revealChrome : ''}`}
      style={{ '--nav-bar-open-ms': `${T_BAR_OPEN_MS}ms` }}
      aria-label="Mobile navigation"
    >
      <GooeyFilter />

      <button
        type="button"
        className={styles.closedTrigger}
        onClick={openNav}
        aria-label="Open navigation"
        aria-expanded={isOpen}
        tabIndex={isOpen ? -1 : 0}
      >
        <ActiveIcon size={26} strokeWidth={1.8} />
      </button>

      <div ref={organismRef} className={styles.organism}>
        {/* Goo layer: two blobs merged by SVG filter */}
        <div className={styles.gooLayer}>
          <div ref={barBlobRef} className={`${styles.blob} ${styles.blobBar}`} />
          <div ref={activeBlobRef} className={`${styles.blob} ${styles.blobActive}`} />
        </div>

        {/* Glow: follows the sphere during travel */}
        <div ref={glowRef} className={styles.glow} />

        {/* Nav buttons */}
        <div className={styles.contentLayer}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }, i) => (
            <button
              key={id}
              ref={el => btnRefs.current[i] = el}
              className={styles.navItem}
              onClick={() => handleNavItemClick(id)}
              tabIndex={isOpen ? 0 : -1}
            >
              <span
                ref={el => labelRefs.current[i] = el}
                className={styles.label}
              >
                {label}
              </span>
              <span className={styles.icon}>
                <Icon size={24} strokeWidth={1.8} />
              </span>
              {/* Hidden measurer for label width */}
              <span
                ref={el => measurerRefs.current[i] = el}
                className={styles.measurer}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={closeNav}
        aria-label="Close navigation"
        tabIndex={isOpen ? 0 : -1}
      >
        <X size={20} strokeWidth={1.8} />
      </button>
    </nav>
  )

  return typeof document !== 'undefined' ? createPortal(tree, document.body) : tree
}

export { NAV_ITEMS }
