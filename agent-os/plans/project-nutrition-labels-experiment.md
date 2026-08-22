# Project Nutrition Labels Experiment

## Status

Complete

## Context

The standalone Project Nutrition Labels prototype should become a native
portfolio experiment. Its useful core is the switchable performance, impact,
and learnings label—not the prototype's standalone page shell.

## Desired Outcome

`/play/project-nutrition-labels` presents the interactive label system inside
the existing experiment template, responds to the portfolio's light and dark
modes, and occupies a compact eight-track desktop footprint. It appears in the
Experiments index and joins the curated homepage list without adding homepage
preview imagery.

## Approach

Rebuild the prototype's interactive core as a small React island using the
already-installed Lucide icon package. Keep the existing three examples and
their switcher, but express the entire surface through the portfolio's
semantic colour, type, spacing, border, and square-corner conventions. Author
the experiment as MDX so the native component can sit naturally within the
existing case-study prose flow.

Use the supplied day painting as the standard hero and its night counterpart
in dark mode. Keep both WebP files as clean backdrops and centre the actual
coded Performance label over them; the interactive label remains in the
content body beneath them.

## Scope

In:

- Native, accessible three-state Project Nutrition Labels demo.
- Published experiment content and concise explanatory copy.
- Existing `/play` listing and `/play/<slug>` route integration.
- Light/dark and responsive behavior using existing tokens.
- Optimised theme-aware day/night WebP backdrops with a centered coded
  Performance label above the content.
- A position in the curated homepage Experiments list, with explicitly empty
  preview metadata.

Out:

- Homepage preview images.
- Copying the standalone prototype's page shell, typography, rounded corners,
  or raw colour values.
- Deploying or maintaining a second standalone version of the experiment.
- New design-system tokens unless visual verification reveals a genuine gap.

## Files To Modify

- `src/components/ProjectNutritionLabels.tsx`: native interactive demo.
- `src/components/project-nutrition-labels.css`: token-based component styles.
- `src/components/ThemeImage.astro`: reusable light/dark hero renderer.
- `src/content/play/project-nutrition-labels.mdx`: experiment metadata and body.
- `src/content.config.ts`: optional dark hero path.
- `src/pages/play/[...slug].astro`: shared experiment header alignment.
- `src/pages/work/[...slug].astro`: matching shared case-study header alignment.
- `agent-os/system-map.md`: record native MDX experiment components.

## Steps

- [x] Port the three label definitions into a typed React component.
- [x] Restyle the component with existing semantic tokens and system roles.
- [x] Add the MDX experiment to the homepage curation without preview images.
- [x] Optimise the supplied day/night backdrops to WebP, theme-switch them,
  and layer the coded Performance label over both.
- [x] Run convention checks and a production build.
- [x] Verify interaction, responsive layout, and both appearance modes.

## Review

- Design: the demo resolves to 337px at the desktop review width, with a 20px
  title, 16px values, 14px labels, 16px fact icons, and a 24px hero icon in a
  neutral 48px frame. A consistent 32px card inset and 16px row rhythm replace
  the prose margin that had leaked into the component. Tabs use neutral rules
  throughout and reserve a 1px accent edge for the selected state. Native
  semantic colours and square geometry hold in both modes.
- Content: three short sections explain the system without turning the page
  into a full case study.
- Architecture: content remains in the Play collection; interactivity remains a
  local island; the hero reuses its server-rendered Performance state over
  clean backdrop assets; homepage curation remains metadata-driven.
- Verification: `pnpm check` and `pnpm build` pass. Browser review confirmed all
  three states, no console errors, and no horizontal overflow at 390px. The
  detail page switches between the 1536×800 day/night WebP backdrops. The coded
  UI label is centered independently of the imagery, and the two backdrops are
  about 373KB combined. The homepage includes the experiment as a curated row
  without loading those detail-page backdrops as previews.

## Learnings

The MDX-plus-island pattern is now recorded in the system map. No new styling
convention or design token was needed.
