# Homepage Neutral Hero

## Status

Complete

## Context

The homepage hero currently uses a two-row information box, a contact jump
link, and a rain shader over theme-specific placeholder imagery. The hero
needs to become quieter and more informational.

## Desired Outcome

The hero has four static information rows and a matched pair of subtle neutral
textures for light and dark appearance modes, with no shader layer.

## Approach

Generate one dark neutral texture, derive a composition-matched light version,
and keep `ThemeImage` responsible for selecting the appropriate asset.

## Scope

In:

- Replace the hero contact link with three additional informational rows.
- Replace the current hero imagery with generated light and dark textures.
- Remove the rain effect from the homepage and clean up files it leaves unused.

Out:

- Navigation or contact-section changes.
- Changes to other theme-aware imagery.
- Broader homepage layout or styling changes.

## Files To Modify

- `src/pages/index.astro`: update hero copy, media, and imports.
- `src/components/ThemeImage.astro`: remove the unused effect slot.
- `public/images/`: replace the old hero assets with the generated texture pair.
- `src/components/RainOverlay.astro`: remove the now-unused effect component.
- `agent-os/system-map.md`: remove the retired ambient-effect subsystem.

## Steps

- [x] Generate and inspect the matched texture pair.
- [x] Update the hero rows and theme-aware image sources.
- [x] Remove obsolete shader and image files.
- [x] Run the convention check and production build.

## Review

- Design: quiet neutral texture, matched composition across modes.
- Content: four concise informational rows, no hero contact link.
- Architecture: retain `ThemeImage`; remove the unused shader component.
- Verification: `pnpm check` and `pnpm build`.

## Learnings

No durable convention change was needed. The system map now reflects that
theme-aware imagery remains while the ambient shader subsystem has been
retired.
