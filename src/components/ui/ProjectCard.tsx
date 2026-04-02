import Link from "next/link"
import type { ProjectEntry } from "@/data/projects"

interface ProjectCardProps {
  project: ProjectEntry
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden aspect-square"
    >
      <div className="h-2/3 bg-gray-100" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-navy">{project.title}</h3>
        <p className="text-sm text-gray-500">{project.description}</p>
      </div>
    </Link>
  )
}
