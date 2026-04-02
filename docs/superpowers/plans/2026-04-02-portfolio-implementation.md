# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Ranson Vorpahl's portfolio as a snap-scrolling single-page site with project detail pages and a markdown blog.

**Architecture:** Next.js 15 App Router with a persistent layout shell (left nav / bottom nav / mobile scrubber swapped by breakpoint). Main page uses CSS scroll-snap with hash-based URLs. Project pages are bespoke components; blog posts are markdown-rendered. Design tokens extracted from Figma.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind 4, gray-matter, remark, remark-html

---

## File Structure

```
src/
  app/
    layout.tsx              # Root layout — persistent nav/sidebar shell
    page.tsx                # Single-page with snap-scroll sections
    globals.css             # Tailwind imports + CSS custom properties (design tokens)
    work/
      [slug]/
        page.tsx            # Dynamic route — maps slug to bespoke project component
    blog/
      [slug]/
        page.tsx            # Dynamic route — renders markdown post
  components/
    layout/
      LeftNav.tsx           # Fixed left sidebar nav (XXL/XL/LG/landscape)
      BottomNav.tsx         # Fixed bottom nav (MD/SM)
      MobileScrubber.tsx    # Floating press-hold-slide nav (XS)
      RightSidebar.tsx      # Full sidebar: status + writings (XXL/XL)
      RightCard.tsx         # Condensed sidebar card (LG/MD)
      NavIcon.tsx           # Shared nav icon component
    sections/
      HeroSection.tsx
      WorkSection.tsx
      AboutSection.tsx
      ContactSection.tsx
    ui/
      ProjectCard.tsx       # Square project card
      ProjectLgCard.tsx     # Wide project card
      StatusLabel.tsx       # "What I'm currently..." item
      ArticleLabel.tsx      # Writing/blog preview in sidebar
      SecNav.tsx            # Professional/Personal toggle
    projects/               # Bespoke project page components
      HuMi.tsx
      Paths.tsx
      Sylvie.tsx
  data/
    projects.ts             # Project listing metadata
    status.ts               # "What I'm currently..." data
  lib/
    blog.ts                 # Markdown blog utilities (from shader-port)
    useActiveSection.ts     # Hook: tracks which section is snapped into view
content/
  blog/
    hello-world.md          # Sample blog post
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `tailwind.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/rans/Developer/portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-turbopack
```

Select defaults when prompted. This creates the full scaffold.

- [ ] **Step 2: Verify it runs**

```bash
cd /Users/rans/Developer/portfolio
pnpm dev
```

Expected: Dev server starts at localhost:3000, default Next.js page renders.

- [ ] **Step 3: Install additional dependencies**

```bash
pnpm add gray-matter remark remark-html
```

- [ ] **Step 4: Clean up default scaffold**

Replace `src/app/page.tsx` with a minimal placeholder:

```tsx
export default function Home() {
  return <main>Portfolio</main>
}
```

Replace `src/app/globals.css` with just the Tailwind import:

```css
@import "tailwindcss";
```

Remove `src/app/favicon.ico` and any default images in `public/`.

- [ ] **Step 5: Verify clean build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Initialize git and commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 project with Tailwind 4"
```

---

## Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Extract design tokens from Figma**

Use Figma MCP `get_design_context` on the hero section (node `2242:8756`) to extract colors, typography, and spacing values. Map them to CSS custom properties.

- [ ] **Step 2: Add CSS custom properties to globals.css**

```css
@import "tailwindcss";

@theme {
  /* Colors — extracted from Figma */
  --color-navy: #1B2A4A;
  --color-navy-light: #2D3E5F;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;
  --color-gray-500: #6B7280;
  --color-white: #FFFFFF;

  /* Typography — update values after Figma extraction */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --spacing-section-x: 40px;
  --spacing-content-gap: 40px;

  /* Breakpoints */
  --breakpoint-xs: 375px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1440px;
}
```

Note: Exact color/font values will be confirmed from Figma during implementation. The above are approximations from the screenshots.

- [ ] **Step 3: Verify styles load**

```bash
pnpm dev
```

Open browser, inspect element, confirm CSS custom properties are available.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add design tokens as CSS custom properties"
```

---

## Task 3: Data Layer

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/status.ts`
- Create: `src/lib/blog.ts`
- Create: `content/blog/hello-world.md`

- [ ] **Step 1: Create project data file**

```ts
// src/data/projects.ts

export type ProjectCategory = "professional" | "personal"

export interface ProjectEntry {
  slug: string
  title: string
  description: string
  thumbnail: string       // path under /public/projects/
  category: ProjectCategory
  tags: string[]
  externalLink?: string
}

export const projects: ProjectEntry[] = [
  {
    slug: "humi",
    title: "HuMi",
    description: "Project Description",
    thumbnail: "/projects/humi.png",
    category: "personal",
    tags: [],
  },
  {
    slug: "paths",
    title: "Paths",
    description: "Project Description",
    thumbnail: "/projects/paths.png",
    category: "personal",
    tags: [],
  },
  {
    slug: "sylvie",
    title: "Sylvie",
    description: "Project Description",
    thumbnail: "/projects/sylvie.png",
    category: "personal",
    tags: [],
  },
]
```

- [ ] **Step 2: Create status data file**

```ts
// src/data/status.ts

export interface StatusEntry {
  label: string
  value: string
}

export const statusEntries: StatusEntry[] = [
  { label: "Learning", value: "Front-end Development" },
  { label: "Reading", value: "The Left Hand of Darkness by Ursul..." },
  { label: "Targeting", value: "Sub 9 hour time at Leadville 100 MT..." },
  { label: "Listening (On Vinyl)", value: "Radiohead - Hail to the Thief" },
]
```

- [ ] **Step 3: Create blog utilities**

```ts
// src/lib/blog.ts

import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content/blog")

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  coverImage?: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"))
  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8")
      const { data } = matter(raw)
      return { slug, ...data } as PostMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null
  const raw = fs.readFileSync(filepath, "utf8")
  const { data, content } = matter(raw)
  const { remark } = await import("remark")
  const remarkHtml = (await import("remark-html")).default
  const processed = await remark().use(remarkHtml).process(content)
  return { slug, ...data, contentHtml: processed.toString() } as Post
}
```

- [ ] **Step 4: Create sample blog post**

```markdown
<!-- content/blog/hello-world.md -->
---
title: "Hello World"
date: "2026-04-02"
excerpt: "A first post to verify the blog pipeline works end to end."
tags: ["meta"]
---

This is the first post. It exists to validate the Markdown-to-HTML pipeline.

## A Heading

Some **bold** and *italic* text, plus a [link](https://example.com).
```

- [ ] **Step 5: Verify build still works**

```bash
pnpm build
```

Expected: Build succeeds. Blog utilities are server-side only (fs), so they won't cause client errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/ src/lib/blog.ts content/
git commit -m "feat: add data layer — projects, status, blog utilities"
```

---

## Task 4: Active Section Hook

**Files:**
- Create: `src/lib/useActiveSection.ts`

- [ ] **Step 1: Create the hook**

```ts
// src/lib/useActiveSection.ts

"use client"

import { useState, useEffect, useCallback } from "react"

export const SECTIONS = ["hero", "work", "about", "contact"] as const
export type Section = (typeof SECTIONS)[number]

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<Section>("hero")

  const handleScroll = useCallback(() => {
    const scrollContainer = document.getElementById("scroll-container")
    if (!scrollContainer) return

    const containerRect = scrollContainer.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2

    let closest: Section = "hero"
    let closestDistance = Infinity

    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const elCenter = rect.top + rect.height / 2
      const distance = Math.abs(elCenter - containerCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closest = id
      }
    }

    setActiveSection(closest)
    window.history.replaceState(null, "", `#${closest}`)
  }, [])

  useEffect(() => {
    const scrollContainer = document.getElementById("scroll-container")
    if (!scrollContainer) return

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // set initial state

    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollTo = useCallback((section: Section) => {
    const el = document.getElementById(section)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return { activeSection, scrollTo }
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/useActiveSection.ts
git commit -m "feat: add useActiveSection hook for scroll-snap tracking"
```

---

## Task 5: Layout Shell

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/components/layout/NavIcon.tsx`
- Create: `src/components/layout/LeftNav.tsx`
- Create: `src/components/layout/BottomNav.tsx`
- Create: `src/components/layout/MobileScrubber.tsx`
- Create: `src/components/layout/RightSidebar.tsx`
- Create: `src/components/layout/RightCard.tsx`
- Create: `src/components/ui/StatusLabel.tsx`
- Create: `src/components/ui/ArticleLabel.tsx`

This is the largest task. It builds the persistent layout shell that wraps all sections.

- [ ] **Step 1: Create NavIcon component**

```tsx
// src/components/layout/NavIcon.tsx

import type { Section } from "@/lib/useActiveSection"

interface NavIconProps {
  section: Section
  isActive: boolean
  onClick: () => void
  showLabel?: boolean
}

const ICONS: Record<Section, { label: string }> = {
  hero: { label: "Home" },
  work: { label: "Work" },
  about: { label: "About" },
  contact: { label: "Contact" },
}

export function NavIcon({ section, isActive, onClick, showLabel = false }: NavIconProps) {
  const { label } = ICONS[section]

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isActive
          ? "bg-gray-100 text-navy font-medium"
          : "text-gray-500 hover:text-navy"
      }`}
      aria-label={`Navigate to ${label}`}
      aria-current={isActive ? "true" : undefined}
    >
      {/* Icon placeholder — replace with actual icons from Figma */}
      <span className="w-5 h-5 flex items-center justify-center text-sm">
        {label[0]}
      </span>
      {showLabel && <span className="text-sm">{label}</span>}
    </button>
  )
}
```

- [ ] **Step 2: Create LeftNav component**

```tsx
// src/components/layout/LeftNav.tsx

"use client"

import { NavIcon } from "./NavIcon"
import { SECTIONS, type Section } from "@/lib/useActiveSection"

interface LeftNavProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

export function LeftNav({ activeSection, onNavigate }: LeftNavProps) {
  return (
    <nav className="fixed left-10 top-1/2 -translate-y-1/2 flex-col gap-6 hidden lg:flex z-50">
      {SECTIONS.map((section) => (
        <NavIcon
          key={section}
          section={section}
          isActive={activeSection === section}
          onClick={() => onNavigate(section)}
          showLabel
        />
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Create BottomNav component**

```tsx
// src/components/layout/BottomNav.tsx

"use client"

import { NavIcon } from "./NavIcon"
import { SECTIONS, type Section } from "@/lib/useActiveSection"

interface BottomNavProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

export function BottomNav({ activeSection, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center gap-1 py-2 bg-white/90 backdrop-blur border-t border-gray-200 lg:hidden max-[375px]:hidden z-50">
      {SECTIONS.map((section) => (
        <NavIcon
          key={section}
          section={section}
          isActive={activeSection === section}
          onClick={() => onNavigate(section)}
          showLabel
        />
      ))}
    </nav>
  )
}
```

- [ ] **Step 4: Create MobileScrubber component**

```tsx
// src/components/layout/MobileScrubber.tsx

"use client"

import { useState, useCallback, useRef } from "react"
import { SECTIONS, type Section } from "@/lib/useActiveSection"

interface MobileScrubberProps {
  activeSection: Section
  onNavigate: (section: Section) => void
}

const SECTION_LABELS: Record<Section, string> = {
  hero: "Home",
  work: "Work",
  about: "About",
  contact: "Contact",
}

export function MobileScrubber({ activeSection, onNavigate }: MobileScrubberProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return
    const touch = e.touches[0]
    const rect = trackRef.current.getBoundingClientRect()
    const y = touch.clientY - rect.top
    const index = Math.floor((y / rect.height) * SECTIONS.length)
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, index))
    setHoveredIndex(clamped)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (hoveredIndex !== null) {
      onNavigate(SECTIONS[hoveredIndex])
    }
    setIsOpen(false)
    setHoveredIndex(null)
  }, [hoveredIndex, onNavigate])

  const handlePointerDown = useCallback(() => {
    setIsOpen(true)
  }, [])

  if (!isOpen) {
    return (
      <button
        onPointerDown={handlePointerDown}
        className="fixed bottom-8 right-4 w-14 h-14 rounded-full bg-gray-500/80 text-white flex items-center justify-center z-50 min-[576px]:hidden shadow-lg"
        aria-label="Open navigation"
      >
        <span className="text-xs">{SECTION_LABELS[activeSection][0]}</span>
      </button>
    )
  }

  return (
    <div
      ref={trackRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerUp={handleTouchEnd}
      className="fixed bottom-8 right-4 w-14 rounded-full bg-gray-800/90 backdrop-blur flex flex-col items-center py-4 gap-4 z-50 min-[576px]:hidden shadow-lg"
    >
      {SECTIONS.map((section, i) => (
        <div
          key={section}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            hoveredIndex === i
              ? "bg-white text-gray-800"
              : activeSection === section
                ? "bg-gray-600 text-white"
                : "text-gray-400"
          }`}
        >
          <span className="text-xs">{SECTION_LABELS[section][0]}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create StatusLabel component**

```tsx
// src/components/ui/StatusLabel.tsx

interface StatusLabelProps {
  label: string
  value: string
}

export function StatusLabel({ label, value }: StatusLabelProps) {
  return (
    <div className="py-3">
      <p className="text-sm font-medium text-navy">{label}</p>
      <p className="text-sm text-gray-500 truncate">{value}</p>
    </div>
  )
}
```

- [ ] **Step 6: Create ArticleLabel component**

```tsx
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
```

- [ ] **Step 7: Create RightSidebar component**

```tsx
// src/components/layout/RightSidebar.tsx

import { StatusLabel } from "@/components/ui/StatusLabel"
import { ArticleLabel } from "@/components/ui/ArticleLabel"
import { statusEntries } from "@/data/status"
import { getAllPosts } from "@/lib/blog"

export function RightSidebar() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <aside className="fixed right-10 top-20 w-[280px] hidden xl:block z-40">
      {/* What I'm currently... — hidden for v1 */}
      {/* <section className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-lg font-semibold text-navy mb-4">What I&apos;m currently...</h3>
        {statusEntries.map((entry) => (
          <StatusLabel key={entry.label} {...entry} />
        ))}
      </section> */}

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
```

- [ ] **Step 8: Create RightCard component (condensed sidebar)**

```tsx
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
```

- [ ] **Step 9: Update root layout**

```tsx
// src/app/layout.tsx

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
```

- [ ] **Step 10: Update home page with layout shell**

```tsx
// src/app/page.tsx

"use client"

import { LeftNav } from "@/components/layout/LeftNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { MobileScrubber } from "@/components/layout/MobileScrubber"
import { useActiveSection } from "@/lib/useActiveSection"

export default function Home() {
  const { activeSection, scrollTo } = useActiveSection()

  return (
    <>
      <LeftNav activeSection={activeSection} onNavigate={scrollTo} />
      <BottomNav activeSection={activeSection} onNavigate={scrollTo} />
      <MobileScrubber activeSection={activeSection} onNavigate={scrollTo} />

      <div
        id="scroll-container"
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        <section id="hero" className="h-screen snap-center flex items-center justify-center">
          <p>Hero</p>
        </section>
        <section id="work" className="min-h-screen snap-center flex items-center justify-center">
          <p>Work</p>
        </section>
        <section id="about" className="h-screen snap-center flex items-center justify-center">
          <p>About</p>
        </section>
        <section id="contact" className="h-screen snap-center flex items-center justify-center">
          <p>Contact</p>
        </section>
      </div>
    </>
  )
}
```

- [ ] **Step 11: Verify layout shell works**

```bash
pnpm dev
```

Expected: Page loads with placeholder sections. Scrolling snaps between sections. Left nav shows on desktop, bottom nav on tablet, scrubber on mobile. Hash updates in URL. Active state reflects current section.

- [ ] **Step 12: Commit**

```bash
git add src/components/ src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add layout shell with responsive nav variants and sidebar"
```

---

## Task 6: Section Components — Hero, About, Contact

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Create: `src/components/sections/AboutSection.tsx`
- Create: `src/components/sections/ContactSection.tsx`

- [ ] **Step 1: Pull design context from Figma for hero section**

Use Figma MCP `get_design_context` on node `2242:8756` (XXL / hero) to get exact typography, spacing, and layout values. Adapt the output to match the project's Tailwind setup.

- [ ] **Step 2: Create HeroSection**

```tsx
// src/components/sections/HeroSection.tsx

export function HeroSection() {
  return (
    <div className="max-w-[720px] mx-auto px-4 lg:ml-[360px] xl:ml-[360px]">
      <div className="mb-6">
        <p className="text-3xl text-navy/70">Hi, my name is</p>
        <h1 className="text-6xl font-bold text-navy">Ranson Vorpahl</h1>
      </div>
      <p className="text-2xl leading-relaxed text-navy mb-8">
        I am a full-stack designer with over five years of experience crafting
        desktop and mobile experiences in AI, enterprise, ed-tech, and travel.
      </p>
      <p className="text-lg leading-relaxed text-navy/80">
        Currently, I work at Cloud Campaign where I build features that help
        businesses of all sizes grow their Social Media presence, with recent
        work exploring ways AI can streamline the process.
      </p>
    </div>
  )
}
```

Note: Exact class values (font sizes, spacing, positioning) will be refined after pulling design context from Figma. The above is a structural starting point.

- [ ] **Step 3: Create AboutSection**

```tsx
// src/components/sections/AboutSection.tsx

export function AboutSection() {
  return (
    <div className="max-w-[720px] mx-auto px-4 lg:ml-[360px] xl:ml-[360px]">
      <h2 className="text-4xl font-bold text-navy mb-6">About me</h2>
      <p className="text-xl leading-relaxed text-navy/80">
        As a Designer, I deliberately immerse myself in complex problems,
        whether they affect our internal teams or end users, to uncover
        solutions that generate significant impact through focused effort.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Create ContactSection**

```tsx
// src/components/sections/ContactSection.tsx

"use client"

import { useState } from "react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire up form submission (API route or service)
    console.log("Form submitted:", formData)
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 lg:ml-[360px] xl:ml-[360px]">
      <h2 className="text-4xl font-bold text-navy mb-6">Contact</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
        <textarea
          placeholder="Message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
        />
        <button
          type="submit"
          className="bg-navy text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-navy-light transition-colors self-start"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 5: Wire sections into the home page**

Update `src/app/page.tsx` — replace placeholder `<p>` tags with actual section components:

```tsx
// src/app/page.tsx

"use client"

import { LeftNav } from "@/components/layout/LeftNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { MobileScrubber } from "@/components/layout/MobileScrubber"
import { HeroSection } from "@/components/sections/HeroSection"
import { WorkSection } from "@/components/sections/WorkSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { useActiveSection } from "@/lib/useActiveSection"

export default function Home() {
  const { activeSection, scrollTo } = useActiveSection()

  return (
    <>
      <LeftNav activeSection={activeSection} onNavigate={scrollTo} />
      <BottomNav activeSection={activeSection} onNavigate={scrollTo} />
      <MobileScrubber activeSection={activeSection} onNavigate={scrollTo} />

      <div
        id="scroll-container"
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        <section id="hero" className="h-screen snap-center flex items-center">
          <HeroSection />
        </section>
        <section id="work" className="min-h-screen snap-center flex items-center">
          {/* WorkSection added in Task 7 */}
          <p className="max-w-[720px] mx-auto px-4 lg:ml-[360px]">Work — coming next</p>
        </section>
        <section id="about" className="h-screen snap-center flex items-center">
          <AboutSection />
        </section>
        <section id="contact" className="h-screen snap-center flex items-center">
          <ContactSection />
        </section>
      </div>
    </>
  )
}
```

- [ ] **Step 6: Verify in browser**

```bash
pnpm dev
```

Expected: Hero, About, and Contact sections render with correct content and typography. Scroll snap works. Nav highlights correctly.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/ src/app/page.tsx
git commit -m "feat: add Hero, About, and Contact section components"
```

---

## Task 7: Work Section & Project Cards

**Files:**
- Create: `src/components/sections/WorkSection.tsx`
- Create: `src/components/ui/ProjectCard.tsx`
- Create: `src/components/ui/ProjectLgCard.tsx`
- Create: `src/components/ui/SecNav.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Pull design context from Figma for work section**

Use Figma MCP `get_design_context` on node `2242:8782` (XXL / work) and `2242:8795` (projectCard instance) to get card layout, spacing, and grid behavior.

- [ ] **Step 2: Create SecNav toggle**

```tsx
// src/components/ui/SecNav.tsx

"use client"

import type { ProjectCategory } from "@/data/projects"

interface SecNavProps {
  active: ProjectCategory
  onChange: (category: ProjectCategory) => void
}

export function SecNav({ active, onChange }: SecNavProps) {
  return (
    <div className="flex gap-0 bg-gray-100 rounded-full p-1 w-fit">
      <button
        onClick={() => onChange("professional")}
        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
          active === "professional"
            ? "bg-navy text-white"
            : "text-gray-500 hover:text-navy"
        }`}
      >
        Professional
      </button>
      <button
        onClick={() => onChange("personal")}
        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
          active === "personal"
            ? "bg-navy text-white"
            : "text-gray-500 hover:text-navy"
        }`}
      >
        Personal
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Create ProjectCard (square variant)**

```tsx
// src/components/ui/ProjectCard.tsx

import Link from "next/link"
import type { ProjectEntry } from "@/data/projects"

interface ProjectCardProps {
  project: ProjectEntry
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden aspect-square"
    >
      <div className="h-2/3 bg-gray-100">
        {/* Thumbnail — placeholder until images are added */}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-navy">{project.title}</h3>
        <p className="text-sm text-gray-500">{project.description}</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Create ProjectLgCard (wide variant)**

```tsx
// src/components/ui/ProjectLgCard.tsx

import Link from "next/link"
import type { ProjectEntry } from "@/data/projects"

interface ProjectLgCardProps {
  project: ProjectEntry
}

export function ProjectLgCard({ project }: ProjectLgCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="flex bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-[348px]"
    >
      <div className="w-1/2 bg-gray-100">
        {/* Thumbnail — placeholder until images are added */}
      </div>
      <div className="w-1/2 p-6 flex flex-col justify-start">
        <h3 className="text-lg font-semibold text-navy">{project.title}</h3>
        <p className="text-sm text-gray-500 mt-2">{project.description}</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 5: Create WorkSection**

```tsx
// src/components/sections/WorkSection.tsx

"use client"

import { useState } from "react"
import { projects, type ProjectCategory } from "@/data/projects"
import { SecNav } from "@/components/ui/SecNav"
import { ProjectCard } from "@/components/ui/ProjectCard"
import { ProjectLgCard } from "@/components/ui/ProjectLgCard"

export function WorkSection() {
  const [category, setCategory] = useState<ProjectCategory>("professional")

  const filtered = projects.filter((p) => p.category === category)

  return (
    <div className="max-w-[720px] mx-auto px-4 lg:ml-[360px] xl:ml-[360px] w-full">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-navy">Projects</h2>
        <p className="text-base text-navy/70 mt-2">
          What you see in this section is a collection of professional work and
          personal work that is inspired by interests or challenges I come across
          in life. <em className="font-semibold">#ADHD*</em>
        </p>
      </div>

      <SecNav active={category} onChange={setCategory} />

      {/* Desktop: square cards in 2-col grid */}
      <div className="hidden md:grid grid-cols-2 gap-4 mt-8">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* Mobile/Tablet: wide cards stacked */}
      <div className="md:hidden flex flex-col gap-4 mt-8">
        {filtered.map((project) => (
          <ProjectLgCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Wire WorkSection into home page**

Replace the work placeholder in `src/app/page.tsx`:

```tsx
<section id="work" className="min-h-screen snap-center flex items-center">
  <WorkSection />
</section>
```

Update the import at the top:

```tsx
import { WorkSection } from "@/components/sections/WorkSection"
```

Remove the old placeholder comment and `<p>` tag.

- [ ] **Step 7: Verify in browser**

```bash
pnpm dev
```

Expected: Work section shows with Professional/Personal toggle. Switching categories filters cards. 2-col grid on desktop, stacked wide cards on mobile. Cards link to `/work/[slug]` (404 for now — that's expected).

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/WorkSection.tsx src/components/ui/ src/app/page.tsx
git commit -m "feat: add Work section with project cards and category toggle"
```

---

## Task 8: Project Detail Pages

**Files:**
- Create: `src/app/work/[slug]/page.tsx`
- Create: `src/components/projects/HuMi.tsx`
- Create: `src/components/projects/Paths.tsx`
- Create: `src/components/projects/Sylvie.tsx`

- [ ] **Step 1: Create bespoke project components**

```tsx
// src/components/projects/HuMi.tsx

export function HuMi() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold text-navy mb-4">HuMi</h1>
      <p className="text-lg text-navy/70 mb-8">Project Description</p>
      {/* Bespoke layout — flesh out per project */}
    </article>
  )
}
```

```tsx
// src/components/projects/Paths.tsx

export function Paths() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold text-navy mb-4">Paths</h1>
      <p className="text-lg text-navy/70 mb-8">Project Description</p>
    </article>
  )
}
```

```tsx
// src/components/projects/Sylvie.tsx

export function Sylvie() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold text-navy mb-4">Sylvie</h1>
      <p className="text-lg text-navy/70 mb-8">Project Description</p>
    </article>
  )
}
```

- [ ] **Step 2: Create dynamic route page**

```tsx
// src/app/work/[slug]/page.tsx

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
```

- [ ] **Step 3: Verify in browser**

```bash
pnpm dev
```

Navigate to `/work/humi`, `/work/paths`, `/work/sylvie`. Expected: Each renders its bespoke component. Unknown slugs show 404.

- [ ] **Step 4: Commit**

```bash
git add src/app/work/ src/components/projects/
git commit -m "feat: add project detail pages with bespoke components"
```

---

## Task 9: Blog Pages

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create blog post page**

```tsx
// src/app/blog/[slug]/page.tsx

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
```

- [ ] **Step 2: Verify in browser**

```bash
pnpm dev
```

Navigate to `/blog/hello-world`. Expected: Blog post renders with title, date, tags, and HTML content.

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds. Static params generate pages for all blog posts.

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/ content/blog/
git commit -m "feat: add blog post pages with markdown rendering"
```

---

## Task 10: Figma Design Polish

**Files:**
- Modify: All component files as needed

This task is interactive — pull `get_design_context` from Figma for each section/breakpoint and refine components to match the design precisely.

- [ ] **Step 1: Pull design context for each XXL section**

Use Figma MCP `get_design_context` on:
- `2242:8756` (XXL / hero)
- `2242:8782` (XXL / work)
- `2242:8812` (XXL / about)

Update typography, spacing, colors, and layout in each component to match Figma exactly.

- [ ] **Step 2: Pull design context for responsive breakpoints**

Use `get_design_context` on key responsive frames:
- `2242:8861` (LG / hero)
- `2242:8934` (MD / hero)
- `2242:8948` (SM / hero)
- `2242:8960` (XS / 375)

Verify responsive behavior matches Figma at each breakpoint. Adjust Tailwind classes as needed.

- [ ] **Step 3: Pull nav component designs**

Use `get_design_context` on nav instances to get exact icons, active states, and styling:
- `2242:8758` (navTop-Left)
- `2242:8944` (navTop-Bottom)
- `2242:8968` (mobile scrubber)

Replace placeholder icons and refine styling.

- [ ] **Step 4: Verify all breakpoints in browser**

Resize browser through all breakpoints: 1440, 1200, 992, 768, 576, 375. Confirm layout matches Figma at each.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: polish components to match Figma design tokens and layouts"
```

---

## Task 11: Final Verification & Deploy

**Files:**
- No new files

- [ ] **Step 1: Full build check**

```bash
pnpm build
```

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Test all routes**

Manually verify:
- `/` — all sections render, snap-scroll works, hash updates
- `/work/humi`, `/work/paths`, `/work/sylvie` — project pages render
- `/blog/hello-world` — blog post renders
- Nav active state syncs across all breakpoints
- Responsive layout matches Figma at 1440, 1200, 992, 768, 576, 375

- [ ] **Step 3: Deploy to Vercel**

```bash
pnpm dlx vercel
```

Follow prompts to link the project and deploy.

- [ ] **Step 4: Commit deploy config**

```bash
git add .
git commit -m "chore: add Vercel configuration"
```
