"use client"

import type { ProjectCategory } from "@/data/projects"

interface SecNavProps {
  active: ProjectCategory
  onChange: (category: ProjectCategory) => void
}

export function SecNav({ active, onChange }: SecNavProps) {
  return (
    <div
      className="flex items-center rounded-full"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        height: "36px",
        width: "232px",
        padding: "2px",
      }}
    >
      <button
        onClick={() => onChange("professional")}
        className="flex-1 h-full rounded-full text-[16px] font-normal leading-[32px] tracking-[0.16px] transition-colors"
        style={
          active === "professional"
            ? { background: "#2b4159", color: "#f7f8f9" }
            : { background: "transparent", color: "#2b4159" }
        }
      >
        Professional
      </button>
      <button
        onClick={() => onChange("personal")}
        className="flex-1 h-full rounded-full text-[16px] font-normal leading-[32px] tracking-[0.16px] transition-colors"
        style={
          active === "personal"
            ? { background: "#2b4159", color: "#f7f8f9" }
            : { background: "transparent", color: "#2b4159" }
        }
      >
        Personal
      </button>
    </div>
  )
}
