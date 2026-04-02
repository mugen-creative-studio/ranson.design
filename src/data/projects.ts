export type ProjectCategory = "professional" | "personal"

export interface ProjectEntry {
  slug: string
  title: string
  description: string
  thumbnail: string       // path under /public/projects/
  category: ProjectCategory
  tags: string[]
  externalLink?: string
}

export const projects: ProjectEntry[] = [
  {
    slug: "humi",
    title: "HuMi",
    description: "Project Description",
    thumbnail: "/projects/humi.png",
    category: "personal",
    tags: [],
  },
  {
    slug: "paths",
    title: "Paths",
    description: "Project Description",
    thumbnail: "/projects/paths.png",
    category: "personal",
    tags: [],
  },
  {
    slug: "sylvie",
    title: "Sylvie",
    description: "Project Description",
    thumbnail: "/projects/sylvie.png",
    category: "personal",
    tags: [],
  },
]
