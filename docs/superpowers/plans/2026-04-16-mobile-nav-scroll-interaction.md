# Mobile Nav Scroll Interaction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace MobileNav's linear scrub-to-scroll with discrete section-snap navigation, add an X close button, and make first outside-touchmove close the nav.

**Architecture:** Surgical edits to `MobileNav.jsx` + `MobileNav.module.css`. Scrub `touchmove` becomes a section-change detector that calls the existing `onNavigate(id)` path (which resolves to `useSectionSnap`'s smooth `scrollIntoView`). Outside `touchmove` still closes the nav; the obsolete `wheel` listener is dropped. A new DOM button rendered inside `<nav>` (outside `.organism`) provides an explicit close affordance, gated by the same `.nav.open.revealChrome` visibility class used for the other chrome.

**Tech Stack:** React 19, CSS Modules, Vite. Lucide `X` icon (already in `lucide-react`). No new dependencies.

**Branch:** `feature/mobile-nav-scroll-interaction` (already checked out). No new worktree.

**Spec:** `docs/superpowers/specs/2026-04-16-mobile-nav-scroll-design.md`.

**Invariants (do not touch):**
- `LeftNav`, `FloorNav`, `NavItem`
- `useActiveSection`, `useSectionSnap`
- `scroll-snap-type: y proximity` on `html` in `src/styles/global.css`
- `chromeRevealed` / `T_BAR_OPEN_MS` reveal phase (`MobileNav.jsx:135-191`)
- `handleNavItemClick` tap-to-navigate path (`MobileNav.jsx:621-639`)

**Testing approach:** No component-level test runner exists in this repo (no Jest/Vitest). Playwright is installed but no suite exists. Given the interaction is touch-gesture-driven and visual, verification is manual on a mobile viewport (or an iOS device on LAN via `npm run dev`). Each task ends with a `grep` sanity check on the code change plus a manual-verification checklist from the spec. We do not introduce a test framework for this change (YAGNI).

---

## File Map

- **Modify:** `src/components/MobileNav.jsx`
  - Import `X` from `lucide-react`
  - Add `lastScrubSectionRef`
  - `onTouchStart`: reset `lastScrubSectionRef.current = null`
  - `onTouchMove`: remove linear `window.scrollTo`; add discrete section-snap trigger via `onNavigate`
  - `onTouchEnd`: reset `lastScrubSectionRef.current = null`
  - `isOpen` effect: drop `wheel` listener; keep `pointerdown` + `touchmove`
  - JSX: append `<button className={styles.closeButton}>` inside `<nav>`, after `.organism`
- **Modify:** `src/components/MobileNav.module.css`
  - Add `.closeButton` rules + `.nav.open.revealChrome .closeButton` reveal
- **Delete:** `docs/superpowers/plans/mobile-nav-scroll-split.md` (untracked, superseded)
- **Delete:** `src/components/MobileNav.html` (untracked scratch file)

---

## Prerequisites (run once before Task 1)

- [ ] **Step 0.1: Start the dev server in a second terminal**

Run: `npm run dev`
Expected: Vite prints a local URL and a LAN URL. Keep this running for manual verification across tasks.

- [ ] **Step 0.2: Confirm starting git state**

Run: `git status --short`
Expected output contains:
```
?? docs/superpowers/plans/mobile-nav-scroll-split.md
?? docs/superpowers/specs/2026-04-16-mobile-nav-scroll-design.md
?? docs/superpowers/plans/2026-04-16-mobile-nav-scroll-interaction.md
?? src/components/MobileNav.html
```
Expected: working tree otherwise clean.

- [ ] **Step 0.3: Confirm branch**

Run: `git rev-parse --abbrev-ref HEAD`
Expected: `feature/mobile-nav-scroll-interaction`

---

## Task 1: Scrub → discrete section-snap trigger

**Files:**
- Modify: `src/components/MobileNav.jsx:106-114` (add new ref among scrub refs)
- Modify: `src/components/MobileNav.jsx:526-536` (onTouchStart — reset ref)
- Modify: `src/components/MobileNav.jsx:538-573` (onTouchMove — replace linear scroll)
- Modify: `src/components/MobileNav.jsx:575-602` (onTouchEnd — reset ref)

**Why:** The existing `onTouchMove` calls `window.scrollTo(0, t * maxScroll)` per touchmove event (60–120 Hz), which sweeps the page through many sections per frame and produces the "flashing" jitter. Replacing it with one `onNavigate(NAV_ITEMS[idx].id)` per section crossing reuses the existing smooth-scroll path (`useSectionSnap` via `Home.jsx:80`) and bounds the scroll rate to one animation per row boundary the thumb crosses.

- [ ] **Step 1.1: Add `lastScrubSectionRef` next to the other scrub refs**

In `src/components/MobileNav.jsx`, locate the block beginning at line 106:

```jsx
  const scrubbingRef = useRef(false)
  const scrubStartYRef = useRef(0)
  const startedClosedRef = useRef(false)
  const hoveredIdxRef = useRef(null)
  const dwellTimerRef = useRef(null)
  const blobStateRef = useRef(null)
```

Insert a new ref immediately after `hoveredIdxRef`:

```jsx
  const scrubbingRef = useRef(false)
  const scrubStartYRef = useRef(0)
  const startedClosedRef = useRef(false)
  const hoveredIdxRef = useRef(null)
  const lastScrubSectionRef = useRef(null)
  const dwellTimerRef = useRef(null)
  const blobStateRef = useRef(null)
```

- [ ] **Step 1.2: Reset `lastScrubSectionRef` at the start of a touch**

Find `onTouchStart` (around line 526). It currently reads:

```jsx
    const onTouchStart = (e) => {
      scrubbingRef.current = false
      scrubStartYRef.current = e.touches[0].clientY
      cancelCloseTimer()
      clearDwell()
      // If this touch is the one that opens the nav, don't treat later moves
      // in the same gesture as a scrub — jitter near the closed button can
      // otherwise read as "thumb at bottom of bar → scroll to contact".
      startedClosedRef.current = !isOpen
      if (!isOpen) openNav()
    }
```

Add the reset after `clearDwell()`:

```jsx
    const onTouchStart = (e) => {
      scrubbingRef.current = false
      scrubStartYRef.current = e.touches[0].clientY
      cancelCloseTimer()
      clearDwell()
      lastScrubSectionRef.current = null
      // If this touch is the one that opens the nav, don't treat later moves
      // in the same gesture as a scrub — jitter near the closed button can
      // otherwise read as "thumb at bottom of bar → scroll to contact".
      startedClosedRef.current = !isOpen
      if (!isOpen) openNav()
    }
```

- [ ] **Step 1.3: Replace the linear scroll block in `onTouchMove` with a discrete section-snap trigger**

Find `onTouchMove` (around line 538). The relevant section is lines 547–556:

```jsx
      e.preventDefault()

      // Thumb Y on nav → linear scroll of whole page.
      const t = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height))
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo(0, t * maxScroll)

      const centerY = Math.max(IH / 2, Math.min(316 - IH / 2, touch.clientY - rect.top))
      const idx = idxFromY(centerY)
```

Replace that block with the section-snap trigger (preserving `e.preventDefault()`, `centerY`, and `idx`):

```jsx
      e.preventDefault()

      const centerY = Math.max(IH / 2, Math.min(316 - IH / 2, touch.clientY - rect.top))
      const idx = idxFromY(centerY)

      // Scrub → discrete section change: fire one onNavigate per row crossing.
      // useSectionSnap's scrollIntoView smooth-scrolls; the next crossing can
      // interrupt mid-animation — acceptable per spec (fast scrubs may skip).
      if (idx !== lastScrubSectionRef.current) {
        onNavigate(NAV_ITEMS[idx].id)
        lastScrubSectionRef.current = idx
      }
```

(Leave everything below `const idx = idxFromY(centerY)` — the blob visual logic and `hoveredIdxRef`/`scheduleDwell` calls — unchanged.)

- [ ] **Step 1.4: Reset `lastScrubSectionRef` at the end of a touch**

Find `onTouchEnd` (around line 575). It currently starts:

```jsx
    const onTouchEnd = () => {
      clearDwell()
      if (startedClosedRef.current) {
```

Add the reset immediately after `clearDwell()`:

```jsx
    const onTouchEnd = () => {
      clearDwell()
      lastScrubSectionRef.current = null
      if (startedClosedRef.current) {
```

- [ ] **Step 1.5: Verify the code change with grep**

Run: `grep -n "lastScrubSectionRef\|window.scrollTo" src/components/MobileNav.jsx`

Expected output (line numbers approximate, but `window.scrollTo` must be gone and `lastScrubSectionRef` must appear in four places: declaration, touchStart reset, touchMove trigger + assignment, touchEnd reset):
```
111:  const lastScrubSectionRef = useRef(null)
...
  (touchStart) lastScrubSectionRef.current = null
...
  (touchMove)  if (idx !== lastScrubSectionRef.current) {
  (touchMove)    lastScrubSectionRef.current = idx
...
  (touchEnd)   lastScrubSectionRef.current = null
```

No `window.scrollTo(` lines should remain.

- [ ] **Step 1.6: Lint**

Run: `npm run lint`
Expected: exit 0, no new errors related to `MobileNav.jsx`.

- [ ] **Step 1.7: Manual verification on mobile viewport**

In the browser attached to `npm run dev`, open Chrome DevTools → Device Toolbar → iPhone 14 Pro (or any viewport ≤ 575px wide). Reload.

Verify:
- Tap the closed nav pill → nav opens, chrome reveals, no scroll jumps.
- Slow drag from top of stack down to bottom: page scrolls section-by-section (Home → Projects → About → Contact), one smooth scroll per boundary crossed. **No flashing through intermediate sections.**
- Drag back up across one boundary: one smooth scroll back.
- Drag back and forth across a single boundary: observe that re-entering the same section does **not** re-trigger a scroll. Crossing into the adjacent section does trigger once.
- Release: existing behavior — one final `onNavigate` call on `touchend` with the hovered section (spec §1 end); blob settles into pill.
- Closed-trigger icon still updates to current section via `useActiveSection`.

- [ ] **Step 1.8: Commit**

```bash
git add src/components/MobileNav.jsx
git commit -m "refactor(mobile-nav): scrub triggers section-snap, not linear scroll"
```

---

## Task 2: Drop `wheel` listener; keep `touchmove` outside-nav close

**Files:**
- Modify: `src/components/MobileNav.jsx:411-433` (`isOpen` effect)

**Why:** Per spec §2, the `wheel` listener serves no mobile user (desktop uses `LeftNav`/`FloorNav`). The `touchmove` listener on `window` already delivers "first outside touchmove closes nav"; keep it. The `pointerdown` path is also preserved for mouse/stylus tap-outside.

- [ ] **Step 2.1: Remove the `wheel` registration and cleanup**

In `src/components/MobileNav.jsx`, the current effect body (lines 411–433) reads:

```jsx
  /* Outside click + user scroll → close */
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeNav()
    }
    const onUserScroll = (e) => {
      // Ignore scroll/touch events inside the nav (finger jitter on tap)
      if (navRef.current && navRef.current.contains(e.target)) return
      closeNav()
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('wheel', onUserScroll, { passive: true })
    window.addEventListener('touchmove', onUserScroll, { passive: true })

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('wheel', onUserScroll)
      window.removeEventListener('touchmove', onUserScroll)
    }
  }, [isOpen, closeNav])
```

Rewrite to drop the `wheel` lines and rename the handler for clarity:

```jsx
  /* Outside pointer / outside touchmove → close */
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeNav()
    }
    const onOutsideTouchMove = (e) => {
      // Touches that begin inside the nav (scrub) must not close it.
      if (navRef.current && navRef.current.contains(e.target)) return
      closeNav()
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('touchmove', onOutsideTouchMove, { passive: true })

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('touchmove', onOutsideTouchMove)
    }
  }, [isOpen, closeNav])
```

- [ ] **Step 2.2: Verify the change**

Run: `grep -nE "wheel|touchmove" src/components/MobileNav.jsx`

Expected: `touchmove` still appears (outside-close listener + the scrub `el.addEventListener('touchmove', ...)` inside the scrub effect). **No `wheel` references should remain.**

- [ ] **Step 2.3: Lint**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 2.4: Manual verification**

On the mobile viewport:
- Open nav → drag finger on the main page content (outside the nav bounding box) → nav closes immediately on the first `touchmove`, and the page scrolls natively in the same gesture.
- Open nav → scrub inside the nav → nav stays open (scrub works).
- Desktop mouse test (resize to > 575px, or set viewport to iPad): `LeftNav` is used instead; confirm no regression (the mobile nav is `display: none`). Switch back to mobile viewport after.
- Desktop mouse tap outside nav on mobile viewport (using mouse pointer in DevTools): still closes via `pointerdown`.

- [ ] **Step 2.5: Commit**

```bash
git add src/components/MobileNav.jsx
git commit -m "refactor(mobile-nav): drop wheel close; touchmove outside still closes"
```

---

## Task 3: Add X close button (JSX + icon import)

**Files:**
- Modify: `src/components/MobileNav.jsx:3` (import `X`)
- Modify: `src/components/MobileNav.jsx:644-705` (JSX tree, inside `<nav>`)

**Why:** Spec §3 — explicit close affordance independent of tap-outside and scrub. Same close path (`closeNav`) as tap-outside / active-row-tap, so no new state machine. Gated by `.nav.open.revealChrome` so it appears in sync with the rest of the chrome.

- [ ] **Step 3.1: Import `X` from lucide-react**

At `src/components/MobileNav.jsx:3`, the current import reads:

```jsx
import { MonitorUp, Component, Sticker, SmartphoneNfc } from 'lucide-react'
```

Add `X`:

```jsx
import { MonitorUp, Component, Sticker, SmartphoneNfc, X } from 'lucide-react'
```

- [ ] **Step 3.2: Add the button JSX inside `<nav>`, after `</div>` of `.organism`**

The current JSX (around lines 644–705) ends with:

```jsx
        </div>
      </div>
    </nav>
  )
```

The outer `</div>` closes `.organism`. Insert the close button between the organism's closing `</div>` and the `</nav>`:

```jsx
        </div>
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={closeNav}
        aria-label="Close navigation"
        tabIndex={isOpen ? 0 : -1}
      >
        <X size={20} strokeWidth={1.8} />
      </button>
    </nav>
  )
```

- [ ] **Step 3.3: Verify the JSX change**

Run: `grep -n "closeButton\|aria-label=\"Close navigation\"" src/components/MobileNav.jsx`

Expected:
```
<line>:        className={styles.closeButton}
<line>:        aria-label="Close navigation"
```

- [ ] **Step 3.4: Lint**

Run: `npm run lint`
Expected: exit 0. (The button will be unstyled at this point — that is handled in Task 4.)

- [ ] **Step 3.5: Commit**

```bash
git add src/components/MobileNav.jsx
git commit -m "feat(mobile-nav): add X close button (unstyled, wired to closeNav)"
```

---

## Task 4: Style the X close button

**Files:**
- Modify: `src/components/MobileNav.module.css` (append new rules at end)

**Why:** Spec §3 — visually separate from the 316×160 stack, ≥44px tap target, same reveal gating as `.contentLayer`. Exact size/spacing is explicitly left to implementation (spec line 78). Initial placement sits the button above the organism stack (negative `top`), since the open bar blob fully occupies the organism's bottom — the only free space inside the nav's 316×160 box is above row 1. Step 4.4 is a dedicated visual-tune pass where we can move it if the user wants a different placement.

- [ ] **Step 4.1: Append `.closeButton` rules to `MobileNav.module.css`**

Open `src/components/MobileNav.module.css` and append (at the end of the file, after the `.measurer` block):

```css
/* ── X close button (outside the organism stack) ── */
.closeButton {
  position: absolute;
  left: 50%;
  top: -56px;
  transform: translateX(-50%);
  width: 44px;
  height: 44px;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  border-radius: var(--radius-round);
  background: rgba(74, 73, 73, 0.50);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  color: var(--color-gray-50);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.12, 1);
  -webkit-tap-highlight-color: transparent;
  z-index: 4;
}

.nav.open.revealChrome .closeButton {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 260ms cubic-bezier(0.33, 1, 0.68, 1);
}
```

- [ ] **Step 4.2: Verify the CSS change**

Run: `grep -n "closeButton" src/components/MobileNav.module.css`

Expected:
```
<line>:.closeButton {
<line>:.nav.open.revealChrome .closeButton {
```

- [ ] **Step 4.3: Lint**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 4.4: Manual visual tune**

On the mobile viewport, reload the page. Verify:
- Nav closed: no X button visible.
- Nav opening: X button fades in **together with** the labels and active pill (same reveal moment, driven by `.nav.open.revealChrome`).
- Tap X: nav closes; `closedTrigger` icon returns; no stray section navigation; the next finger-drag on the main content scrolls natively.
- Tap X then scroll: nothing weird — page scrolls smoothly.
- Keyboard: Tab focus reaches the X button only when nav is open (`tabIndex={isOpen ? 0 : -1}`).
- Tap target ≥ 44×44.

**Placement review:** The initial CSS puts the button above the organism (via negative `top`). If the user feels it should sit differently (e.g., higher above, or below the stack with a raised nav), adjust only the positioning lines in `.closeButton` (`top`, `left`, `transform`). Do not change the visibility gating or the animation timing. Commit any tweak as a separate fixup commit.

- [ ] **Step 4.5: Commit**

```bash
git add src/components/MobileNav.module.css
git commit -m "feat(mobile-nav): style X close button with chrome-reveal gating"
```

---

## Task 5: Full regression sweep (spec Verification section)

**Files:** none (verification only).

Run through every bullet from the spec `## Verification` section on a mobile viewport. Treat this as a merge gate — failures here mean returning to the relevant task, not papering over.

- [ ] **Step 5.1: Scrub smooth-slow top → bottom**

Slow drag thumb from top row to bottom row. Page must glide section-by-section with no flashing, no mid-transition cuts.

- [ ] **Step 5.2: Scrub fast**

Flick finger quickly top → bottom. Page may skip intermediate smooth scrolls (a faster thumb can cross 2+ boundaries before one scroll finishes). This is **acceptable per spec**; the verification is that the final section lands correctly and nothing flashes.

- [ ] **Step 5.3: Scrub back-and-forth across one boundary**

Hover near the Projects ↔ About boundary, jiggle across it. Each crossing triggers one scroll; staying within a section does not re-fire.

- [ ] **Step 5.4: Nav open, finger drag on main content**

Open nav. Drag a finger on the page content (outside the nav). Nav closes on the first `touchmove`, page scrolls natively in the same gesture, closed-trigger icon updates to the section you land on.

- [ ] **Step 5.5: Nav closed, finger drag**

Scroll the page with the nav closed. Native scroll feels normal; existing `scroll-snap-type: y proximity` behavior unchanged; closed-trigger icon updates as the active section changes.

- [ ] **Step 5.6: Tap X**

Tap the X. Nav closes. No section navigation fires. Subsequent scroll is native.

- [ ] **Step 5.7: Desktop mouse tap outside nav**

Switch DevTools to desktop viewport or use a desktop device. Confirm `LeftNav` is the one shown (`MobileNav` is `display: none` above 575px). Switch back to mobile viewport and use a mouse pointer to tap outside the nav — closes via `pointerdown` path.

- [ ] **Step 5.8: Tap-to-navigate on each mobile row**

With nav open, tap each row (Home, Projects, About, Contact). Existing animation (collapse → move → expand) runs for each, page scrolls to the section. Tapping the already-active row closes the nav.

- [ ] **Step 5.9: Scrub release still calls `onNavigate` once**

Scrub, hover on a row, release. Blob settles into pill. Page scrolls to that row (may be a no-op if scrub already landed there during the drag — that's fine). Nav then closes via `scheduleClose`.

- [ ] **Step 5.10: Desktop `LeftNav` / `FloorNav` / `NavItem` regression**

Resize to desktop width. Verify `LeftNav` and `FloorNav` still render and navigate. They must not have changed (`git diff main -- src/components/LeftNav.jsx src/components/FloorNav.jsx src/components/NavItem.jsx` should be empty).

- [ ] **Step 5.11: Confirm no forbidden files touched**

Run: `git diff --name-only main..HEAD`

Expected output: only
```
src/components/MobileNav.jsx
src/components/MobileNav.module.css
```
plus newly added spec/plan docs and deletions in Task 6. **No changes to** `LeftNav.*`, `FloorNav.*`, `NavItem.*`, `useActiveSection.js`, `useSectionSnap.js`, or `src/styles/global.css`.

---

## Task 6: Housekeeping — delete superseded scratch files

**Files:**
- Delete: `docs/superpowers/plans/mobile-nav-scroll-split.md`
- Delete: `src/components/MobileNav.html`

Both are untracked (confirmed in Step 0.2). They must not leak into the commit history.

- [ ] **Step 6.1: Delete the superseded plan**

Run: `rm docs/superpowers/plans/mobile-nav-scroll-split.md`

- [ ] **Step 6.2: Delete the scratch HTML file**

Run: `rm src/components/MobileNav.html`

- [ ] **Step 6.3: Verify neither file reappears via git**

Run: `git status --short`

Expected: `mobile-nav-scroll-split.md` and `MobileNav.html` no longer appear. The new spec and this plan remain as untracked or already-staged.

- [ ] **Step 6.4: Stage and commit the new spec + plan together**

```bash
git add docs/superpowers/specs/2026-04-16-mobile-nav-scroll-design.md docs/superpowers/plans/2026-04-16-mobile-nav-scroll-interaction.md
git commit -m "docs(mobile-nav): add scroll-interaction spec + plan"
```

---

## Final check

- [ ] **Step F.1: Inspect the whole branch diff**

Run: `git diff main..HEAD --stat`

Expected files:
- `docs/superpowers/specs/2026-04-16-mobile-nav-scroll-design.md` (added)
- `docs/superpowers/plans/2026-04-16-mobile-nav-scroll-interaction.md` (added)
- `src/components/MobileNav.jsx` (modified)
- `src/components/MobileNav.module.css` (modified)

Plus any commits already on the branch prior to this plan (`267bab0`, `c80be99`, etc.).

- [ ] **Step F.2: Build check**

Run: `npm run build`
Expected: exit 0. Production bundle compiles.

- [ ] **Step F.3: Final manual pass**

One last run through Task 5 verification bullets on the built preview: `npm run preview`, open the LAN URL on a real mobile device if available. Focus on the three behaviors the user called out explicitly:

1. Scrub = discrete section-snap, not linear scroll, no flashing.
2. First outside touchmove while open = close nav then native scroll.
3. X close button appears with chrome reveal, tap closes nav cleanly.

If all three pass, the branch is ready for PR.
