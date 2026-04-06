# Three-Column Home Page Layout

## Problem

The current layout uses a two-column flex approach where the nav and content sit side by side, centered on the page. This doesn't account for a right column (future cards) and doesn't give the nav proper fixed positioning within its own spatial zone.

## Design

### Grid Structure

CSS Grid with three columns:

```
grid-template-columns: 1fr min(898px, 100%) 1fr
```

| Column | Width | Content | Behavior |
|--------|-------|---------|----------|
| Left | `1fr` (no max) | Nav | Fixed in viewport, vertically centered, right-aligned within column |
| Center | `max-width: 898px`, `min-width: 343px` | Hero, projects, about, contact | Scrollable, compresses responsively |
| Right | `1fr` (no max) | Cards (empty for now) | Fixed in viewport, vertically centered, left-aligned within column |

### Fixed Element Positioning

Both the nav (left) and future cards (right) use:

- `position: fixed`
- `top: 50%; transform: translateY(-50%)` for vertical centering
- Nav: pinned to the right edge of the left column
- Cards: pinned to the left edge of the right column

### Spacing

- Left column: `padding-right: 40px` (gap between nav and center column)
- Right column: `padding-left: 40px` (gap between cards and center column)

### Responsive Behavior

- **Desktop (wide viewport)**: Full three-column grid. Nav and cards visible, fixed in viewport.
- **Tablet / narrow (below 1024px)**: Left and right columns collapse to zero. Nav hidden (existing mobile nav takes over). Content fills available width, compressing down to 343px minimum.

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Home.module.css` | Replace flex layout with CSS Grid (`grid-template-columns: 1fr min(898px, 100%) 1fr`) |
| `src/pages/Home.jsx` | Wrap content in three-column grid structure, add right column placeholder |
| `src/components/LeftNav.module.css` | Update to `position: fixed`, vertical centering, right-alignment |
| `src/styles/tokens.css` | Add `--nav-gap: 40px` token if needed |

## Files Unchanged

- `src/components/LeftNav.jsx` — markup and interaction logic stay the same
- `src/components/HeroSection.jsx` and `HeroSection.module.css` — no changes
- `src/hooks/useActiveSection.js` — no changes
- Mobile breakpoint behavior — nav hidden, single column, unchanged

## Constraints

- No Tailwind. Vanilla CSS with custom properties for tokens.
- Nav must remain accessible and keyboard-navigable in its fixed position.
- Right column is structurally present but visually empty until cards are implemented.
