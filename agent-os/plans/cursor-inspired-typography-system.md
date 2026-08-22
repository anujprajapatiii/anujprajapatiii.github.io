# Cursor-Inspired Typography System

## Status

Complete — implemented and verified 2026-08-22.

## Context

The portfolio already has a disciplined type foundation: TASA Orbiter for
reading, Violet Sans for one display step, three approved weights, six unique
sizes, a 14px small step, and no call-site leading or tracking. The next level
of maturity is not a larger scale. It is a clearer contract for what each type
style does, how it responds, and how fonts load.

The Cursor analysis in task `01a0254b-4e1f-7b62-96ef-a6413954e293` is useful
for its system logic:

- visual roles are independent from HTML heading levels;
- weight stays quiet while size, spacing, and colour create hierarchy;
- line-height contracts as type grows;
- responsive exceptions are deliberate rather than accumulated per page;
- font fallbacks are calibrated to reduce layout shift;
- large display type is reserved for a small number of emotional moments.

Its exact font, sizes, tracking, 15px mobile root, and product-simulation font
mix are not transferable to this portfolio. TASA and Violet have different
metrics and the site's 4px spacing system is rem-based, so globally shrinking
the root would also shrink unrelated layout values.

### Measured baseline

The current six unique sizes are 72 / 44 / 30 / 20 / 16 / 14px at their
desktop maxima. Browser checks at 1440px and 390px found:

| Current step | 1440px | 390px | Current role |
| --- | --- | --- | --- |
| `display` | 72 / 73.44 | 40 / 40.8 | Homepage signature moment |
| `h1` | 44 / 47.52 | 32 / 34.56 | Page and case-study title |
| `h2` | 30 / 39 | 24 / 31.2 | Section/prose heading |
| `h3` | 20 / 26 | 20 / 26 | Card/prose subheading |
| `body` | 16 / 25.6 | 16 / 25.6 | General body and introductions |
| `small` | 14 / 21 | 14 / 21 | Metadata, navigation, compact UI |

Case-study body text currently reuses the `body` token but locally changes its
line-height to 22.4px (140%) and colour to the reading role. That preserves a
previous design decision, but the mechanism hides two different rhythms under
one token name. The homepage display wraps to three lines at 1440px and two at
390px. The root remains 16px at both widths.

The local font files also establish useful constraints:

- TASA Orbiter is variable on `wght` only (400–800); it has no optical-size
  axis. The approved site weights remain 400, 500, and 600.
- Violet Sans contains one 400 normal face and no variable axes.
- Both fonts are currently preloaded on every route, even though Violet is
  only visibly used on the homepage and style guide.

## Desired Outcome

- Five unique, role-based sizes describe intent rather than HTML tags.
- Semantic markup remains correct while visual hierarchy can vary by context.
- Font family, type role, and text treatment are distinct layers instead of
  being conflated in component CSS.
- General body rhythm and long-form reading rhythm are explicit and cannot
  silently override one another.
- Responsive behavior is predictable, documented, and limited to the roles
  that need it.
- Fallback fonts minimize reflow while TASA and Violet load.
- Font preloads reflect real use rather than fetching both families on every
  page by default.
- `/style-guide` is a decision and regression surface, not just a token list.
- The convention checker prevents deprecated role names and one-off type
  values from returning.

## Approach

### 1. Preserve the identity; improve the API

Keep TASA Orbiter, Violet Sans, the approved weights, the 14px step, and the
current rule that Violet is used only for display. Reduce the current six
unique sizes to five by combining `h2` and `h3` into one shared heading step.
This is the main visual simplification: section importance comes from semantic
structure and spacing, not from maintaining both 30px and 20px headings.

Replace tag-shaped names with compositional roles:

| Proposed role | Replaces | Meaning |
| --- | --- | --- |
| `display` | `display` | One signature Violet Sans moment; simplify its fluid range from 40–72px to 40–64px |
| `title` | `h1` | Primary page or case-study title |
| `heading` | `h2` + `h3` | Sections, cards, and prose headings; start from the current 20px / 26px / 500 treatment |
| `body` | `body` | General copy, introductions, and ordinary UI text |
| `meta` | `small` | Metadata, navigation, captions, and compact UI |

The resulting unique scale is 64 / 44 / 20 / 16 / 14px at its desktop maxima.
`display` keeps its 40px mobile minimum but caps at 64px instead of 72px;
`title` retains its existing fluid range. The 20px heading value is the
starting recommendation because it already works for cards and prose
subheadings; the style-guide gate must confirm that major sections remain clear
after dropping from 30px.

`reading` becomes a treatment layered on `body`, not a type size or a seventh
role: it supplies the approved 140% leading and reading colour. `.label`
remains a treatment built on `meta` (uppercase + 600), and mono remains a
family/treatment for code. Do not add `lead`, `statement`, `subheading`,
`button`, or `nav` roles until the site contains a repeated need that the five
core sizes cannot express.

### 2. Separate three layers

Organize `global.css` so each concern has one home:

1. **Font foundations** — font faces, fallback faces, family stacks, and
   approved weights.
2. **Type roles** — size, line-height, weight, and any approved optical
   tracking for `display/title/heading/body/meta`.
3. **Text treatments** — reading leading/colour, label casing, measure,
   tabular figures, and code family.

Components should select a role and, only when meaningful, a treatment. They
should not assemble font size, leading, tracking, and weight themselves.

### 3. Use a specimen as a design gate

Before migrating the site, expand `/style-guide` with real-content specimens
at 390, 768, 1024, and 1440px. Compare:

- the current general-body leading (160%) against a calmer 150% candidate;
- the existing zero tracking against small, font-specific optical adjustments;
- the reduced 40–64px display range and its homepage wrapping;
- the shared 20px heading across major sections, cards, and prose hierarchy;
- title/description pairs using size plus primary/secondary colour rather than
  extra weight;
- homepage display wrapping, long case-study titles, prose, card titles,
  metadata, buttons, navigation, and code.

Recommendation: retain zero tracking unless the TASA/Violet specimen shows a
clear improvement. Do not copy Cursor's tracking numbers; if tracking is
approved, it belongs inside role tokens only and never at a call site. Preserve
the already approved 140% `reading` leading regardless of the general-body
choice.

Anuj reviews this specimen before the migration step fixes any changed optical
values as conventions.

### 4. Keep responsive behavior explicit

Retain a 16px root at every breakpoint. Continue to use fluid roles where they
already work, then add an explicit role-level breakpoint only when a measured
wrapping problem requires it. Do not scale the whole typography or spacing
system through the root.

Responsive review should record, per role:

- minimum and maximum size;
- line-height and tracking;
- expected line count for representative real content;
- any breakpoint exception and the reason it exists.

### 5. Calibrate font loading

Create measured fallback faces for TASA Orbiter and Violet Sans using
`size-adjust`, ascent, descent, and line-gap overrides derived from the actual
font files and the chosen local fallback. Cursor's metric values must not be
copied.

Keep TASA preloaded because it is the reading face on every route. Make Violet
preloading conditional on layouts that render `display`, unless performance
measurement shows the conditional path adds more complexity than benefit.
Confirm that preload and `@font-face` resolve to one identical hashed asset and
that fallback-to-webfont swap does not materially change line breaks.

### 6. Migrate additively, then remove the old API

Introduce the role tokens beside the current names, migrate components and
prose rules, verify that no old class remains, then remove `h1/h2/h3/small`
aliases. This avoids Tailwind's dangerous failure mode where a removed or
mistyped class silently emits no CSS.

Update the checker so:

- only the approved role classes are allowed;
- the retired tag-shaped classes fail with a useful migration message;
- raw Tailwind sizes and arbitrary values remain banned;
- call-site weight, leading, and tracking remain banned;
- any approved tracking exists only in the token definitions;
- 400/500/600 remain the only approved TASA weights.

## Scope

In:

- Reducing six unique sizes to five by capping display at 64px and merging the
  current `h2` and `h3` steps into one `heading` role
- Role names and token organization for the simplified portfolio typography
- An explicit long-form `reading` treatment on `body` at 16px / 140%
- A style-guide specimen and responsive role documentation
- A visual decision gate for general-body leading and optical tracking
- Migration of existing pages, components, prose, navigation, buttons, tables,
  and metadata onto the approved roles
- Font fallback calibration and preload review
- Convention-checker and styling-convention updates
- Light/dark checks in the default and blue page palettes

Out:

- Replacing TASA Orbiter or Violet Sans
- Copying Cursor's font, exact scale, exact tracking, or 15px mobile root
- Adding new display-font steps or a second display face
- Adding unused `lead`, `statement`, `button`, or `nav` size tokens
- Content, spacing, grid, colour, or layout redesign
- Rewriting headings solely to alter visual size; semantic HTML stays governed
  by document structure
- Product-demo font heterogeneity beyond the existing mono treatment for code
- Figma-variable work; this plan is for the coded typography system

## Files To Modify

- `src/styles/global.css`: reorganize font foundations, add role tokens and
  fallback faces, migrate shared/component/prose typography, then remove old
  aliases
- `src/layouts/BaseLayout.astro`: make display-font preload conditional if the
  measured review supports it
- `src/pages/style-guide.astro`: add role, pairing, responsive, fallback, and
  long-form specimens
- `src/pages/index.astro`: migrate the homepage display call site
- `src/pages/about.astro`: migrate the page-title call site
- `src/pages/work/index.astro` and `src/pages/play/index.astro`: migrate title
  and body call sites
- `src/pages/work/[...slug].astro` and `src/pages/play/[...slug].astro`:
  migrate title, introduction, and reading contexts
- `src/components/SectionHeading.astro` and
  `src/components/ProjectCard.astro`: migrate heading roles
- `src/components/layout/Footer.astro`: migrate metadata/navigation roles
- `scripts/check-conventions.mjs`: enforce the new role API and retired names
- `agent-os/conventions/styling.md`: replace the old type contract with the
  approved role, responsive, tracking, fallback, and preload rules
- `agent-os/plans/cursor-inspired-typography-system.md`: record decisions and
  completion evidence

Other component files should change only if the call-site audit finds a real
hardcoded type declaration that cannot be centralized in `global.css`.

## Steps

- [x] Anuj reviews and approves the five-size scale and role vocabulary
- [x] Add the comparison specimen to `/style-guide` without changing public
  page typography
- [x] Review the specimen and decide general-body leading, tracking policy,
  and whether any current responsive clamp needs adjustment
- [x] Add final role tokens and measured fallback faces alongside the old API
- [x] Migrate semantic call sites and centralized component/prose CSS
- [x] Review TASA/Violet preload behavior and implement the simplest measured
  policy
- [x] Search for zero remaining `text-h1/h2/h3/small` call sites, then remove
  old aliases
- [x] Update the convention checker and styling convention
- [x] Run `corepack pnpm check` and `corepack pnpm build`
- [x] Browser-check 390 / 768 / 1024 / 1440px in default light/dark and blue
  light/dark, including long strings, fallback swap, 200% zoom, and overflow
- [x] Compare screenshots before/after and hand off for final visual approval
- [x] Mark the plan complete and record any reusable font-loading learning

## Review

- Design: does hierarchy feel quieter and clearer without losing the
  portfolio's TASA/Violet identity? Do titles, descriptions, body copy, and
  metadata separate through size/space/colour before weight?
- Content: do real project titles and prose wrap cleanly without editing copy
  to rescue the type system?
- Architecture: can a component choose a role without knowing its HTML tag,
  and can a font/leading change propagate without a local override?
- Accessibility: semantic heading order is unchanged; text remains legible at
  200% zoom and user-default font sizing; secondary text retains contrast.
- Performance: font swap has negligible layout shift; no duplicate font asset
  downloads; Violet is not eagerly fetched where it is unnecessary unless a
  measured reason justifies it.
- Verification: checker + production build + computed-style checks + visual
  screenshots across the four widths, two appearance modes, and two palettes.

## Learnings

The durable contract is captured in `agent-os/conventions/styling.md`; a
separate learning note is unnecessary. The implementation confirmed:

- fallback metrics must be derived per font. Against Arial's 1062/2048
  x-height, TASA uses 96.4218% size adjustment while Violet uses 92.5650%; one
  copied fallback face would not align both families;
- TASA remains the only universal preload. Built HTML contains Violet's preload
  on the homepage and style guide, and omits it from Work, Experiments, About,
  and detail routes;
- visual role names can replace HTML-tag names without changing semantic
  heading order. One 20px heading role now serves h2 and h3 call sites;
- computed checks, not the build alone, confirmed 64/44/20/16/14 roles,
  150% general body leading, 140% reading leading, and zero overflow at the
  tested responsive widths and theme combinations.

The system map and `AGENTS.md` did not need changes because the site's broader
architecture and cross-agent setup are unchanged.
