# Theme switching

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

1. `document.startViewTransition(flipTheme)` when supported and
   `prefers-reduced-motion` is not set; plain `flipTheme()` otherwise.
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
