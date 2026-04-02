// src/components/layout/RightSidebar.tsx

import { ArticleLabel } from "@/components/ui/ArticleLabel"
import { getAllPosts } from "@/lib/blog"

export function RightSidebar() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <aside className="fixed right-10 top-1/2 -translate-y-1/2 w-[280px] hidden xl:block z-40">
      <div
        className="rounded-2xl p-4 flex flex-col gap-4"
        style={{
          background: "rgba(247,248,249,0.53)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: "1px solid #e5e7eb",
          boxShadow: "0px 4px 4px rgba(0,0,0,0.25), 0px 2px 2px rgba(0,0,0,0.05), 0px 4px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          className="text-[26px] leading-[48px] tracking-[-0.26px] font-normal text-[#2b4159]"
        >
          Writings
        </h3>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <ArticleLabel
              key={post.slug}
              title={post.title}
              description={post.excerpt}
              date={post.date}
              slug={post.slug}
            />
          ))}
        </div>
        <a
          href="/blog"
          className="text-[16px] font-medium leading-[24px] text-[#0066b3] hover:underline"
        >
          See More
        </a>
      </div>
    </aside>
  )
}
