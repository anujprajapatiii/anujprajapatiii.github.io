# Style Guide Consumption UX

## Status

Complete

## Context

The style guide contains the right foundations and live specimens, but it has
grown as one flat inventory. It currently measures roughly 15,900px tall at a
1280px desktop viewport and 26,700px at 320px, exposes no local navigation,
and gives exhaustive primitive and semantic catalogs more visual weight than
the decisions maintainers reach for most often.

## Desired Outcome

The page works as a reference tool: a reader can understand its structure at a
glance, jump directly to any major topic, scan the common rules before opening
the exhaustive inventories, and use it comfortably with a keyboard or on a
small screen. The established portfolio design system remains unchanged.

## Approach

Reorganize the material into three task-oriented chapters — Foundations,
Layout, and Components — followed by a compact Reference appendix. Reuse the
existing Sidebar and OnThisPage navigation pattern, add a concise inline
chapter index for smaller screens, and use native disclosure elements for the
dense token catalogs and large demo specimens. Real headings, stable anchors,
shorter explanations, and page-local specimen styles will carry the hierarchy
without introducing new tokens, libraries, or visual language.

## Scope

In:

- Add a clear chapter overview and stable deep links for every reference topic.
- Reuse the existing desktop on-this-page rail and provide the same chapter
  directory inline on smaller screens.
- Put semantic usage, typography, spacing, layout, and components before raw
  implementation inventories.
- Collapse exhaustive primitive and semantic groups with accessible native
  disclosure controls while keeping the catalog complete.
- Correct stale page-palette usage, font-preload wording, alias terminology,
  and the style-guide document outline.
- Keep real component specimens, make example links preserve reading position,
  and defer below-the-fold React hydration until visible.
- Move style-guide-only specimen rules out of the global stylesheet.
- Restore convention-checker coverage now that the page no longer needs
  layout or raw-colour exemptions.
- Verify light/dark modes, keyboard navigation, progressive disclosure, and
  responsive layouts at 320px, 768px, 1024px, and 1440px.

Out:

- Changing colour, type, spacing, radius, motion, or surface tokens.
- Changing public-page layouts or shared component behaviour outside an
  additive OnThisPage input option.
- Adding token search, copy-to-clipboard behaviour, or a new JavaScript UI
  framework.
- Expanding the guide into an exhaustive catalogue of every bespoke page
  component.
- Reworking the generated design bundle or Figma mirror.

## Files To Modify

- `src/pages/style-guide.astro`: new information architecture, concise copy,
  progressive disclosure, corrected examples, and lazy demo hydration.
- `src/data/style-guide.ts`: authored section manifest and display metadata
  separated from page composition.
- `src/components/OnThisPage.astro`: accept an authored section manifest while
  preserving the existing Markdown-heading API.
- `src/components/style-guide/style-guide.css`: page-local index, disclosure,
  catalog, and specimen treatments using existing tokens.
- `src/styles/global.css`: remove style-guide-only specimen selectors.
- `scripts/check-conventions.mjs`: remove the style-guide-only raw-colour and
  inline-layout exemptions.
- `agent-os/conventions/styling.md`: correct the stale reading-colour statement
  and record the style-guide information-architecture contract.
- `agent-os/plans/style-guide-consumption-ux.md`: track implementation and
  review status.

## Steps

- [x] Audit the current page, source data, shared navigation, and responsive
      behaviour.
- [x] Define the task-oriented information architecture and bounded scope.
- [x] Separate authored guide metadata from page composition.
- [x] Implement chapter navigation, semantic headings, and progressive
      disclosure.
- [x] Tighten content, correct stale reference details, and localize specimen
      styles.
- [x] Verify interaction, accessibility, both themes, responsive layouts,
      conventions, and production build.
- [x] Review the final diff and record durable guidance.

## Review

- Design: Existing Apparat roles, semantic colours, square geometry, restrained
  surfaces, and quiet interaction language remain intact.
- Content: Common decisions precede raw inventory; terminology and current-use
  claims match the implementation.
- Architecture: Astro owns the static page, native HTML owns disclosure, and
  existing Sidebar/OnThisPage behaviour is reused rather than duplicated.
- Verification: `pnpm check`, `pnpm build`, and `git diff --check` pass. Browser
  checks passed in light and dark mode at 320/768/1024/1440px with no page
  overflow, duplicate IDs, broken guide anchors, or console warnings. Every
  documented semantic light/dark mapping matched its rendered CSS value.
- Accessibility: The final outline is H1 > chapter H2 > topic H3 > specimen H4
  > specimen-detail H5. Native disclosures, labelled overflow tables, deep-link
  offsets, and the authored table-of-contents input were reviewed explicitly.

## Learnings

Update the active styling convention with the durable rule that the style guide
is task-first: decision guidance remains visible, exhaustive inventories use
progressive disclosure, and every major topic has a stable anchor. Create no
separate learning note; implementation did not reveal a new reusable failure
mode beyond the convention recorded above.
