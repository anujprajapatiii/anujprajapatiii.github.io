# Coherent Surface Ladder

## Status

Implemented

## Context

The background system has enough semantic names, but their primitive mappings
do not form one consistent depth model. Several roles that appear next to or
inside each other resolve to the exact same colour:

| Theme | Collision | Result |
| --- | --- | --- |
| Main light | raised-hover = canvas (`neutral-100`) | A hovered card merges into the page. |
| Main dark | raised-hover = inset (`neutral-600`) | A card merges with its thumbnail/placeholder on hover. |
| Blue light | raised-hover = canvas (`blue-100`) | A hovered raised surface loses its edge. |
| Blue dark | raised-rest = inset (`blue-800`) | Nested UI, including the nutrition-label icon frame, merges at rest. |

The direction is also inconsistent: `secondary` is recessed/darker in light
mode but raised/lighter in dark mode. Component-level fixes cannot solve this
reliably because the collision is already present in the shared mappings.

## Desired Outcome

Every palette follows the same four-role topology:

1. **Canvas** — the page ground.
2. **Inset** — media placeholders, code, and recessed content.
3. **Raised** — cards and elevated panels.
4. **Raised hover** — one clear but restrained step beyond raised.

Adjacent or nested roles never resolve to the same primitive. Hover direction
is predictable in both appearances: canvas rises one level, inset returns
toward canvas, and raised moves one level farther outward. Text contrast stays
at least WCAG AA; primary text targets AAA.

## Approach

Keep the existing semantic API (`primary`, `secondary`, `quaternary` and their
hover partners) to avoid component churn, but document their structural jobs:

| Existing token | Structural role |
| --- | --- |
| `bg-primary` | canvas |
| `bg-primary-hover` | canvas hover / raised rest |
| `bg-secondary` | inset |
| `bg-secondary-hover` | inset hover / canvas |
| `bg-quaternary` | raised |
| `bg-quaternary-hover` | raised hover |

Add only the missing endpoint/intermediate primitives needed to make that
topology possible. Do not alter text or border primitives in this pass.

### Proposed main-neutral mapping

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | new `neutral-150` (`#eef0f2`) | `neutral-800` |
| Canvas hover / raised | `neutral-100` | `neutral-700` |
| Raised hover | `white` | `neutral-600` |
| Inset | `neutral-200` | `neutral-900` |
| Inset hover | new `neutral-150` | `neutral-800` |

This changes the light canvas from near-white to a quiet grey, giving white
and near-white surfaces room to express rest and hover. Dark inset surfaces
move inward to `neutral-900`, preventing them from colliding with raised-hover.
Primary/secondary text remains comfortably readable across the proposed
surfaces: measured primary contrast is 10.65–15.39:1 and secondary is
5.90–8.83:1.

### Proposed blue-palette mapping

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `blue-100` | `blue-900` |
| Canvas hover / raised | new `blue-50` (`#f8f9ff`) | `blue-800` |
| Raised hover | `white` | `blue-700` |
| Inset | `blue-200` | new `blue-950` (`#000318`) |
| Inset hover | `blue-100` | `blue-900` |

The blue palette keeps the same topology while remaining genuinely
monochrome, especially in dark mode. The new endpoints are foundations, not
component-specific variants.

## Surface Invariants

- A parent surface and a nested child surface must never resolve to the same
  primitive in rest or hover states.
- Raised-rest and raised-hover must always be distinct.
- `canvas-hover = raised-rest` and `inset-hover = canvas` are intentional
  level transitions, not collisions; document them as such.
- Components consume semantic roles only. No direct neutral/blue primitive is
  allowed outside token mapping and style-guide data.
- Page palettes must implement the same topology even when their primitive
  ramps differ.
- Colour alone is not the only focus signal; the existing 2px focus outline
  remains unchanged.

## Scope

In:

- Main light/dark background mappings.
- Blue light/dark background mappings.
- New `neutral-150`, `blue-50`, and `blue-950` primitives.
- Existing aliases (`background`, `muted`, `card`, elevated roles) following
  the revised mappings automatically.
- A style-guide surface-state specimen showing canvas, inset, raised, and
  raised-hover as nested/adjacent composites—not isolated swatches only.
- Browser review of real composites: project cards, experiment rows and
  thumbnails, buttons, code blocks, media placeholders, nutrition labels, and
  the blue case-study page in both appearances.

Out:

- Text, icon, border, status, or brown-accent remapping unless a measured
  contrast failure blocks the surface change.
- New component-local colour declarations.
- Additional surface roles or renaming the existing public token API.
- Other future page palettes; they will inherit the documented topology when
  introduced.

## Files To Modify

- `src/styles/global.css`: add the neutral primitive and remap main surfaces.
- `src/styles/themes/blue.css`: add/use the blue endpoints and remap surfaces.
- `src/pages/style-guide.astro`: update primitive/mapping tables and add the
  composite surface-state specimen.
- `agent-os/conventions/styling.md`: document the topology and invariants.
- `agent-os/plans/coherent-surface-ladder.md`: track implementation/review.

## Steps

- [x] Add the three missing primitives in their canonical ramps.
- [x] Apply the approved main and blue surface mappings.
- [x] Update the style-guide token data.
- [x] Add a nested surface-state specimen for perceptual review.
- [x] Document the surface topology and intentional equivalences.
- [x] Run convention checks, production build, and contrast calculations.
- [x] Review all listed real composites in main/blue, light/dark, rest/hover.
- [x] Tune only primitive values if the topology is correct but a perceptual
  step is too weak or strong; do not break the role mapping to fix one screen.
  No tuning was needed after browser review.

## Review

- Design: Each level is perceptible but quiet; hover never erases a card or a
  nested child.
- Content: No content changes.
- Accessibility: Primary/secondary text passes AA everywhere it is used;
  focus outline remains visible on every surface.
- Architecture: Same semantic topology across main and blue palettes, with no
  component exceptions.
- Verification: `pnpm check`, `pnpm build`, `git diff --check`, measured
  contrast table, and browser screenshots of the composite matrix.

## Learnings

The styling convention now records the shared four-level topology and the two
intentional role equivalences. Browser review covered the style-guide matrix,
homepage cards and experiment rows, the blue case-study page, and the nested
nutrition-label surfaces in both appearances. No parent/child or rest/hover
collision remained.

Measured contrast across canvas, inset, raised and raised-hover surfaces:

| Palette | Primary text minimum | Secondary text minimum |
| --- | ---: | ---: |
| Main light | 10.65:1 | 6.11:1 |
| Main dark | 10.65:1 | 5.90:1 |
| Blue light | 9.85:1 | 6.96:1 |
| Blue dark | 12.23:1 | 7.71:1 |

`pnpm check`, `pnpm build`, and `git diff --check` passed. The fresh local
preview produced no console errors, and the nutrition-label tab interaction
continued to hydrate and switch content correctly.
