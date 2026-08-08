# Theme switching

## The state model: two visible states, three stored ones

The button is binary — light or dark — but `localStorage.theme` has a third
value: **absent**, meaning "follow the OS". Absent is the default.

- An explicit choice is written **only while it disagrees with the OS.** The
  moment a click lands back on the system's own theme the key is *removed*,
  so a second click is a real reset rather than a second override.
- The OS `change` listener applies a new system theme only when nothing is
  stored. A stored value outranks the OS and pins both theme and icon.
- Any stored value that is not exactly `"light"` or `"dark"` counts as
  absent, so a stale or hand-edited key cannot strand the site on a theme.
- Every `localStorage` access is wrapped: it throws in some private modes,
  and a persistence failure must not stop the flip itself.

Because the key clears itself, "is the user overridden?" is answerable from
storage alone — no fourth `"system"` sentinel to keep in sync.

## The icon is switched by CSS, never by JS

The button shows the **current** appearance (sun in light, moon in dark), not
the action it performs. Both SVGs ship in the markup and `.theme-toggle__*`
rules in `global.css` show one based on the same `.dark` class the pre-paint
script sets — so the right icon is in the first painted frame. Swapping icons
from JS would paint whichever one the HTML shipped with and correct it a
frame later: the same flash of wrong state the pre-paint script exists to
prevent. The accessible name carries the action instead, and is set in the
same function as the class so the two cannot disagree.

## Gotcha: a View Transition defers the DOM change by a frame

`document.startViewTransition(cb)` does not run `cb` synchronously — it
captures the old snapshot first. Reading `documentElement.classList`
immediately after a click therefore returns the **previous** theme, and
back-to-back clicks overlap the ~250ms animation. Under
`prefers-reduced-motion` the same flip is synchronous. Any test must wait for
the expected state rather than a fixed delay; a fixed 150ms wait passed in
isolation and failed under load, which reads exactly like a product bug.

## Gotcha: animating the theme flip with CSS transitions causes flicker

A global "crossfade" rule (`html.x, html.x * { transition: ... !important }`)
toggled around the `dark` class flip looks right but flickers: elements that
carry their own `transition-colors` (card titles, nav links) inherit the
body's *animating* color and keep re-triggering chase transitions against a
moving target. They visibly double-fade — snapping backwards around the
moment any parent transition completes — even while the override rule is
still applied. Timer- or `transitionend`-based cleanup cannot fix this; the
conflict is intrinsic to two transition systems sharing one inherited
property.

## What to do instead

Flip the theme atomically inside the View Transitions API and let the
browser crossfade whole-page snapshots (see `ThemeToggle.astro` and the
`theme-switching` block in `global.css`):

1. `document.startViewTransition(() => applyTheme(t))` when supported and
   `prefers-reduced-motion` is not set; plain `applyTheme(t)` otherwise
   (`withTransition` in `ThemeToggle.astro` picks between them, and both the
   click handler and the OS listener go through it).
2. Inside the flip, add `theme-switching` to `<html>` (it sets
   `transition: none !important` on everything) so no element-level
   transition runs underneath the snapshot; remove it two rAFs later.
3. Crossfade duration lives on `::view-transition-old/new(root)`.

Verified empirically (frame-sampling computed colors): the underlying flip
settles in one frame with zero intermediate values, while the snapshot
crossfade provides the smoothness.

## Related: font flicker (FOUT)

Fontsource loads Geist with `font-display: swap`; without preloads, text
paints in a fallback font and swaps. `BaseLayout.astro` preloads the latin
variable woff2 files via `?url` imports, which resolve to the same hashed
URLs the generated CSS uses (no double download). If fonts change, keep the
preloads in sync.
