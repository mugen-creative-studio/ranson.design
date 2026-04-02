import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { RightSidebar } from "@/components/layout/RightSidebar"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

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
      <body className={`${dmSans.className} bg-white text-[#2b4159] antialiased`}>
        <RightSidebar />
        {children}
      </body>
    </html>
  )
}
