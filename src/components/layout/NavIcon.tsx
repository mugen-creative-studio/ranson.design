// src/components/layout/NavIcon.tsx

import type { Section } from "@/lib/useActiveSection"

interface NavIconProps {
  section: Section
  isActive: boolean
  onClick: () => void
  showLabel?: boolean
}

const ICONS: Record<Section, { label: string }> = {
  hero: { label: "Home" },
  work: { label: "Work" },
  about: { label: "About" },
  contact: { label: "Contact" },
}

export function NavIcon({ section, isActive, onClick, showLabel = false }: NavIconProps) {
  const { label } = ICONS[section]

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isActive
          ? "bg-gray-100 text-navy font-medium"
          : "text-gray-500 hover:text-navy"
      }`}
      aria-label={`Navigate to ${label}`}
      aria-current={isActive ? "true" : undefined}
    >
      <span className="w-5 h-5 flex items-center justify-center text-sm">
        {label[0]}
      </span>
      {showLabel && <span className="text-sm">{label}</span>}
    </button>
  )
}
