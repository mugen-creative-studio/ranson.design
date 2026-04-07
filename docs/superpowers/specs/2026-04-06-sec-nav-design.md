# Section Navigation Toggle — Design Spec

## Overview

A segmented toggle ("Professional" | "Personal") in the projects section that filters which project cards are displayed. Lives between ProjectsHeader and the project card grid.

## Components

### SecNavItem

Pure presentational pill-shaped label.

**Props:**
- `label` (string) — display text
- `selected` (boolean) — whether this item is the active selection
- `onClick` (function) — click handler

**Styles:**
- Typography: 16px/16px, weight 400, letter-spacing 0.16px (matches `--font-size-button-sm` token)
- Padding: `var(--space-8)` vertical, `var(--space-16)` horizontal
- Border-radius: `var(--radius-round)`
- Selected state: text color `var(--color-gray-50)`, no background (indicator behind handles this)
- Default state: text color `var(--color-text)`, cursor pointer
- Hover (unselected only): background `var(--color-bg-component)`

### SecNav

Owns selection state indicator, renders two SecNavItems.

**Props:**
- `selection` ("professional" | "personal") — current active category
- `onSelect` (function) — callback when selection changes

**Container:**
- Width: 232px, height: 36px
- Background: `var(--color-bg)` (white)
- Border: 1px solid `var(--color-border)`
- Border-radius: `var(--radius-round)`
- Position: relative (for indicator positioning)

**Sliding indicator:**
- Absolutely-positioned div behind the text labels
- Background: `var(--color-text)` (slate-900)
- Border-radius: `var(--radius-round)`
- Sized to match the selected item's dimensions
- Position: `left: 1px` for "Professional", `left: ~133px` for "Personal"
- Transition: `transform 300ms ease` — slides horizontally on selection change
- z-index: sits below the text labels

**Layout:**
- SecNavItems positioned via flexbox, z-indexed above the indicator

## Integration

### Home.jsx

- New `useState` for `projectCategory`, default "professional"
- SecNav rendered between ProjectsHeader and project grid
- Spacing: `var(--space-32)` gap below ProjectsHeader

### Card transition

- Project grid wrapper div handles fade transition on category change
- On change: apply `fading` class (opacity 0, slight translateY down ~4px) over ~150ms
- After fade-out: swap project data, remove `fading` class (fade back in ~150ms)
- CSS transition: `opacity 150ms ease, transform 150ms ease`

### Project data

- Both categories render placeholder ProjectCards for now (same structure, same grid)
- Wiring ready for real project data when available

## Tokens used

- `--color-text` (#2b4159) — indicator bg, default text
- `--color-gray-50` (#f7f8f9) — selected text
- `--color-bg` (#ffffff) — container bg
- `--color-bg-component` (#f7f8f9) — hover bg
- `--color-border` (#e5e7eb) — container border
- `--space-8`, `--space-16`, `--space-32` — padding and layout gaps
- `--radius-round` (9999px) — pill shapes
- `--font-size-button-sm` (16px) — label size

## Files to create/modify

- `src/components/SecNavItem.jsx` — new
- `src/components/SecNavItem.module.css` — new
- `src/components/SecNav.jsx` — new
- `src/components/SecNav.module.css` — new
- `src/pages/Home.jsx` — add state + SecNav + card transition
- `src/pages/Home.module.css` — add fade transition styles
