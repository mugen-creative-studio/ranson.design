---
title: Mobile nav scroll interaction
date: 2026-04-16
branch: feature/mobile-nav-scroll-interaction
supersedes: docs/superpowers/plans/mobile-nav-scroll-split.md
---

# Mobile nav scroll interaction

## Goals

1. **Scrubbing the nav feels like snapping between sections** — thumb movement on the nav drives the page, but as discrete section jumps, not a continuous sweep. No flashing through sections.
2. **Traditional page scroll stays smooth and native** — finger on main content scrolls with normal browser momentum + the existing `scroll-snap-type: y proximity` on `html`.
3. **Nav gets out of the way when the user wants to scroll the page** — first touchmove outside the nav closes it, then native scroll takes over in the same gesture.
4. **Closed trigger always reflects the current section** — as sections change during scroll, the collapsed icon updates (already wired via `useActiveSection`; do not regress).
5. **Explicit close control** — an X button gives an always-available dismiss path independent of tap-outside or scroll.

## Non-goals

- Do not change `LeftNav`, `FloorNav`, or `NavItem` — desktop behavior stays.
- Do not change `scroll-snap-type: y proximity` on `html` in `src/styles/global.css`.
- Do not change the `chromeRevealed` / `T_BAR_OPEN_MS` reveal phase (from `c80be99`).
- Do not change section-row tap behavior (`handleNavItemClick`).
- Do not change `useActiveSection` or `useSectionSnap`.

## Behavior matrix

| Gesture | Page | Nav |
|---|---|---|
| Thumb drag on nav (scrub) | Smooth scroll to the section currently under the thumb, **one `scrollIntoView` per section crossing** | Blob/sphere follow thumb (unchanged) |
| Finger drag on main content, nav open | Native smooth scroll | **Closes on first touchmove** |
| Scroll through sections, nav closed | Native scroll | Closed-trigger icon auto-updates via `useActiveSection` |
| Tap new X button | — | `closeNav()` |
| Release scrub | One final smooth scroll to the hovered section (existing `onNavigate` call on `touchend`) | Blob settles into pill |
| Tap outside nav, mouse | — | `closeNav()` (unchanged `pointerdown` path) |

## Current code anchors (branch `feature/mobile-nav-scroll-interaction` @ `267bab0`)

- `src/components/MobileNav.jsx:547-552` — scrub `touchmove` calls `window.scrollTo(0, t * maxScroll)` per event. **Root cause of jitter / flashing.**
- `src/components/MobileNav.jsx:411-433` — `isOpen` effect wires `pointerdown` + `wheel` + `touchmove` outside-nav → `closeNav()`.
- `src/components/MobileNav.jsx:641-662` — closed trigger already renders `<ActiveIcon>` from `useActiveSection`.
- `src/components/MobileNav.jsx:575-602` — `onTouchEnd` already calls `onNavigate(NAV_ITEMS[finalIdx].id)` once on release; scrub-driven section changes will reuse the same `onNavigate` path.
- `src/pages/Home.jsx:18,80` — `onNavigate={scrollTo}` where `scrollTo = useSectionSnap()` uses `scrollIntoView({ behavior: 'smooth' })`.

## Design

### 1. Scrub → section-snap mapping

Replace the linear scroll block in `onTouchMove` (lines 549–552) with a discrete section-change trigger.

- Add a ref: `lastScrubSectionRef = useRef(null)`.
- When the scrub-derived `idx` (from `idxFromY(centerY)`) differs from `lastScrubSectionRef.current`, call `onNavigate(NAV_ITEMS[idx].id)` once, then set `lastScrubSectionRef.current = idx`.
- Reset `lastScrubSectionRef.current = null` in `onTouchStart` and `onTouchEnd`.
- Keep `e.preventDefault()` on the non-passive `touchmove` so scrubbing does not scroll the document directly.
- No new rAF needed — one `scrollIntoView` per section crossing is already throttled by user motion.

Why this kills the jitter: the old code scrolled the page every touchmove (60–120/sec), sweeping through many sections per frame. The new code only triggers scroll when the thumb crosses a row boundary, yielding at most one smooth scroll per section change.

### 2. Outside touchmove → close nav

Adjust the `isOpen` effect (lines 411–433):

- Keep `pointerdown` outside-nav → `closeNav()` (mouse / stylus tap-outside).
- Keep `touchmove` on `window` → `closeNav()` when the target is outside `navRef`. This is the "first touchmove outside closes nav" behavior the user wants.
- Remove `wheel` → `closeNav()` (no scroll wheel on mobile; desktop has its own nav).

After close, `useActiveSection` drives the closed-trigger icon as the page scrolls. No extra code.

### 3. X close button

- New DOM node inside `<nav>`, outside the `.organism` grid, below the four section rows.
- Class: `.closeButton`.
- Icon: Lucide `X` (already the icon library in use).
- `type="button"`, `aria-label="Close navigation"`.
- `tabIndex={isOpen ? 0 : -1}`.
- `onClick={closeNav}` (uses the same close path as tap-outside and active-row-tap).
- Visibility: hidden until `.nav.open.revealChrome` — same gating as `.contentLayer` so it does not appear mid-reveal or steal focus when collapsed.
- Placement: visually separate from the 316×160 stack (not a 5th row). Centered below, own style. Exact size / spacing to be decided during implementation — start with a tap target ≥ 44px and adjust after seeing it.

### 4. Scroll-snap and useSectionSnap

No change. `scroll-snap-type: y proximity` on `html` already gives "scroll freely, snap when near a boundary" for native finger-drag on content. `useSectionSnap` already handles scrub-release + X-button-driven navigation via smooth `scrollIntoView`.

## Files to touch

- `src/components/MobileNav.jsx`
  - scrub `touchmove`: replace linear scroll with section-snap trigger (§1)
  - `isOpen` effect: drop `wheel`; keep `touchmove` outside-nav close (§2)
  - `touchstart` / `touchend`: reset `lastScrubSectionRef`
  - Add X close button JSX (§3)
- `src/components/MobileNav.module.css`
  - New `.closeButton` rules + visibility gating on `.nav.open.revealChrome`

No other files need to change.

## Verification

- **Scrub smooth-slow top→bottom:** page glides section-by-section; no flashing, no mid-transition cuts.
- **Scrub fast:** section changes keep up; page may skip intermediate smooth scrolls if the thumb crosses multiple boundaries before a scroll completes — acceptable.
- **Scrub back-and-forth across one boundary:** page scrolls once per crossing; no rapid re-fires within a section.
- **Nav open, finger drag on main content:** nav closes on first touchmove; page scrolls natively; closed-trigger icon updates to the active section.
- **Nav closed, finger drag:** native scroll; icon updates as sections change.
- **Tap X:** nav closes; no stray section navigation.
- **Tap X then scroll:** nothing weird — subsequent scroll is native.
- **Desktop mouse tap outside nav:** still closes (pointerdown path unchanged).
- **Regression sweep:** LeftNav, FloorNav, NavItem untouched. Tap-to-navigate on each mobile row still animates + scrolls as before. Tap active row still closes. Scrub release still calls `onNavigate` once.

## Housekeeping

- The previous plan `docs/superpowers/plans/mobile-nav-scroll-split.md` (untracked) is superseded by this spec. Remove it once the new implementation plan lands.
- `src/components/MobileNav.html` (untracked scratch file) should be deleted or gitignored before commit.
