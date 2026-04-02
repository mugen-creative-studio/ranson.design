// src/components/layout/BottomNav.tsx

"use client"

import { NavIcon } from "./NavIcon"
import { SECTIONS, type Section } from "@/lib/useActiveSection"

interface BottomNavProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

export function BottomNav({ activeSection, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center gap-1 py-2 bg-white/90 backdrop-blur border-t border-gray-200 lg:hidden max-[375px]:hidden z-50">
      {SECTIONS.map((section) => (
        <NavIcon
          key={section}
          section={section}
          isActive={activeSection === section}
          onClick={() => onNavigate(section)}
          showLabel
        />
      ))}
    </nav>
  )
}
