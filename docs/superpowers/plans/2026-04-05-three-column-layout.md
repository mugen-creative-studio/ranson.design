# Three-Column Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two-column flex layout with a three-column CSS Grid where the nav and future cards are fixed in the viewport, and the center content scrolls.

**Architecture:** CSS Grid with `1fr min(898px, 100%) 1fr` columns. The left and right columns are spatial zones — their content (nav, cards) uses `position: fixed` for viewport-locked placement. The center column holds all scrollable content.

**Tech Stack:** CSS Grid, CSS custom properties, vanilla CSS Modules, React JSX

**Spec:** `docs/superpowers/specs/2026-04-05-three-column-layout-design.md`

---

### File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/styles/tokens.css` | Modify | Add `--nav-gap` token, add `--content-min-width` token |
| `src/pages/Home.module.css` | Modify | Replace flex layout with CSS Grid three-column structure |
| `src/pages/Home.jsx` | Modify | Add left/right column wrapper elements to JSX |
| `src/components/LeftNav.module.css` | Modify | Add fixed positioning, vertical centering, right-alignment |

---

### Task 1: Add layout tokens

**Files:**
- Modify: `src/styles/tokens.css:14-19` (spacing section) and `:42-44` (layout section)

- [ ] **Step 1: Add tokens**

In `src/styles/tokens.css`, add to the spacing section:

```css
--space-40: 40px;
```

Already exists. Add to the layout section:

```css
--content-min-width: 343px;
```

The `--space-40` token already exists and will serve as the nav gap. Add `--content-min-width` to the layout section, after `--content-max-width`.

- [ ] **Step 2: Verify dev server**

Run: `npm run dev`

Open browser and confirm the site still renders — no regressions from adding a token.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add content-min-width layout token"
```

---

### Task 2: Convert Home layout to CSS Grid

**Files:**
- Modify: `src/pages/Home.module.css` (full rewrite of `.layout` and `.main`)

- [ ] **Step 1: Replace `.layout` styles**

Replace the entire `.layout` rule in `src/pages/Home.module.css` with:

```css
.layout {
  display: grid;
  grid-template-columns: 1fr min(var(--content-max-width), 100%) 1fr;
  min-height: 100dvh;
}
```

This creates three columns: two flexible side columns and a capped center column.

- [ ] **Step 2: Update `.main` styles**

Replace the `.main` rule with:

```css
.main {
  grid-column: 2;
  min-width: var(--content-min-width);
  padding: var(--space-80) 0;
}
```

The center column is now placed explicitly in grid column 2. The max-width is handled by the grid column definition (`min(898px, 100%)`), so `flex: 1` and `max-width` are no longer needed.

- [ ] **Step 3: Add left and right column styles**

Add new rules to `src/pages/Home.module.css`:

```css
.leftColumn {
  grid-column: 1;
  padding-right: var(--space-40);
}

.rightColumn {
  grid-column: 3;
  padding-left: var(--space-40);
}
```

- [ ] **Step 4: Update responsive breakpoint**

Replace the existing `@media (max-width: 1023px)` block with:

```css
@media (max-width: 1023px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 0 var(--space-40);
  }

  .main {
    grid-column: 1;
  }

  .leftColumn,
  .rightColumn {
    display: none;
  }
}
```

On narrow viewports, collapse to a single column. Hide the left/right columns (mobile nav handled separately).

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`

The layout will be broken at this point because `Home.jsx` hasn't been updated yet. That's expected — move to Task 3.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.module.css
git commit -m "feat: convert home layout from flex to three-column CSS Grid"
```

---

### Task 3: Update Home.jsx to use three-column structure

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Wrap nav and content in column divs**

Replace the return JSX in `src/pages/Home.jsx` with:

```jsx
return (
  <div className={styles.layout}>
    <div className={styles.leftColumn}>
      <LeftNav active={active} onNavigate={scrollTo} />
    </div>
    <main className={styles.main}>
      <HeroSection />
      <section id="projects" className={styles.placeholder}>Projects</section>
      <section id="about" className={styles.placeholder}>About</section>
      <section id="contact" className={styles.placeholder}>Contact</section>
    </main>
    <div className={styles.rightColumn} />
  </div>
)
```

The `LeftNav` moves inside a `.leftColumn` wrapper. A `.rightColumn` div is added as an empty placeholder for future cards.

- [ ] **Step 2: Verify in browser**

Run: `npm run dev`

Confirm:
- Three-column layout visible on wide viewport
- Center content is capped at 898px and centered
- Left and right columns take equal remaining space
- Content scrolls normally
- On narrow viewport (<1024px), collapses to single column

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add three-column grid wrapper to Home layout"
```

---

### Task 4: Fix nav to viewport with vertical centering

**Files:**
- Modify: `src/components/LeftNav.module.css`

- [ ] **Step 1: Update `.nav` to fixed positioning**

Replace the `.nav` rule in `src/components/LeftNav.module.css` with:

```css
.nav {
  position: fixed;
  top: 50%;
  right: calc(var(--content-max-width) / 2 + 50% - var(--content-max-width) / 2);
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-32);
  flex-shrink: 0;
}
```

Wait — the fixed positioning needs to place the nav at the right edge of the left column. Since the nav is `position: fixed`, it's positioned relative to the viewport, not its parent. We need to calculate where the center column starts.

The center column starts at `calc(50% - min(var(--content-max-width), 100%) / 2)` from the left edge of the viewport. The nav should sit to the left of that, offset by 40px.

A simpler approach: use the left column as a positioning reference. Since `position: fixed` ignores parent, we calculate from the viewport center:

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
```

This positions the nav's right edge at: viewport center + half of content width + 40px gap. That places it 40px to the left of the center column's left edge, right-aligned.

Replace the `.nav` rule with the above.

- [ ] **Step 2: Verify in browser**

Run: `npm run dev`

Confirm:
- Nav is vertically centered in the viewport
- Nav stays fixed while scrolling content
- Nav sits to the left of the center column with ~40px gap
- Nav hover and active states still work
- On resize, nav tracks the center column position

- [ ] **Step 3: Verify responsive**

Resize to below 1024px. Confirm nav is hidden (existing `@media` rule in `LeftNav.module.css` handles this).

- [ ] **Step 4: Commit**

```bash
git add src/components/LeftNav.module.css
git commit -m "feat: fix nav to viewport with vertical centering"
```

---

### Task 5: Visual polish and edge cases

**Files:**
- Modify: `src/pages/Home.module.css` (if needed)
- Modify: `src/components/LeftNav.module.css` (if needed)

- [ ] **Step 1: Test at various viewport widths**

Check these widths in browser devtools:
- 1920px (wide desktop) — nav and content should be well-separated
- 1440px (container max) — still comfortable
- 1100px (just above breakpoint) — nav should still be visible, may be tight
- 1023px (breakpoint) — should collapse to single column

- [ ] **Step 2: Check for nav overlap**

At viewport widths just above 1024px, the nav could overlap the center column if there isn't enough space. If this happens, consider adjusting the breakpoint or adding a `@media` query that hides the nav when the left column is too narrow for it.

If overlap occurs, add to `LeftNav.module.css`:

```css
@media (max-width: 1200px) {
  .nav {
    display: none;
  }
}
```

Adjust the breakpoint value based on observed overlap point. Update `Home.module.css` responsive breakpoint to match.

- [ ] **Step 3: Commit any fixes**

```bash
git add src/pages/Home.module.css src/components/LeftNav.module.css
git commit -m "fix: adjust breakpoints for nav overlap edge cases"
```

Only commit if changes were made.
