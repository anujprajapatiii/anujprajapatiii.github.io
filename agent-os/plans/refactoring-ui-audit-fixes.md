# Refactoring UI Audit Fixes

## Status

Complete

## Context

The Refactoring UI review of the current `main` branch found three remaining
system-level issues: subtle text falls just below AA contrast in both default
themes, interactive boundaries reuse deliberately quiet structural borders,
and the mobile homepage leaves too much space between the hero and the first
portfolio section.

## Desired Outcome

Small labels and placeholders meet normal-text contrast, controls have a
clearly identifiable boundary without strengthening decorative rules, and the
first project section arrives sooner on mobile while desktop remains visually
unchanged.

## Approach

Add the missing accessible intermediate primitive stops, introduce one
semantic interactive-border role, and apply it only where a boundary conveys
affordance. Keep structural borders quiet. Tighten the homepage handoff with a
page-specific responsive class rather than changing the shared Section
primitive.

## Scope

In:

- Strengthen tertiary and placeholder text in the default light/dark themes.
- Add an accessible interactive-border role for default and Blue palettes.
- Apply the role to secondary buttons, switches, slider thumbs, and the
  Interaction Anatomy composer.
- Reduce the mobile hero-to-Featured Projects separation by one spacing step.
- Update the style guide, generated design bundle, durable convention, and
  automated checks.

Out:

- Content or imagery changes.
- Recolouring decorative dividers, cards, or device outlines.
- Changing desktop layout, typography, control dimensions, or motion.

## Files To Modify

- `src/styles/global.css`: primitives, semantic mappings, shared button rule,
  responsive homepage rhythm, and Tailwind bridge.
- `src/styles/themes/blue.css`: accessible Blue interactive-boundary remaps.
- `src/styles/ui-controls.css`: adopt the interactive-boundary role.
- `src/components/interaction-anatomy-lab.css`: use the role for the composer.
- `src/pages/index.astro`: identify the first homepage portfolio section.
- `src/pages/style-guide.astro`: keep primitive and semantic catalogs current.
- `scripts/check-conventions.mjs`: protect the contrast contracts.
- `agent-os/conventions/styling.md`: document the new distinction and results.
- `ds-bundle/**`: regenerate from the canonical colour sources.

## Steps

- [x] Add accessible primitives and semantic mappings.
- [x] Migrate interactive boundaries and mobile homepage rhythm.
- [x] Update documentation and automated checks.
- [x] Regenerate the design bundle and run visual/interaction verification.

## Review

- Design: Controls become clearer without making the page grid or cards louder.
- Content: Unchanged.
- Architecture: Components continue to consume semantic roles; page palettes
  remain independent from light/dark appearance.
- Verification: Contrast calculations, `pnpm check`, `pnpm build`, and browser
  checks at mobile/desktop in both themes.

## Learnings

The durable rule belongs in `agent-os/conventions/styling.md`: structural rules
may remain quiet, while boundaries that communicate control affordance use a
separate measured semantic role. The convention checker now calculates the
critical text and non-text contrast pairs for the default and Blue palettes;
a deliberate failing-token test confirmed that the guard reports regressions.
No separate learning note is needed because this is an active convention.
