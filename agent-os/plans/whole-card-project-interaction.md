# Whole-Card Project Interaction

## Status

Complete

## Context

The shared Work/Experiment card currently keeps its surface static and exposes
a dedicated `View case study →` or `View experiment →` link. Homepage preview
rows are already full links, but use bordered boxes and change both text and
rule colours. The desired model is one coherent, quieter interaction language:
borderless linked surfaces whose title gains an arrow and whose background
shifts subtly while interactive.

## Desired Outcome

- The full shared card is one link and one keyboard-focus target.
- Dedicated `View case study →` and `View experiment →` rows are removed.
- Shared cards and homepage preview rows are borderless.
- Hover, keyboard focus, and press reveal `→` beside every card/row title.
- Cards and preview rows use the elevated surface at rest and the semantic
  elevated hover surface while active.
- Title and subtitle colours remain primary and secondary rather than changing
  on interaction.
- The preview row's thin accent/progress strip remains as selected-preview
  state, separate from the removed border chrome.
- The media, compact title/subtitle hierarchy, square corners, and page grids
  remain unchanged.

## Approach

Keep the outer `article`, but place one full-height anchor around its copy and
media. Give that anchor an accessible name from the visible heading. Keep the
arrow in both title structures as `aria-hidden`, visually hidden at rest, and
reveal it through the shared `lift-on` trigger so pointer, keyboard, and press
states stay equivalent without sticky touch hover. Reserve its inline space so
appearing does not reflow either card.

Remove preview-row border declarations and rule-channel interaction values.
Keep its existing selected-row accent strip and loader, resetting the strip to
the borderless row's actual bounds. Stop lifting title/subtitle colours so the
arrow and surface are the only hover signals across both component families.

Use `--background-elevated` at rest and
`--background-elevated-hover` interactively. Its dark and blue mappings already
produce a restrained step. Remap the main light `--bg-quaternary-hover` from
white to `neutral-100`, because it currently equals the white resting card and
cannot show a state change. No raw colour or new token is needed.

## Scope

In:

- Shared `ProjectCard` instances on Home, Work, and Experiments.
- Homepage `PlayPreviewList` rows and their selected-preview accent strip.
- Link semantics, CTA removal, borders, title-arrow state, and surface state.
- Main light-mode mapping for the existing quaternary/elevated hover role.
- Style-guide token documentation and durable styling conventions.
- Pointer, keyboard, touch-press, light, dark, and blue-palette behavior.

Out:

- Preview pane, filmstrip, autoplay, loader timing, and selection behavior.
- Card typography, copy, media, grid spans, spacing tokens, or routes.
- New animation, colour, spacing, or typography tokens.

## Files To Modify

- `src/components/ProjectCard.astro`: make the card one full-content link and
  replace the CTA with a decorative title arrow.
- `src/components/PlayPreviewList.astro`: add the shared decorative title
  arrow to preview rows.
- `src/styles/global.css`: card layout/state rules and light hover-token remap.
- `src/pages/style-guide.astro`: update the quaternary-hover mapping.
- `agent-os/conventions/styling.md`: replace the dedicated-CTA convention.
- `agent-os/plans/cursor-inspired-project-cards.md`: mark the old interaction
  decision as superseded while retaining it as history.
- `agent-os/plans/whole-card-project-interaction.md`: track completion.

## Steps

- [x] Refactor the shared card to one accessible full-card anchor.
- [x] Remove both dedicated CTA labels and add the hidden-at-rest title arrow
  to shared cards and preview rows.
- [x] Remove preview-row borders while preserving selected accent/progress.
- [x] Wire both component families into the same surface/arrow interaction.
- [x] Remap and document the main light elevated-hover surface.
- [x] Update the current styling convention and supersede the previous plan.
- [x] Run convention checks, production build, and focused browser review.

## Review

- Design: Surfaces are quiet and borderless; the arrow is the only added
  interaction mark, while the 4px preview strip continues to communicate
  selection. Light moves white → neutral-100; dark moves neutral-700 → 600.
- Content: No repetitive CTA labels remain.
- Accessibility: Each card/row has one focusable link and a visible 2px focus
  outline. Focus reveals the same arrow and surface state as hover/press.
- Architecture: Existing elevated/elevated-hover roles and the shared
  `lift-on` trigger handle both component families; no new token was added.
- Verification: `pnpm check`, `pnpm build`, and `git diff --check` pass.
  Browser review covered Home, Work, and Experiments in light and dark modes.

## Learnings

Updated the existing styling convention and archived the superseded
dedicated-CTA plan. No separate learning note was needed.
