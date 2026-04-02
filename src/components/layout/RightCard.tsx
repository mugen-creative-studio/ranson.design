// src/components/layout/RightCard.tsx

import { getAllPosts } from "@/lib/blog"

export function RightCard() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <aside className="w-[280px] hidden lg:block xl:hidden shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold text-navy mb-2">Writings</h3>
        {posts.map((post) => (
          <div key={post.slug} className="py-2">
            <p className="text-sm font-medium text-navy">{post.title}</p>
            <p className="text-xs text-gray-500 truncate">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}
