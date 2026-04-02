import Link from "next/link"
import type { ProjectEntry } from "@/data/projects"

interface ProjectCardProps {
  project: ProjectEntry
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="block overflow-hidden relative"
      style={{
        width: "348px",
        height: "348px",
        background: "#f7f8f9",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "4px 4px 16px rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}
    >
      {/* Card image area */}
      <div className="w-full h-full bg-[#f7f8f9]" />

      {/* White overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3"
      >
        <h3
          className="font-normal text-[#2b4159]"
          style={{ fontSize: "26px", lineHeight: "48px", letterSpacing: "-0.26px" }}
        >
          {project.title}
        </h3>
        <p
          className="font-normal text-[#4b5563]"
          style={{ fontSize: "16px", lineHeight: "32px", letterSpacing: "0.16px" }}
        >
          {project.description}
        </p>
      </div>
    </Link>
  )
}
