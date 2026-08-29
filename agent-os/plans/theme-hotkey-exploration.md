# Theme Hotkey Exploration

## Status

Implemented

## Design Question

How should an `L` keyboard hint sit with the existing theme icon so the
shortcut is discoverable without making the portfolio navigation feel heavy?

## Why It Matters

The theme toggle is useful but visually quiet. A visible shortcut hint can
make the new keyboard interaction learnable, provided it still reads as site
furniture rather than a second call to action.

## Shared Constraints

- Real content: existing wordmark, navigation labels, theme icons and homepage
  hero.
- Existing design tokens and primitives: neutral semantic colours, Apparat,
  square geometry and the shared control sizes.
- Required information or actions: current-appearance icon, click/tap toggle,
  and the `L` shortcut.
- Accessibility requirements: `aria-keyshortcuts`, action-oriented labels,
  visible focus, and no shortcut handling inside editable controls.
- Responsive contexts: narrow mobile and wide desktop navigation.
- Appearance and motion modes: light/dark and reduced motion.

## Directions

| Direction | Idea being tested | Expected strength | Possible weakness |
| --- | --- | --- | --- |
| A | Adjacent keycap: icon and outlined `L` are always visible as one inline action | Closest to the reference and easiest to learn | Slightly widens the navigation control |
| B | Split control: icon and key occupy two cells inside one outlined control | Strong relationship between action and shortcut | May feel heavier than the surrounding links |
| C | Context hint: vanilla icon with an attached `L` hint revealed on hover/focus | Preserves the quiet resting header | Shortcut is less discoverable without pointer or focus |

## Comparison Surface

- Worktree starting point: clean local `main` at `a3a6f42`
- Branch: `codex/explore-theme-hotkey`
- Temporary route: `/lab/theme-hotkey`
- Temporary components: `src/components/lab/theme-hotkey/`

## Evaluation Criteria

- Information hierarchy: icon remains primary; key hint reads as assistance.
- Fit with the portfolio's visual direction: neutral, square, compact and
  content-first.
- Real-content resilience: navigation continues to fit at its existing
  breakpoint.
- Mobile and desktop behaviour: control remains reachable and does not crowd
  wrapped navigation.
- Light and dark appearance: token mappings retain clear edges and contrast.
- Interaction and keyboard behaviour: click and `L` agree, focus is visible,
  and editable fields are protected.
- Motion and reduced-motion behaviour: reuse the current theme transition and
  remove it when reduced motion is requested.
- Complexity introduced: the selected production version should extend the
  existing toggle rather than create another theme state model.

## Scope

In:

- Build and compare the three directions in an isolated worktree.
- Record visual and interaction observations.
- Promote only the selected direction after approval.

Out:

- Editing the production theme toggle before a direction is selected.
- Publishing the temporary lab route.
- Adding a new dependency or design-system primitive.
- Merging the prototype into `main`.

## Review Notes

### Direction A

- Works well: closest to the reference, always discoverable, remains visually
  subordinate to navigation, and fits the existing mobile header without
  overflow.
- Concerns: adds one compact control-width to the right-side group.

### Direction B

- Works well: makes the icon/shortcut relationship unmistakable and preserves
  a single click target.
- Concerns: the full outline gives the theme action more visual weight than the
  surrounding navigation links.

### Direction C

- Works well: leaves the vanilla theme icon untouched at rest and provides the
  most literal tooltip interpretation.
- Concerns: hides shortcut discoverability until hover/focus, and the revealed
  key overlaps the wrapped navigation row at the mobile breakpoint.

## Decision

- Selected direction: A — Adjacent keycap.
- Why it was selected: It stays closest to the reference, keeps the shortcut
  visible without adding navigation weight, and fits the existing header at
  desktop and mobile widths.
- Useful ideas retained from other directions: The control keeps a plain-language
  accessible label and keyboard shortcut declaration while the visible treatment
  stays compact.
- Ideas deliberately rejected: B made the control feel heavier than the
  surrounding navigation. C hid shortcut discovery until interaction and its
  tooltip competed with the mobile navigation.

### Keycap CTA States

- Rest: a low-contrast raised light/shade surface.
- Hover and keyboard focus: the shared raised-hover treatment.
- Pointer press and physical `L` key press: the shared inset treatment.
- Geometry: square-edged in every state, matching the portfolio surfaces.

## Cleanup Before Pull Request

- [x] Selected direction moved into the production component.
- [x] Rejected variants removed.
- [x] Temporary `/lab/` route removed.
- [x] Temporary lab components, styles, assets, and imports removed.
- [x] No unrelated changes included.
- [x] Responsive and appearance states reviewed again after cleanup.
- [x] `pnpm check` passes.
- [x] `pnpm build` passes.

## Learnings

The shortcut hint belongs inside the theme toggle's single action, with the
icon carrying current appearance and the keycap carrying discovery. Reusing
the shared light/shade effects keeps a new compact control at material parity
with the site's larger linked surfaces without introducing new tokens.
