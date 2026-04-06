# Nav Item Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable `NavItem` component with a 3-phase pill expand/collapse animation driven by the Web Animations API, replacing the current inline nav items in `LeftNav.jsx`.

**Architecture:** A new `NavItem` component encapsulates icon, label, pill, and all animation logic. It measures the label's intrinsic width on mount via a hidden ref, then uses the Web Animations API to animate the pill between collapsed (icon-only) and expanded (icon + label) states. Two timing profiles: relaxed (~450ms) for hover, snappy (~200ms) for scroll-triggered active state.

**Tech Stack:** React, Web Animations API (no dependencies), CSS Modules, existing design tokens from `tokens.css`.

---

## File Structure

| File | Responsibility |
|------|---------------|
| Create: `src/components/NavItem.jsx` | Reusable nav item with pill expand/collapse animation |
| Create: `src/components/NavItem.module.css` | Static styles for NavItem (layout, colors, typography) |
| Modify: `src/components/LeftNav.jsx` | Replace inline nav item markup with `<NavItem>` components |
| Modify: `src/components/LeftNav.module.css` | Remove item/pill/label styles (now owned by NavItem) |

---

### Task 1: Create NavItem static structure and styles

**Files:**
- Create: `src/components/NavItem.jsx`
- Create: `src/components/NavItem.module.css`

- [ ] **Step 1: Create NavItem.module.css with all static styles**

```css
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-round);
  color: var(--color-text);
  padding: 0;
}

.pill {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: 5px;
  border-radius: var(--radius-round);
  overflow: hidden;
  position: relative;
}

.icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-button);
  line-height: var(--line-height-button);
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  width: 0;
}

/* Hidden measurer — rendered offscreen to get intrinsic label width */
.measurer {
  position: absolute;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-button);
  line-height: var(--line-height-button);
}
```

- [ ] **Step 2: Create NavItem.jsx with static rendering (no animation yet)**

```jsx
import { useRef } from 'react'
import styles from './NavItem.module.css'

export default function NavItem({ icon: Icon, label, isActive, onClick }) {
  const labelRef = useRef(null)
  const measurerRef = useRef(null)

  return (
    <button className={styles.item} onClick={onClick}>
      <div className={styles.pill}>
        <span className={styles.icon}>
          <Icon size={22} strokeWidth={1.5} />
        </span>
        <span ref={labelRef} className={styles.label}>
          {label}
        </span>
      </div>
      <span ref={measurerRef} className={styles.measurer}>
        {label}
      </span>
    </button>
  )
}
```

- [ ] **Step 3: Verify it renders**

Run: `cd /Users/rans/Developer/portfolio/.worktrees/nav && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavItem.jsx src/components/NavItem.module.css
git commit -m "feat: add NavItem component with static structure"
```

---

### Task 2: Add pill expand/collapse animation with Web Animations API

**Files:**
- Modify: `src/components/NavItem.jsx`

- [ ] **Step 1: Add label measurement on mount**

Add a `labelWidth` state that measures the hidden measurer element. Place this after the existing refs in `NavItem.jsx`:

```jsx
import { useRef, useState, useEffect, useCallback } from 'react'
```

Add after the refs:

```jsx
const pillRef = useRef(null)
const animationRef = useRef(null)
const [labelWidth, setLabelWidth] = useState(0)

useEffect(() => {
  if (measurerRef.current) {
    setLabelWidth(measurerRef.current.scrollWidth)
  }
}, [label])
```

- [ ] **Step 2: Add the expand/collapse animation function**

Add this after the `useEffect` that measures the label:

```jsx
const ICON_SIZE = 22
const PILL_PADDING_COLLAPSED = 5 // px on all sides
const PILL_PADDING_V = 8 // --space-8
const PILL_PADDING_H = 16 // --space-16
const GAP = 8 // --space-8

const collapsedWidth = ICON_SIZE + PILL_PADDING_COLLAPSED * 2
const expandedWidth = PILL_PADDING_H + ICON_SIZE + GAP + labelWidth + PILL_PADDING_H

const animate = useCallback((expand, fast) => {
  if (!pillRef.current || !labelRef.current) return

  // Cancel any in-flight animation
  if (animationRef.current) {
    animationRef.current.cancel()
    animationRef.current = null
  }

  const duration = fast ? 200 : 450
  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'

  const bgColor = fast ? 'var(--color-bg-component)' : 'var(--color-bg-hover)'
  const bgFrom = expand ? 'transparent' : bgColor
  const bgTo = expand ? bgColor : 'transparent'

  // Circle diameter = icon + padding to make a square
  const circleWidth = ICON_SIZE + PILL_PADDING_V * 2

  if (expand) {
    // Phase 1: fade in bg + grow to circle
    // Phase 2: widen pill + reveal label
    const pillKeyframes = [
      {
        width: `${collapsedWidth}px`,
        padding: `${PILL_PADDING_COLLAPSED}px`,
        background: bgFrom,
        offset: 0,
      },
      {
        width: `${circleWidth}px`,
        padding: `${PILL_PADDING_V}px`,
        background: bgTo,
        offset: 0.3,
      },
      {
        width: `${expandedWidth}px`,
        padding: `${PILL_PADDING_V}px ${PILL_PADDING_H}px`,
        background: bgTo,
        offset: 1,
      },
    ]

    animationRef.current = pillRef.current.animate(pillKeyframes, {
      duration,
      easing,
      fill: 'forwards',
    })

    // Label: slide in + fade in during phase 2
    labelRef.current.animate(
      [
        { width: '0px', opacity: 0, offset: 0 },
        { width: '0px', opacity: 0, offset: 0.3 },
        { width: `${labelWidth}px`, opacity: 1, offset: 1 },
      ],
      { duration, easing, fill: 'forwards' }
    )
  } else {
    // Collapse: reverse — label out, then pill shrinks to circle, then bg fades
    const pillKeyframes = [
      {
        width: `${expandedWidth}px`,
        padding: `${PILL_PADDING_V}px ${PILL_PADDING_H}px`,
        background: bgFrom,
        offset: 0,
      },
      {
        width: `${circleWidth}px`,
        padding: `${PILL_PADDING_V}px`,
        background: bgFrom,
        offset: 0.7,
      },
      {
        width: `${collapsedWidth}px`,
        padding: `${PILL_PADDING_COLLAPSED}px`,
        background: bgTo,
        offset: 1,
      },
    ]

    animationRef.current = pillRef.current.animate(pillKeyframes, {
      duration,
      easing,
      fill: 'forwards',
    })

    labelRef.current.animate(
      [
        { width: `${labelWidth}px`, opacity: 1, offset: 0 },
        { width: '0px', opacity: 0, offset: 0.5 },
        { width: '0px', opacity: 0, offset: 1 },
      ],
      { duration, easing, fill: 'forwards' }
    )
  }
}, [labelWidth, collapsedWidth, expandedWidth])
```

- [ ] **Step 3: Wire up hover and active triggers**

Add `pillRef` to the pill div, and add hover handlers + active effect. Replace the return JSX:

```jsx
const [hovered, setHovered] = useState(false)
const prevActiveRef = useRef(isActive)

// Handle hover
const handleMouseEnter = () => {
  setHovered(true)
  animate(true, false)
}

const handleMouseLeave = () => {
  setHovered(false)
  if (!isActive) {
    animate(false, false)
  }
}

// Handle active state change (scroll-triggered)
useEffect(() => {
  const wasActive = prevActiveRef.current
  prevActiveRef.current = isActive

  if (isActive && !wasActive) {
    // Becoming active — snap expand (unless already expanded from hover)
    if (!hovered) {
      animate(true, true)
    }
  } else if (!isActive && wasActive) {
    // Losing active — collapse (unless hovered)
    if (!hovered) {
      animate(false, true)
    }
  }
}, [isActive, hovered, animate])

return (
  <button
    className={styles.item}
    onClick={onClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <div ref={pillRef} className={styles.pill}>
      <span className={styles.icon}>
        <Icon size={22} strokeWidth={1.5} />
      </span>
      <span ref={labelRef} className={styles.label}>
        {label}
      </span>
    </div>
    <span ref={measurerRef} className={styles.measurer}>
      {label}
    </span>
  </button>
)
```

- [ ] **Step 4: Verify it builds**

Run: `cd /Users/rans/Developer/portfolio/.worktrees/nav && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/NavItem.jsx
git commit -m "feat: add pill expand/collapse animation via Web Animations API"
```

---

### Task 3: Integrate NavItem into LeftNav

**Files:**
- Modify: `src/components/LeftNav.jsx`
- Modify: `src/components/LeftNav.module.css`

- [ ] **Step 1: Update LeftNav.jsx to use NavItem**

Replace the entire contents of `src/components/LeftNav.jsx` with:

```jsx
import { MonitorUp, Component, Sticker, SmartphoneNfc } from 'lucide-react'
import NavItem from './NavItem'
import styles from './LeftNav.module.css'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: MonitorUp },
  { id: 'projects', label: 'Work', icon: Component },
  { id: 'about', label: 'About', icon: Sticker },
  { id: 'contact', label: 'Contact', icon: SmartphoneNfc },
]

export default function LeftNav({ active, onNavigate }) {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ id, label, icon }) => (
        <NavItem
          key={id}
          icon={icon}
          label={label}
          isActive={active === id}
          onClick={() => onNavigate(id)}
        />
      ))}
    </nav>
  )
}

export { NAV_ITEMS }
```

- [ ] **Step 2: Remove item/pill/label styles from LeftNav.module.css**

Replace the entire contents of `src/components/LeftNav.module.css` with only the nav container and responsive styles:

```css
.nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: calc(50% + var(--content-max-width) / 2 + var(--space-40));
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-32);
}

@media (max-width: 1023px) {
  .nav {
    display: none;
  }
}
```

- [ ] **Step 3: Verify build and visual check**

Run: `cd /Users/rans/Developer/portfolio/.worktrees/nav && npm run build`
Expected: Build succeeds.

Then run: `cd /Users/rans/Developer/portfolio/.worktrees/nav && npm run dev`
Manually verify in browser:
- Nav shows 4 icon-only items in default state
- Hovering an item plays the expand animation (circle bloom → pill widens → label slides in), ~450ms
- Mouse leave collapses smoothly
- Scrolling to a section expands its nav item with snappy timing (~200ms)
- Active item stays expanded; hovering another item expands it independently
- At most 2 items expanded at once

- [ ] **Step 4: Commit**

```bash
git add src/components/LeftNav.jsx src/components/LeftNav.module.css
git commit -m "feat: integrate NavItem component into LeftNav"
```

---

### Task 4: Polish and edge cases

**Files:**
- Modify: `src/components/NavItem.jsx`

- [ ] **Step 1: Handle initial active state on page load**

If a section is already active when the page loads (e.g., URL has `#projects`), the nav item should render expanded without animation. Add this effect after the label measurement effect in `NavItem.jsx`:

```jsx
const initializedRef = useRef(false)

useEffect(() => {
  if (!initializedRef.current && isActive && pillRef.current && labelRef.current && labelWidth > 0) {
    initializedRef.current = true
    // Set expanded state immediately, no animation
    const bgColor = 'var(--color-bg-component)'
    pillRef.current.style.width = `${expandedWidth}px`
    pillRef.current.style.padding = `${PILL_PADDING_V}px ${PILL_PADDING_H}px`
    pillRef.current.style.background = bgColor
    labelRef.current.style.width = `${labelWidth}px`
    labelRef.current.style.opacity = '1'
  } else if (!initializedRef.current && labelWidth > 0) {
    initializedRef.current = true
  }
}, [isActive, labelWidth, expandedWidth])
```

- [ ] **Step 2: Clear inline styles before animating**

At the top of the `animate` function, before the cancel call, add cleanup so Web Animations API has a clean slate:

```jsx
// Clear any inline styles from initialization
if (pillRef.current) {
  pillRef.current.style.width = ''
  pillRef.current.style.padding = ''
  pillRef.current.style.background = ''
}
if (labelRef.current) {
  labelRef.current.style.width = ''
  labelRef.current.style.opacity = ''
}
```

- [ ] **Step 3: Handle hover-to-active transition**

When a user hovers a nav item and then scrolls so it becomes active, the background color should transition from hover to active. Update the active state effect:

```jsx
useEffect(() => {
  const wasActive = prevActiveRef.current
  prevActiveRef.current = isActive

  if (isActive && !wasActive) {
    if (hovered) {
      // Already expanded from hover — just swap the background color
      if (pillRef.current) {
        pillRef.current.animate(
          [
            { background: 'var(--color-bg-hover)' },
            { background: 'var(--color-bg-component)' },
          ],
          { duration: 150, easing: 'ease-out', fill: 'forwards' }
        )
      }
    } else {
      animate(true, true)
    }
  } else if (!isActive && wasActive) {
    if (hovered) {
      // Still hovered — swap back to hover color
      if (pillRef.current) {
        pillRef.current.animate(
          [
            { background: 'var(--color-bg-component)' },
            { background: 'var(--color-bg-hover)' },
          ],
          { duration: 150, easing: 'ease-out', fill: 'forwards' }
        )
      }
    } else {
      animate(false, true)
    }
  }
}, [isActive, hovered, animate])
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/rans/Developer/portfolio/.worktrees/nav && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/NavItem.jsx
git commit -m "feat: handle initial active state and hover-to-active transitions"
```
