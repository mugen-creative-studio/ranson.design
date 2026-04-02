import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Not Found" }
  return {
    title: `${post.title} — Ranson Vorpahl`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="max-w-2xl mx-auto px-4 py-20">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-navy mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500">{post.date}</p>
        <div className="flex gap-2 mt-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div
        className="prose prose-navy max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  )
}
