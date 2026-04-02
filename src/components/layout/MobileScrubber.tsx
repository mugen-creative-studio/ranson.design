// src/components/layout/MobileScrubber.tsx

"use client"

import { useState, useCallback, useRef } from "react"
import { SECTIONS, type Section } from "@/lib/useActiveSection"

interface MobileScrubberProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

const SECTION_LABELS: Record<Section, string> = {
  hero: "Home",
  work: "Work",
  about: "About",
  contact: "Contact",
}

export function MobileScrubber({ activeSection, onNavigate }: MobileScrubberProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return
    const touch = e.touches[0]
    const rect = trackRef.current.getBoundingClientRect()
    const y = touch.clientY - rect.top
    const index = Math.floor((y / rect.height) * SECTIONS.length)
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, index))
    setHoveredIndex(clamped)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (hoveredIndex !== null) {
      onNavigate(SECTIONS[hoveredIndex])
    }
    setIsOpen(false)
    setHoveredIndex(null)
  }, [hoveredIndex, onNavigate])

  const handlePointerDown = useCallback(() => {
    setIsOpen(true)
  }, [])

  if (!isOpen) {
    return (
      <button
        onPointerDown={handlePointerDown}
        className="fixed bottom-8 right-4 w-14 h-14 rounded-full bg-gray-500/80 text-white flex items-center justify-center z-50 min-[576px]:hidden shadow-lg"
        aria-label="Open navigation"
      >
        <span className="text-xs">{SECTION_LABELS[activeSection][0]}</span>
      </button>
    )
  }

  return (
    <div
      ref={trackRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerUp={handleTouchEnd}
      className="fixed bottom-8 right-4 w-14 rounded-full bg-gray-800/90 backdrop-blur flex flex-col items-center py-4 gap-4 z-50 min-[576px]:hidden shadow-lg"
    >
      {SECTIONS.map((section, i) => (
        <div
          key={section}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            hoveredIndex === i
              ? "bg-white text-gray-800"
              : activeSection === section
                ? "bg-gray-600 text-white"
                : "text-gray-400"
          }`}
        >
          <span className="text-xs">{SECTION_LABELS[section][0]}</span>
        </div>
      ))}
    </div>
  )
}
