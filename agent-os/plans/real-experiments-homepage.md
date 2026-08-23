# Real Experiments on the Homepage

## Status

Complete

## Context

The Experiments collection still contains four placeholder entries with
explicit filler copy. They currently occupy homepage featured positions and
force the homepage preview component to maintain a five-row limit and
hard-coded no-JavaScript selectors. The collection now has four real entries
that should be surfaced through the same typed publication and curation rules
used everywhere else.

## Desired Outcome

The filler experiments and their homepage presence are removed. Weathering,
Voxel Lighting, Interaction Anatomy, and Nutrition Labels become the curated
homepage experiment set, ordered through `featured` and `featuredOrder`. The
homepage keeps its deliberate five-item cap and naturally renders four while
there are four featured experiments. An experiment with no authored filmstrip
still uses its canonical thumbnail or theme-aware hero as a single preview.

## Approach

- Delete the four filler content entries.
- Mark the four real entries as featured with unique curated positions 1–4.
- Keep the homepage's five-item cap as an intentional product rule; fewer
  featured entries render naturally when the collection has not reached five.
- Let `PlayPreviewList` derive its visual frames from authored previews,
  falling back to `media.thumbnail` or the theme-aware hero when no previews
  exist.
- Keep the five-row no-JavaScript fallback aligned with the homepage cap.

## Scope

In:

- Removing filler experiment entries.
- Featuring the four real experiments on the homepage.
- Removing filler-driven homepage assumptions while retaining the deliberate
  five-item cap.

Out:

- Rewriting the real experiment body copy.
- Changing the experiment detail route or the public `/play` index.
- Adding experiment taxonomy, tags, or new content fields.
- Deleting unrelated image assets or prior plans.

## Files To Modify

- `src/content/play/generative-grid.md`: delete filler entry.
- `src/content/play/monsoon-gradient.md`: delete filler entry.
- `src/content/play/sound-and-shape.md`: delete filler entry.
- `src/content/play/type-specimen-03.md`: delete filler entry.
- `src/content/play/interaction-anatomy.md`: feature and position the real demo.
- `src/content/play/project-nutrition-labels.mdx`: shift curated position.
- `src/pages/index.astro`: retain the five-item featured query cap.
- `src/components/PlayPreviewList.astro`: use thumbnail/hero fallback for
  entries without authored previews.
- `src/styles/global.css`: retain the five-row no-JavaScript fallback aligned
  with the cap.
- `agent-os/plans/real-experiments-homepage.md`: track implementation and
  review.

## Steps

- [x] Apply the content set and curated order.
- [x] Preserve the homepage cap and its matching preview fallback rules.
- [x] Verify the homepage and `/play` routes with all real entries.
- [x] Run `pnpm check`, `pnpm build`, and `git diff --check`.
- [x] Confirm existing content conventions and system map already describe
  the query and featured-order protocol; no durable convention update needed.

## Review

- Design: Confirm the fourth real experiment does not create an empty preview
  pane and that the existing row/filmstrip treatment remains unchanged.
- Content: Confirm only filler entries were removed and canonical slugs for
  real work remain stable.
- Architecture: Confirm routes use typed query helpers and the component has
  no collection-specific or five-item assumptions.
- Verification: Browser check of homepage light/dark states, `/play`, and
  production build.

## Learnings

The homepage cap is a product rule, not filler-content scaffolding. Keep it in
the route and its progressive-enhancement fallback while allowing the typed
featured query to return fewer entries when the real collection is smaller.
