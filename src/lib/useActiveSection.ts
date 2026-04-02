// src/lib/useActiveSection.ts

"use client"

import { useState, useEffect, useCallback } from "react"

export const SECTIONS = ["hero", "work", "about", "contact"] as const
export type Section = (typeof SECTIONS)[number]

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<Section>("hero")

  const handleScroll = useCallback(() => {
    const scrollContainer = document.getElementById("scroll-container")
    if (!scrollContainer) return

    const containerRect = scrollContainer.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2

    let closest: Section = "hero"
    let closestDistance = Infinity

    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const elCenter = rect.top + rect.height / 2
      const distance = Math.abs(elCenter - containerCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closest = id
      }
    }

    setActiveSection(closest)
    window.history.replaceState(null, "", `#${closest}`)
  }, [])

  useEffect(() => {
    const scrollContainer = document.getElementById("scroll-container")
    if (!scrollContainer) return

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // set initial state

    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollTo = useCallback((section: Section) => {
    const el = document.getElementById(section)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return { activeSection, scrollTo }
}
