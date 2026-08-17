# Canonical Colour System

## Status

Complete

## Context

The portfolio currently ships a deliberately reduced neutral palette plus one
brown decorative primitive. Anuj has now consolidated the current colours,
the previously removed colour families, and a complete light/dark semantic
schema in Figma-ready variable files. The code should adopt that complete
system without unexpectedly recolouring components that use the existing
portfolio roles.

## Desired Outcome

The portfolio has one complete two-tier colour system matching the canonical
Figma variables: all historical and current primitives exist once, all supplied
background, text, icon, and border roles have light and dark mappings, existing
site UI keeps its current appearance, and `/style-guide` accurately documents
the expanded system.

## Approach

- Restore the exact historical primitive values alongside the current neutral
  scale and `neutral-350` addition.
- Add the canonical semantic vocabulary using CSS custom properties named for
  the Figma hierarchy (`--bg-*`, `--text-*`, `--icon-*`, and `--border-*`).
- Keep primitives literal and theme-independent; every semantic value must be
  a `var(--primitive)` reference, with dark mappings contained in `.dark`.
- Preserve the portfolio's existing rendered colours by mapping its established
  site-specific roles (`--background-*`, interactive/inverse text, hover border,
  shader tint, and decorative accent) to canonical roles where the intent is
  equivalent and retaining the specialised roles where no canonical slot
  exists.
- Expose the canonical roles through Tailwind's theme bridge so future
  components can use semantic utilities rather than primitive colours.
- Expand the style guide from a reduced-palette rationale into a complete
  primitive and semantic reference, while distinguishing canonical roles from
  portfolio-specific compatibility roles.

## Scope

In:

- Restore Brown 50–600, Amber 100–400, Blue 100–600, Green 100–400,
  Red 100–400, and Yellow 100–600 with their exact historical hex values.
- Retain the current Neutral scale, including `neutral-350`.
- Add all 106 canonical semantic roles for light and dark modes across
  background, text, icon, and border groups.
- Keep the existing homepage, cards, navigation, buttons, tables, shader, and
  decorative flourish visually stable through semantic compatibility aliases.
- Update `/style-guide` to catalogue all 43 primitives, all canonical roles,
  and the smaller set of portfolio-specific roles.
- Update the styling convention so it accurately describes the restored status
  palette and the relationship between the Figma documentation and code.
- Verify token integrity, project conventions, production build, and the style
  guide in both themes and responsive layouts.

Out:

- Applying status, info, or accent colours to existing portfolio content.
- Redesigning components, changing typography/layout, or changing content.
- Adding a runtime Figma sync, token build dependency, or new package.
- Committing, pushing, merging, or publishing the branch.

## Files To Modify

- `src/styles/global.css`: restore primitives, add canonical semantic mappings,
  preserve compatibility roles, and expose semantic Tailwind tokens.
- `src/pages/style-guide.astro`: document the complete primitive and semantic
  system in both themes.
- `agent-os/conventions/styling.md`: replace the obsolete reduced-palette and
  "Figma dropped" guidance with the adopted canonical-system rules.
- `agent-os/plans/canonical-colour-system.md`: record progress, review, and the
  final verification result.

## Steps

- [x] Restore and organise the complete primitive palette.
- [x] Add the complete light-mode canonical semantic set.
- [x] Add the complete dark-mode semantic remaps.
- [x] Map existing portfolio-specific roles without changing current visuals.
- [x] Add canonical semantic tokens to the Tailwind theme bridge.
- [x] Expand the style-guide catalogue and supporting explanation.
- [x] Update the durable styling convention.
- [x] Validate token references and light/dark completeness.
- [x] Run convention checks and a production build.
- [x] Visually review `/style-guide` and representative portfolio pages in both
      themes at mobile and desktop widths.
- [x] Decide whether a reusable learning note or system-map update is needed.

## Review

- Design: Existing public pages remained visually unchanged. The expanded style
  guide is legible at 375px and 1440px in light and dark modes without page
  overflow.
- Content: An automated comparison against the approved Figma import files
  confirmed 43 primitive values and 106 semantic mappings per mode with zero
  mismatches or unresolved references.
- Architecture: Raw hex values live only in primitives; canonical roles point
  directly to primitives; portfolio and Tailwind compatibility aliases sit
  above them. Existing components continue to consume semantic roles.
- Verification: `git diff --check`, the 14-rule convention checker, and the
  15-page Astro production build passed. Browser review covered `/style-guide`,
  `/`, and `/play` at mobile and desktop widths in both themes, with no console
  errors or horizontal overflow.

## Learnings

No separate learning note or system-map change is needed: the subsystem
boundary is unchanged, and the durable Figma/code compatibility rule now lives
in `agent-os/conventions/styling.md`, replacing the obsolete reduced-palette
guidance.
