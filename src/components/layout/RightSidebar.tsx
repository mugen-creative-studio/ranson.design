// src/components/layout/RightSidebar.tsx

import { ArticleLabel } from "@/components/ui/ArticleLabel"
import { getAllPosts } from "@/lib/blog"

export function RightSidebar() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <aside className="fixed right-10 top-20 w-[280px] hidden xl:block z-40">
      {/* What I'm currently... — hidden for v1 */}

      <section className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-navy mb-2">Writings</h3>
        {posts.map((post) => (
          <ArticleLabel
            key={post.slug}
            title={post.title}
            description={post.excerpt}
            date={post.date}
            slug={post.slug}
          />
        ))}
        <a href="/blog" className="text-sm text-navy hover:underline mt-2 inline-block">
          See More
        </a>
      </section>
    </aside>
  )
}
