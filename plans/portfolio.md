# Plan: Personal Portfolio — ranson.design

> Source PRD: https://github.com/mugen-creative-studio/ranson.design/issues/1

## Architectural decisions

Durable decisions that apply across all phases:

- **Framework**: Vite + React
- **Routing**: React Router — `/` (home, scrollable sections), `/projects/:slug` (detail pages), `/blog` and `/blog/:slug` (future)
- **Styling**: CSS Modules for component scoping, CSS custom properties for tokens, no Tailwind
- **Token system**: `tokens.css` with primitive → semantic layers, theming via `[data-theme]` attribute
- **Breakpoints**: sm (576px), md (768px), lg (1024px), xl (1280px), max-height (500px) for compact nav, container max-width 1440px
- **Typography**: DM Sans, self-hosted, weights TBD
- **Hosting**: Vercel, ranson.design domain via Namecheap DNS (A record + CNAME)
- **Figma workflow**: Figma MCP → Claude Code/Cursor for component translation, tokens maintained manually in `tokens.css`
- **Mobile nav**: Floating scrubber (collapsed single icon, expanded vertical strip with scrub gesture)
- **Desktop nav**: Fixed left column with icons and labels

---

## Phase 1: Foundation

**User stories**: 20, 25, 28

### What to build

Scaffold the Vite + React + React Router project. Create the design token system with `tokens.css` containing primitive and semantic layers. Self-host DM Sans font files. Set up CSS Modules. Deploy the empty shell to Vercel and connect the ranson.design domain via Namecheap DNS.

### Acceptance criteria

- [ ] Vite + React project initialised and running locally
- [ ] React Router installed and configured with a root route
- [ ] `tokens.css` exists with primitive and semantic custom properties for color, spacing, typography, and breakpoints
- [ ] Semantic layer structured to support future `[data-theme]` overrides
- [ ] DM Sans self-hosted and loading via `@font-face`
- [ ] CSS Modules working (one test component verifies scoped styles)
- [ ] Site deployed to Vercel and accessible at ranson.design
- [ ] SSL working on custom domain

---

## Phase 2: Layout + Navigation (Desktop)

**User stories**: 1, 3, 8, 9, 19

### What to build

Build the global layout shell with the fixed left-column nav and a scrollable main content area. Create four section placeholders (Hero, Projects, About, Contact) as scroll targets with hash anchors. The nav highlights the current section based on scroll position using IntersectionObserver. The URL hash updates as the user scrolls. Container max-width set to 1440px.

### Acceptance criteria

- [ ] Global layout renders with left nav column and main content area
- [ ] Four section placeholders visible and scrollable
- [ ] Nav displays icons and labels for each section
- [ ] Active nav item updates as user scrolls between sections
- [ ] Clicking a nav item smooth-scrolls to the corresponding section
- [ ] URL hash updates on scroll (e.g., `/#projects`)
- [ ] Direct navigation to a hash URL scrolls to the correct section
- [ ] Content area respects 1440px max-width and centres on wider screens

---

## Phase 3: Navigation (Mobile)

**User stories**: 5, 6, 7, 2

### What to build

Build the mobile nav as a floating scrubber in the bottom-right corner. In its collapsed state, it shows a single icon representing the current section, updating as the user scrolls. Tapping the icon expands the nav to show all section icons vertically. From the expanded state, the user can tap an icon to jump to that section, or use a touch-scrub gesture (slide finger up/down) to snap between sections. Tapping the nav again collapses it.

### Acceptance criteria

- [ ] Nav appears as a single floating icon on viewports below the `lg` breakpoint
- [ ] Collapsed icon reflects the current section and updates on scroll
- [ ] Tapping the icon expands to show all section icons vertically
- [ ] Tapping an icon in expanded state scrolls to that section
- [ ] Touch-scrub gesture (slide up/down) snaps to adjacent sections
- [ ] Tapping the nav again collapses it
- [ ] Nav remains usable on short viewports (max-height query)
- [ ] Desktop left-column nav hidden on mobile, floating scrubber hidden on desktop

---

## Phase 4: Hero + About + Contact Sections

**User stories**: 1, 2

### What to build

Pull designs from Figma via MCP and build the Hero, About, and Contact sections with real content. Each section is responsive across all breakpoints. The Hero section displays name, title, and summary. About and Contact sections contain appropriate content. Right sidebar cards (What I'm currently..., Writings) are excluded from V1.

### Acceptance criteria

- [ ] Hero section matches Figma design with name, role description, and summary
- [ ] About section renders with appropriate content
- [ ] Contact section renders with contact information or link
- [ ] All three sections are responsive across sm, md, lg, xl breakpoints
- [ ] Sections use design tokens for all colors, spacing, and typography
- [ ] No right sidebar cards in V1

---

## Phase 5: Project Cards + Tab Switching + Filtering

**User stories**: 10, 11, 23

### What to build

Build the Projects section with a tab switcher (Work / Personal) and a tag-based filter within each tab. Project data is stored in a simple data structure that is easy to edit (add, remove, reorder). Each project renders as a card with a preview and metadata. Cards link to `/projects/:slug` but detail pages are not built in this phase.

### Acceptance criteria

- [ ] Projects section displays Work and Personal tabs
- [ ] Switching tabs shows the correct set of project cards
- [ ] Tags are derived from project data and displayed as filter controls
- [ ] Selecting a tag filters cards within the active tab
- [ ] Project cards display preview image, title, and tags
- [ ] Cards link to `/projects/:slug`
- [ ] Project data is easy to add, remove, and reorder
- [ ] Responsive card layout across all breakpoints

---

## Phase 6: Project Detail Pages + Cycling

**User stories**: 12, 13, 14, 15, 16

### What to build

Build the `/projects/:slug` route that renders project detail pages. Work case studies have bespoke layouts tailored to each project's story. Prev/next arrows let the visitor cycle through projects scoped to the currently active filter. The visitor can change filters from within the detail view. Back navigation returns to the Projects section.

### Acceptance criteria

- [ ] `/projects/:slug` route resolves and renders the correct project
- [ ] Work case studies render with bespoke, per-project layouts
- [ ] Prev/next arrows cycle through projects matching the active filter
- [ ] If no filter is active, arrows cycle through all projects in the current tab
- [ ] Visitor can change filters from within the detail view
- [ ] Cycling updates after filter change
- [ ] Unknown slugs show a 404 or redirect to home
- [ ] Back navigation returns to the Projects section with scroll position and filter state preserved

---

## Phase 7: Playground Experiment Layout

**User stories**: 17, 18, 24

### What to build

Build the two-column layout for playground experiments within the project detail page route. The left column hosts the experiment demo, the right column contains the explanation. Experiment components are lazy-loaded to avoid compute cost on initial page load. A placeholder toggle for switching between animation preview and interactive mode is included but full implementation is deferred.

### Acceptance criteria

- [ ] Playground experiments render in a two-column layout (demo left, explanation right)
- [ ] Layout is responsive (stacks vertically on mobile)
- [ ] Experiment components are lazy-loaded (React.lazy + Suspense or equivalent)
- [ ] Placeholder toggle exists for animate/interact mode switching
- [ ] Playground experiments appear alongside other personal projects in the Personal tab
- [ ] Prev/next cycling includes playground experiments within the filtered set
