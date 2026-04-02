// src/components/ui/ArticleLabel.tsx

import Link from "next/link"

interface ArticleLabelProps {
  title: string
  description: string
  date: string
  slug: string
}

export function ArticleLabel({ title, description, date, slug }: ArticleLabelProps) {
  return (
    <Link href={`/blog/${slug}`} className="block group flex flex-col gap-1">
      <p className="text-[16px] font-normal leading-[32px] tracking-[0.16px] text-[#2b4159] group-hover:underline">
        {title}
      </p>
      <p className="text-[14px] font-normal leading-[16px] tracking-[0.28px] text-[#4b5563] truncate">
        {description}
      </p>
      <p className="text-[10px] font-medium leading-[16px] tracking-[0.2px] uppercase text-[#4b5563]">
        {date}
      </p>
    </Link>
  )
}
