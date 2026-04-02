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
    <div className="w-full max-w-[898px] min-w-[720px] px-10">
      <div className="mb-8">
        <h2
          className="text-[#2b4159]"
          style={{ fontWeight: 300, fontSize: "42px", lineHeight: "52px", letterSpacing: "-0.63px" }}
        >
          Projects
        </h2>
        <p
          className="font-normal text-[#4b5563] mt-2"
          style={{ fontSize: "16px", lineHeight: "32px", letterSpacing: "0.16px" }}
        >
          What you see in this section is a collection of professional work and
          personal work that is inspired by interests or challenges I come across
          in life. <em className="not-italic font-medium">#ADHD*</em>
        </p>
      </div>

      <SecNav active={category} onChange={setCategory} />

      {/* Desktop: square cards in 2-col grid */}
      <div className="hidden md:flex flex-wrap gap-10 mt-8">
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
