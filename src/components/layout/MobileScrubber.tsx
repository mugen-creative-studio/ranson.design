// src/components/layout/MobileScrubber.tsx

"use client"

import { useState } from "react"
import { SECTIONS, type Section } from "@/lib/useActiveSection"

interface MobileScrubberProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

const NAV_ITEMS: Record<Section, { label: string; icon: string }> = {
  hero: { label: "Home", icon: "/icons/monitor-up.svg" },
  work: { label: "Work", icon: "/icons/component.svg" },
  about: { label: "About", icon: "/icons/sticker.svg" },
  contact: { label: "Contact", icon: "/icons/smartphone-nfc.svg" },
}

export function MobileScrubber({ activeSection, onNavigate }: MobileScrubberProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSelect = (section: Section) => {
    onNavigate(section)
    setIsOpen(false)
  }

  const activeItem = NAV_ITEMS[activeSection]

  return (
    <div className="fixed bottom-8 right-4 flex flex-col-reverse items-center gap-[36px] z-50 min-[576px]:hidden">
      {/* Closed state: single pill button */}
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="w-[58px] h-[58px] rounded-full flex items-center justify-center shrink-0 shadow-lg"
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background: "rgba(88,88,88,0.36)",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.1), 8px 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        <img src={activeItem.icon} alt={activeItem.label} width={26} height={26} />
      </button>

      {/* Open state: column of section icons above the button */}
      {isOpen && (
        <div className="flex flex-col-reverse items-center gap-[36px]">
          {SECTIONS.map((section) => {
            const item = NAV_ITEMS[section]
            const isActive = activeSection === section
            return (
              <button
                key={section}
                onClick={() => handleSelect(section)}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? "true" : undefined}
                className="w-[50px] h-[50px] rounded-full flex items-center justify-center shrink-0 relative"
                style={{
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  background: isActive
                    ? "rgba(247,248,249,0.9)"
                    : "rgba(88,88,88,0.36)",
                  boxShadow: isActive
                    ? "0 0 0 1px rgba(31,41,55,0.15), 2px 2px 6px rgba(0,0,0,0.08)"
                    : "2px 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                <img src={item.icon} alt={item.label} width={26} height={26} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
