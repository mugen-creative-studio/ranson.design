"use client"

import type { ProjectCategory } from "@/data/projects"

interface SecNavProps {
  active: ProjectCategory
  onChange: (category: ProjectCategory) => void
}

export function SecNav({ active, onChange }: SecNavProps) {
  return (
    <div className="flex gap-0 bg-gray-100 rounded-full p-1 w-fit">
      <button
        onClick={() => onChange("professional")}
        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
          active === "professional"
            ? "bg-navy text-white"
            : "text-gray-500 hover:text-navy"
        }`}
      >
        Professional
      </button>
      <button
        onClick={() => onChange("personal")}
        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
          active === "personal"
            ? "bg-navy text-white"
            : "text-gray-500 hover:text-navy"
        }`}
      >
        Personal
      </button>
    </div>
  )
}
