# Portfolio Website Design Spec

## Overview
Personal portfolio for Ranson Vorpahl — full-stack designer. Primary goal: job search. Secondary: freelance/personal brand.

Figma source: `https://www.figma.com/design/QWuuTUg5lTVWlXtlknWcem/Portfolio--25`
MCP page node: `2242:8755`

## Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind 4
- Vercel (deployment)
- gray-matter + remark (blog/markdown)

## Routing
- `/` — single-page with snap-scrolling sections, hash-based URLs (`#hero`, `#work`, `#about`, `#contact`)
- `/work/[slug]` — bespoke project detail pages (one React component per project)
- `/blog/[slug]` — markdown-rendered blog posts

## Layout
Persistent shell with three nav variants and a sidebar, swapped by breakpoint:

| Token | Min-width | Nav | Sidebar |
|-------|-----------|-----|---------|
| XXL | 1440px | Left sidebar (icon + label) | Full sidebar |
| XL | 1200px | Left sidebar (icon + label) | Full sidebar |
| LG | 992px | Left sidebar (icon + label) | Condensed rightCard |
| MD | 768px | Bottom horizontal bar | Condensed rightCard |
| SM | 576px | Bottom horizontal bar | Hidden |
| XS | 375px | Floating scrubber (press-hold-slide) | Hidden |
| LS1 | 992x440 landscape | Left sidebar | Hidden |
| LS2 | 852x393 landscape | Left sidebar | Hidden |

All nav variants reflect the current section based on scroll position (active state syncs with snapped section).

### Scroll behavior
- CSS scroll-snap on the main content container
- Sections snap to center of viewport
- Hash in URL updates as user scrolls between sections
- Clicking a nav item smooth-scrolls to the target section

## Sections

### Hero (`#hero`)
- "Hi, my name is" + "Ranson Vorpahl" headline
- Bio paragraphs (designer intro + current work at Cloud Campaign)

### Work (`#work`)
- "Projects" heading + description
- SecNav toggle: Professional / Personal (pill-style)
- Project cards grid (2-col at XXL/XL, 1-col at LG and below)
- Two card variants: `projectCard` (square) and `projectLgCard` (wide, used at MD/SM/landscape)
- Cards link to `/work/[slug]`

### About (`#about`)
- "About me" heading + bio paragraph

### Contact (`#contact`)
- Generic contact form (name, email, message, submit)

## Sidebar

### "What I'm currently..." section
- 4 status labels (e.g., Learning, Reading, Targeting, Listening)
- Data stored in TypeScript file for easy updates
- Hidden/toggleable for v1

### "Writings" section
- 3 article preview cards (title, description, date + read time)
- "See More" link to blog listing
- Powered by markdown files in `content/blog/`

## Components

### Shared layout
- `Layout` — scroll-snap container, manages activeSection state
- `LeftNav` — fixed left sidebar nav (XXL/XL/LG/landscape)
- `BottomNav` — fixed bottom horizontal nav (MD/SM)
- `MobileScrubber` — floating press-hold-slide vertical nav (XS)
- `RightSidebar` — full sidebar with status + writings (XXL/XL)
- `RightCard` — condensed sidebar card (LG/MD)

### Section components
- `HeroSection`
- `WorkSection`
- `AboutSection`
- `ContactSection`

### Reusable
- `ProjectCard` / `ProjectLgCard`
- `StatusLabel`
- `ArticleLabelComp`
- `SecNav` (Professional/Personal toggle)

### Pages
- `WorkDetailPage` — bespoke per-project component at `/work/[slug]`
- `BlogPostPage` — markdown-rendered at `/blog/[slug]`

## Content Management
- **Projects:** TypeScript data file for listing metadata (title, slug, description, thumbnail, tags, category). Each project gets a bespoke page component.
- **Blog/Writings:** Markdown files in `content/blog/` with frontmatter (title, date, excerpt, tags, coverImage). Parsed with gray-matter + remark (pattern from shader-port).
- **Status labels:** TypeScript data file (designed for easy updates, hidden in v1 if desired).

## Design Tokens
Extracted from Figma variables (colors, typography, spacing) into Tailwind theme config / CSS custom properties. To be pulled via Figma MCP `get_design_context` during implementation.

## Future
- Bring in shader/3D interactions from shader-port project
- Unhide "What I'm currently..." sidebar section
