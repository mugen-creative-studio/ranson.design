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
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-between gap-1 p-1 rounded-full z-50 hidden max-[575px]:hidden md:flex lg:hidden"
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        background: "rgba(199,199,199,0.36)",
        border: "1px solid #f7f8f9",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.05), 8px 8px 16px rgba(0,0,0,0.05)",
      }}
    >
      {SECTIONS.map((section) => (
        <NavIcon
          key={section}
          section={section}
          isActive={activeSection === section}
          onClick={() => onNavigate(section)}
        />
      ))}
    </nav>
  )
}
