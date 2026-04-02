"use client"

import { useState } from "react"
import { projects, type ProjectCategory } from "@/data/projects"
import { SecNav } from "@/components/ui/SecNav"
import { ProjectCard } from "@/components/ui/ProjectCard"
import { ProjectLgCard } from "@/components/ui/ProjectLgCard"

export function WorkSection() {
  const [category, setCategory] = useState<ProjectCategory>("professional")

  const filtered = projects.filter((p) => p.category === category)

  return (
    <div className="max-w-[720px] mx-auto px-4 lg:ml-[360px] xl:ml-[360px] w-full">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-navy">Projects</h2>
        <p className="text-base text-navy/70 mt-2">
          What you see in this section is a collection of professional work and
          personal work that is inspired by interests or challenges I come across
          in life. <em className="font-semibold">#ADHD*</em>
        </p>
      </div>

      <SecNav active={category} onChange={setCategory} />

      {/* Desktop: square cards in 2-col grid */}
      <div className="hidden md:grid grid-cols-2 gap-4 mt-8">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* Mobile/Tablet: wide cards stacked */}
      <div className="md:hidden flex flex-col gap-4 mt-8">
        {filtered.map((project) => (
          <ProjectLgCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
