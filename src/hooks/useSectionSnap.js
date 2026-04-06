import { useEffect, useRef, useCallback } from 'react'
import { SECTIONS } from './useActiveSection.js'

export default function useSectionSnap() {
  const currentIndex = useRef(0)
  const isAnimating = useRef(false)
  const cooldown = useRef(false)

  const navigateTo = useCallback((index) => {
    if (index < 0 || index >= SECTIONS.length) return
    if (isAnimating.current) return

    currentIndex.current = index
    isAnimating.current = true

    const el = document.getElementById(SECTIONS[index])
    if (!el) { isAnimating.current = false; return }

    el.scrollIntoView({ behavior: 'smooth' })

    // Wait for scroll to finish, then release lock
    const checkDone = () => {
      const rect = el.getBoundingClientRect()
      if (Math.abs(rect.top) < 2) {
        // Small cooldown to prevent immediately triggering another snap
        cooldown.current = true
        isAnimating.current = false
        setTimeout(() => { cooldown.current = false }, 300)
      } else {
        requestAnimationFrame(checkDone)
      }
    }
    requestAnimationFrame(checkDone)
  }, [])

  useEffect(() => {
    // Sync current index on mount based on scroll position
    let closestIdx = 0
    let closestDist = Infinity
    for (let i = 0; i < SECTIONS.length; i++) {
      const el = document.getElementById(SECTIONS[i])
      if (!el) continue
      const dist = Math.abs(el.getBoundingClientRect().top)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    }
    currentIndex.current = closestIdx

    function onWheel(e) {
      e.preventDefault()
      if (isAnimating.current || cooldown.current) return

      if (e.deltaY > 0) {
        navigateTo(currentIndex.current + 1)
      } else if (e.deltaY < 0) {
        navigateTo(currentIndex.current - 1)
      }
    }

    // Touch handling
    let touchStartY = 0

    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY
    }

    function onTouchMove(e) {
      e.preventDefault()
    }

    function onTouchEnd(e) {
      if (isAnimating.current || cooldown.current) return

      const touchEndY = e.changedTouches[0].clientY
      const delta = touchStartY - touchEndY

      // Require minimum 30px swipe
      if (Math.abs(delta) < 30) return

      if (delta > 0) {
        navigateTo(currentIndex.current + 1)
      } else {
        navigateTo(currentIndex.current - 1)
      }
    }

    // Keyboard handling
    function onKeyDown(e) {
      if (isAnimating.current || cooldown.current) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        navigateTo(currentIndex.current + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        navigateTo(currentIndex.current - 1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [navigateTo])

  return navigateTo
}
