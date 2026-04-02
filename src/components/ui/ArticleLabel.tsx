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
    <Link href={`/blog/${slug}`} className="block py-3 group">
      <p className="text-sm font-medium text-navy group-hover:underline">{title}</p>
      <p className="text-xs text-gray-500 truncate">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{date}</p>
    </Link>
  )
}
