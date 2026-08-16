# Paper Typography & Layout Refresh

## Status

Complete

## Context

Anuj updated the homepage direction in Paper (`Bright olive`, Production,
"Homepage — desktop 1440 (play table update)"). The artboard is both a style
and interface-copy reference, with one exception: its repeated placeholder
project titles and descriptions must not replace the site's real project
content.

The useful changes are systemic and visual:

- TASA Orbiter replaces Söhne everywhere below the Violet Sans display step.
- The 14px small/metadata step returns.
- Non-display hierarchy uses TASA Orbiter Regular 400 and Medium 500, with
  Semibold 600 reserved for inline emphasis where the site already needs it.
- Homepage section headings gain the narrow brown marker shown in Paper.
- Homepage grids and card interiors become tighter and more editorial.
- Homepage/nav copy follows Paper: "Featured Projects", "Experiments",
  "View all", and "Get in touch".

Paper's exact values were read from the artboard's JSX and computed styles,
not estimated from its screenshot. The existing code remains authoritative
for content, responsive behavior, dark mode, and interaction.

## Desired Outcome

- Violet Sans remains the homepage display face; every other readable surface
  uses self-hosted TASA Orbiter.
- The type scale is 72 / 44 / 30 / 20 / 16 / 14, with zero tracking.
- Homepage section headings use a reusable 8px brown marker with a 12px gap
  and the Paper labels: "Featured Projects", "Experiments", and "Get in
  touch".
- The homepage hero and Work grid use the tighter 12px visual rhythm from
  Paper; project cards use the Paper media proportion and 8px title-to-copy
  spacing.
- The existing shader, real project/play content, preview switching, mobile
  behavior, routes, and theme switching remain intact.
- Light and dark modes both have an intentional brown flourish, represented
  through the two-tier token system rather than a raw hex in a component.

## Approach

### Typography

- Source TASA Orbiter from the official Google Fonts distribution, self-host a
  variable WOFF2, and include its SIL Open Font License alongside the asset.
- Replace the two Söhne `@font-face` declarations and preloads with one TASA
  Orbiter variable face. Remove the unused Söhne font files after the swap.
- Keep Violet Sans and its preload unchanged for `text-display` only.
- Restore `--text-small` to 0.875rem (14px) / 1.5.
- Keep h1 light at 400; move h2/h3 and the wordmark to Medium 500; keep body
  and small at 400. Preserve Semibold 600 for strong emphasis and genuine
  labels.
- Update the conventions checker so it permits real TASA weights and continues
  rejecting weights the design does not use.

### Brown flourish

- Add one primitive, `--brown-300: #847b73`, matching the Paper artboard.
- Add `--decorative-accent`, referencing that primitive in both light and dark
  mode. The explicit dark mapping records that the same restrained brown is
  intentional in both themes.
- Expose the semantic token to Tailwind, catalog both tiers in `/style-guide`,
  and update the checked-in design-sync token bundle.
- Use the semantic token for the homepage section markers and the desktop nav
  dividers. No component will reference the primitive or raw hex directly.

### Homepage layout

- Add a small `SectionHeading.astro` component for the repeated marker + h2
  treatment, rather than duplicating the same decorative markup three times.
- Keep the existing section/action structure, but align heading/action rows at
  the top and use `text-h2` for the marked headings.
- Extend `Grid.astro` with an `xs` (12px) gap option, then apply it only to the
  homepage hero and featured Work grid. Other index pages retain their current
  grid spacing.
- Keep the live hero shader in the Paper media column; do not replace it with
  the artboard's placeholder.
- Update ProjectCard's media ratio from 16:10 to 5:3 and reduce title-to-copy
  space from 12px to 8px, matching the computed Paper card.
- Leave PlayPreviewList's structure and behavior intact: its desktop 70/30
  split, 250x80 thumbnails, and 12px gaps already match the artboard.

### Interface copy

- Change the public label from "Play" to "Experiments" in navigation, the
  listing page and experiment back links, while retaining the existing
  `/play` URL and content collection.
- Change the homepage Work heading from "Selected work" to "Featured
  Projects" and its CTA from "All work" to "View all".
- Change the homepage Play heading from "Play" to "Experiments" and its CTA
  from "All play" to "View all".
- Change the homepage contact heading from "Let’s make something grow." to
  "Get in touch".
- Keep the Paper footer wording: "© 2026 Anuj Prajapati", "Style guide",
  "GitHub", and "Email". The current component already renders those exact
  words, so retain its dynamic year and conditional-link behavior rather than
  hardcoding a visually identical copy.
- Preserve the real project and experiment titles, descriptions, images, and
  links. Do not copy the artboard's repeated "Sample Case Study" or "Voxel
  Lighting Studio" placeholders into collection content.

## Scope

In:

- Site-wide non-display font migration from Söhne to TASA Orbiter.
- Restoring the 14px small/metadata step.
- Updating approved type weights/line heights to match the Paper direction.
- One brown primitive and one theme-aware decorative semantic token.
- Brown section markers on the three homepage sections and brown desktop nav
  dividers.
- Homepage-only tighter hero/Work grid gaps and updated ProjectCard proportion
  and internal spacing.
- Paper interface copy for homepage section headings, both section CTAs, the
  Play/Experiments public labels, contact heading, and footer wording.
- Style guide, conventions, checker, agent guidance, font licensing, and
  design-sync bundle updates required to keep the system honest.
- Responsive visual verification in both themes.

Out:

- Copying Paper's placeholder project/experiment titles, descriptions, images,
  or links into the site's content collections.
- Renaming the `/play` route or the internal `play` content collection; only
  the public label changes to "Experiments".
- Replacing the hero shader, project images, or Play preview assets.
- Changing routes, collections, content files, theme behavior, hover behavior,
  or the Play preview interaction.
- Redesigning Work, Play, About, case-study, or style-guide page structure.
- Adding the rest of the historical brown palette or changing existing neutral
  tokens.
- Writing changes back to the Paper file.

## Files To Modify

- `src/assets/fonts/`: add TASA Orbiter WOFF2 + OFL; remove unused Söhne files
- `src/layouts/BaseLayout.astro`: preload TASA Orbiter instead of Söhne
- `src/styles/global.css`: font faces, type tokens, brown tokens, heading and
  layout styles
- `src/components/SectionHeading.astro`: reusable brown-marker heading
- `src/components/primitives/Grid.astro`: add the 12px gap option
- `src/components/ProjectCard.astro`: Paper card proportion and copy spacing
- `src/pages/index.astro`: apply the style-only homepage changes
- `src/pages/play/index.astro` and `src/pages/play/[...slug].astro`: use the
  public Experiments label without renaming the route or collection
- `src/data/site-config.ts`: update the Play navigation label to Experiments
- `src/pages/style-guide.astro`: document TASA, 14px small, and brown tokens
- `scripts/check-conventions.mjs`: update licensed/approved weight guardrails
- `agent-os/conventions/styling.md`: replace superseded Söhne/16px-floor rules
- `agent-os/conventions/content.md`: record Experiments as the public label for
  the existing Play collection and route
- `AGENTS.md`: update durable font-stack guidance
- `ds-bundle/tokens/tokens.css`: keep exported tokens aligned with source
- `ds-bundle/tokens/colours.html`: catalog the restored brown accent accurately

## Steps

- [x] Anuj approves this plan, especially Scope and the Paper copy translation
- [x] Add and license the self-hosted TASA Orbiter asset
- [x] Update font faces, preloads, type tokens, and checker guardrails
- [x] Add the brown primitive + semantic token and sync both catalogs
- [x] Build the reusable marked heading and apply homepage layout changes
- [x] Apply Paper's interface copy everywhere except collection/project content
- [x] Run `node scripts/check-conventions.mjs` and the Astro production build
- [x] Verify font requests/preloads and confirm Söhne is absent from output
- [x] Review 375 / 768 / 1024 / 1440 widths in light and dark mode
- [x] Check Play pointer, keyboard, reduced-motion code path, and horizontal overflow
- [x] Review rendered screenshots against Paper and correct the placeholder ratio
- [x] Record the durable typography/color decisions and mark the plan complete

## Review

- Design: Paper typography, brown markers, compact rhythm, and card proportions
  are recognizable without importing its placeholder content.
- Content: Paper's interface labels are adopted; real project/experiment data
  remains untouched; footer wording remains exact without losing dynamic year.
- Architecture: fonts are self-hosted/licensed; components use semantic tokens;
  repeated heading markup has one implementation.
- Verification: convention checker, Astro build, computed-font inspection,
  responsive screenshots in both themes, interaction checks, and overflow scan.

## Learnings

`agent-os/conventions/styling.md` and `content.md` now carry the durable font,
colour and public-terminology decisions. No separate learning note was needed:
the only visual correction found in review—the placeholder ratio override—is
specific to the existing ProjectCard implementation and is recorded in code.
