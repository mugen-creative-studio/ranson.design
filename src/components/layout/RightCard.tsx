// src/components/layout/RightCard.tsx

import { getAllPosts } from "@/lib/blog"

export function RightCard() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <aside className="w-[280px] hidden lg:block xl:hidden shrink-0">
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
            <div key={post.slug}>
              <p className="text-[16px] leading-[32px] tracking-[0.16px] font-normal text-[#2b4159]">{post.title}</p>
              <p className="text-[14px] leading-[16px] tracking-[0.28px] font-normal text-[#4b5563] truncate">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
