# Replace Remaining Experiments With Placeholders

## Status

Complete

## Context

The public experiment collection still contains Voxel Lighting, Interaction
Anatomy, and Nutrition Labels. These should be retired and replaced with
generic sample entries, matching the Weathering replacement.

## Desired Outcome

The homepage and Experiments section contain four numbered sample experiments
with neutral empty-media treatments and no retired project content or media.

## Approach

Preserve the curated positions while replacing each entry with concise sample
copy. Remove project-specific implementations and typed route hooks that no
longer have a public consumer, while retaining reusable UI primitives, demo
recipes, embed support, content routing, tokens, and the style guide.

## Scope

In:

- Rename the existing placeholder to Sample Experiment 01.
- Replace the other three published experiments with Sample Experiments 02–04.
- Remove retired experiment media and project-only React implementations.
- Remove schema and route branches tied only to the retired implementations.
- Update the system map to describe the remaining generic experiment system.

Out:

- Changes to shared demo recipes, UI primitives, tokens, styles, or embeds.
- Changes to project/case-study content.
- Rewriting historical plans and learnings.

## Files To Modify

- `src/content/play/`: replace the remaining entries with samples.
- `public/images/play/`: remove retired project media.
- `src/components/InteractionAnatomyLab.tsx`: remove project-only code.
- `src/components/interaction-anatomy-lab.css`: remove project-only styles.
- `src/components/ProjectNutritionLabels.tsx`: remove project-only code.
- `src/components/project-nutrition-labels.css`: remove project-only styles.
- `src/content.config.ts`: remove retired project-specific selectors.
- `src/pages/play/[...slug].astro`: remove retired project-specific branches.
- `src/components/ThemeImage.astro`: remove the retired overlay hook.
- `agent-os/system-map.md`: reflect the generic placeholder collection.
- `agent-os/conventions/experiment-interfaces.md`: keep maturity evidence
  accurate after retiring the public demos.
- `src/pages/style-guide.astro`: remove stale live-project references while
  preserving the documented interface specimens.
- `scripts/check-conventions.mjs`: remove the retired experiment-only audit
  target while preserving shared component checks.

## Steps

- [x] Create four numbered sample entries in the existing curated order.
- [x] Remove retired content, assets, and experiment-only implementations.
- [x] Remove obsolete typed selectors and route branches.
- [x] Update the system map and verify the public routes.

## Review

- Design: all samples use the existing neutral empty-media fallback.
- Content: generic, concise, and clearly marked as placeholders.
- Architecture: shared experiment and design-system infrastructure remains.
- Verification: `pnpm check` and `pnpm build`.

## Learnings

The reusable experiment interface kit can remain documented and available even
when its former public proof projects are retired. Current documentation now
describes those examples as prior validation rather than live adopters.
