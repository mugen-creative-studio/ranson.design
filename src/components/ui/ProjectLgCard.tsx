import Link from "next/link"
import type { ProjectEntry } from "@/data/projects"

interface ProjectLgCardProps {
  project: ProjectEntry
}

export function ProjectLgCard({ project }: ProjectLgCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="flex bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-[348px]"
    >
      <div className="w-1/2 bg-gray-100" />
      <div className="w-1/2 p-6 flex flex-col justify-start">
        <h3 className="text-lg font-semibold text-navy">{project.title}</h3>
        <p className="text-sm text-gray-500 mt-2">{project.description}</p>
      </div>
    </Link>
  )
}
