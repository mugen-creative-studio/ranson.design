import { notFound } from "next/navigation"
import { projects } from "@/data/projects"
import { HuMi } from "@/components/projects/HuMi"
import { Paths } from "@/components/projects/Paths"
import { Sylvie } from "@/components/projects/Sylvie"
import type { Metadata } from "next"

const PROJECT_COMPONENTS: Record<string, React.ComponentType> = {
  humi: HuMi,
  paths: Paths,
  sylvie: Sylvie,
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: "Not Found" }
  return {
    title: `${project.title} — Ranson Vorpahl`,
    description: project.description,
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params
  const Component = PROJECT_COMPONENTS[slug]
  if (!Component) notFound()

  return <Component />
}
