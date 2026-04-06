# Nav Item Interaction Design

## Overview

A reusable `NavItem` component with a 3-phase pill expand/collapse animation. Each nav item shows an icon, a text label, and a pill-shaped background. The pill animates to reveal the label on hover and on scroll-triggered active state.

## Component API

```jsx
<NavItem
  icon={MonitorUp}
  label="Home"
  isActive={activeSection === 'hero'}
  onClick={() => scrollTo('hero')}
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `icon` | Lucide icon component | The icon to display |
| `label` | string | Text label (e.g., "Home", "Projects") |
| `isActive` | boolean | Whether this item's section is currently in view |
| `onClick` | function | Click handler for navigation |

The component manages hover state internally.

## States

1. **Default** — Icon only, no background, label hidden
2. **Hover** — Pill expanded, label visible, hover background color
3. **Active** — Pill expanded, label visible, active background color (persists while section is in view)

At most two nav items can be expanded at once: the active item + one hovered item.

## Animation Sequence

### Expand (3 phases)

1. **Circle bloom** — Pill background fades in and padding grows to form a circle around the icon
2. **Pill widens** — Pill width animates to measured label width, label slides in from right
3. **Label reveal** — Label opacity fades to full as it slides into position

### Collapse (reverse)

Label fades and slides out, pill shrinks to circle, circle fades away.

### Timing

| Trigger | Total duration | Feel |
|---------|---------------|------|
| Hover | ~400-500ms | Relaxed, fluid ease-out |
| Scroll-triggered active | ~200-250ms | Snappy ease-out |

## Technical Approach

**JS-driven animation using Web Animations API:**

- Label is always in the DOM but visually hidden (opacity 0, no width contribution)
- On expand trigger, measure the label's intrinsic width using a ref
- Animate the pill width to exactly that measured value (pixel-perfect, hugs content)
- Use Web Animations API for performant, cancelable animations
- No external dependencies

**Measurement strategy:**
- Use a hidden ref to measure label width on mount / when label changes
- Cache the measurement to avoid layout thrashing during animation

## Styling

Uses existing design tokens (vanilla CSS custom properties, no Tailwind):

- `--color-bg-hover` for hover state background
- `--color-bg-component` for active state background
- `--radius-round` (9999px) for pill shape
- `--font-size-button` / `--font-weight-button` for label text
- `--space-8` for icon-label gap

Component styles in CSS Module (`NavItem.module.css`).

## Integration

Replaces inline nav item markup in `LeftNav.jsx`. Each nav item becomes:

```jsx
<NavItem icon={MonitorUp} label="Home" isActive={active === 'hero'} onClick={...} />
<NavItem icon={Component} label="Projects" isActive={active === 'projects'} onClick={...} />
<NavItem icon={Sticker} label="About" isActive={active === 'about'} onClick={...} />
<NavItem icon={SmartphoneNfc} label="Contact" isActive={active === 'contact'} onClick={...} />
```

## Out of Scope

- Mobile nav (hidden below 1024px, unchanged)
- Scroll snap behavior (handled by existing `useSectionSnap` hook)
- Active section detection (handled by existing `useActiveSection` hook)
