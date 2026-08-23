# Compact Project and Experiment Copy

## Status

Complete

## Context

Work and Experiment cards now use compact, uppercase 16px titles, but several
source titles still run beyond two words and their shared descriptions are too
long for the quick-scanning card treatment. The same frontmatter powers cards,
listing rows, page introductions, metadata, and related-content cards, so the
copy should be tightened at its canonical source.

## Desired Outcome

Every public Work and Experiment entry has a title of no more than two words
and a direct description of no more than eight words. Each entry remains easy
to distinguish without adding tags, alternate card-copy fields, or new content
structure.

## Approach

Rewrite only `title` and `description` in frontmatter. Keep source titles in
natural title case; the existing card treatment handles uppercase visually.
Use one short, concrete idea per description. Record the two-word/eight-word
limits as the default convention for future entries.

Proposed copy:

| Entry | Title | Description |
| --- | --- | --- |
| Sample Case Study | Sample Project | A clean template for future case studies. |
| Northwind Rebrand | Northwind Rebrand | A scalable identity for a growing logistics brand. |
| Atlas Onboarding | Atlas Onboarding | Faster first-run insights for analytics teams. |
| Lantern Campaign | Lantern Campaign | One launch system, built for six channels. |
| Weathering | Weathering | Procedural rain across shifting terrain. |
| Voxel Lighting Studio | Voxel Lighting | Build voxel scenes. Shape light live. |
| Type Specimen No. 3 | Type Specimen | One grotesk, pushed across a dark canvas. |
| Monsoon Gradient Study | Monsoon Gradients | Rain-soaked colour, distilled. |
| Project Nutrition Labels | Nutrition Labels | Project context, compact and comparable. |
| Generative Grid | Generative Grid | Seeded layouts that never repeat. |
| Sound × Shape | Sound × Shape | Field recordings translated into motion. |

## Scope

In:

- Titles and descriptions for every current Work and Experiment entry.
- A durable content convention: titles default to two words maximum and
  descriptions to eight words maximum.
- Source and production-build verification that all entries comply.

Out:

- Slugs, filenames, routes, page bodies, media, roles, skills, dates, types,
  status, featured ordering, or navigation.
- Separate card subtitles or new schema fields.
- Rewriting placeholder case-study body content.

## Files To Modify

- `src/content/projects/*`: compact Work titles and descriptions.
- `src/content/play/*`: compact Experiment titles and descriptions.
- `agent-os/conventions/content.md`: record the concise naming convention.
- `agent-os/plans/compact-project-experiment-copy.md`: track completion.

## Steps

- [x] Apply the approved title and description map to all 11 entries.
- [x] Add the title and description limits to the content convention.
- [x] Audit word counts across both collections.
- [x] Run convention checks and a production build.

## Review

- Design: Confirm every card title remains compact and every subtitle scans in
  one short beat.
- Content: Confirm each rewrite retains the entry's distinguishing idea.
- Architecture: Keep the existing single canonical title/description fields.
- Verification: Word-count audit, `pnpm check`, `pnpm build`, and
  `git diff --check`.

## Learnings

Updated the existing content convention; no separate learning note was needed.
