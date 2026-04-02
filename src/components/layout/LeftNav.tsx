// src/components/layout/LeftNav.tsx

"use client"

import { NavIcon } from "./NavIcon"
import { SECTIONS, type Section } from "@/lib/useActiveSection"

interface LeftNavProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

export function LeftNav({ activeSection, onNavigate }: LeftNavProps) {
  return (
    <nav className="fixed left-10 top-1/2 -translate-y-1/2 flex-col gap-6 hidden lg:flex z-50">
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
