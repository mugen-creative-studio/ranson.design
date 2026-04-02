// src/components/layout/NavIcon.tsx

"use client"

import type { Section } from "@/lib/useActiveSection"

interface NavIconProps {
  section: Section
  isActive: boolean
  onClick: () => void
}

const NAV_ITEMS: Record<Section, { label: string; icon: string }> = {
  hero: { label: "Home", icon: "/icons/monitor-up.svg" },
  work: { label: "Work", icon: "/icons/component.svg" },
  about: { label: "About", icon: "/icons/sticker.svg" },
  contact: { label: "Contact", icon: "/icons/smartphone-nfc.svg" },
}

export function NavIcon({ section, isActive, onClick }: NavIconProps) {
  const { label, icon } = NAV_ITEMS[section]

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 transition-all ${
        isActive
          ? "bg-[#f7f8f9] rounded-full px-4 py-2"
          : "px-2 py-2"
      }`}
      aria-label={`Navigate to ${label}`}
      aria-current={isActive ? "true" : undefined}
    >
      <img src={icon} alt={label} width={22} height={22} className="shrink-0" />
      {isActive && (
        <span
          className="text-[20px] font-medium leading-[24px] text-[#2b4159] whitespace-nowrap"
        >
          {label}
        </span>
      )}
    </button>
  )
}
