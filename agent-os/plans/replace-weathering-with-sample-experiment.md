# Replace Weathering With Sample Experiment

## Status

Complete

## Context

Weathering is no longer needed in the public experiment collection. The slot
should remain populated with a neutral placeholder until a new experiment is
ready.

## Desired Outcome

The experiments index and homepage feature a generic Sample Experiment instead
of Weathering, with no Weathering media, embed, or live-project links shipped.

## Approach

Replace the content entry with a new slug and concise placeholder copy. Rely on
the collection's existing empty-media fallback rather than creating temporary
visual assets.

## Scope

In:

- Remove the Weathering content entry and its image directory.
- Add a published, featured Sample Experiment with generic dummy content.
- Preserve the existing featured position so surrounding experiments do not
  reorder.

Out:

- Changes to experiment schemas, routes, components, or shared styles.
- Changes to other experiments.
- Rewriting historical plans or learnings that mention Weathering.

## Files To Modify

- `src/content/play/weathering.md`: remove the retired experiment.
- `src/content/play/sample-experiment-01.md`: add the replacement entry.
- `public/images/play/weathering/`: remove retired media.

## Steps

- [x] Replace the content entry and preserve its curated position.
- [x] Remove Weathering-only media.
- [x] Verify content conventions and the production build.

## Review

- Design: use the existing neutral missing-media fallback.
- Content: clearly generic sample copy with no invented project claims.
- Architecture: retain the content collection and rendering infrastructure.
- Verification: `pnpm check` and `pnpm build`.

## Learnings

No durable convention change was needed. The collection's existing empty-media
fallback is sufficient for intentional placeholder entries.
