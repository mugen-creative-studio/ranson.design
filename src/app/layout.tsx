import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ranson Vorpahl — Full-Stack Designer",
  description:
    "Full-stack designer with over five years of experience crafting desktop and mobile experiences in AI, enterprise, ed-tech, and travel.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-navy antialiased">{children}</body>
    </html>
  )
}
