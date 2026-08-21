# Cursor-Inspired Spacing and Grid System

## Status

Complete

## Context

The portfolio has a good token foundation and a small set of Astro layout
primitives, but the visible system is not yet governed by one alignment model.
The page container is capped at 1024px, collection grids use `auto-fit`, the
homepage Play split uses component-local percentages, and case-study sidebars
use a separate fixed-width grid. `Stack`, `Cluster`, and `Grid` also reuse gap
labels that do not consistently resolve to the matching spacing token, making
the API harder to predict as the site grows.

The referenced Cursor teardown (`01a0254b-4e1f-7b62-96ef-a6413954e293`)
identified a useful structural model at a 1440px viewport:

- 1300px maximum content width with 70px outer margins.
- 20px page inset while the viewport is narrower than the cap.
- A 24-column master grid with a consistent 10px gutter.
- Reusable fractions such as 8/16, 12/12, 8/8/8, 6/6/6/6, and 24.
- Full-width stacking on mobile rather than independent narrow-screen layouts.

The goal is to borrow that clarity and compositional range, not reproduce
Cursor's marketing layout or its 17.5px card inset literally. The portfolio
must remain minimal, content-first, square-cornered, and visually its own.

## Desired Outcome

- Header, footer, homepage, indexes, case studies, experiments, embeds, and the
  style guide align to one 1300px page container and one 24-track grid.
- A layout can express full width, halves, thirds, quarters, and an 8/16 split
  through typed primitives rather than page-specific CSS or raw grid classes.
- Mobile defaults to a clear single-column reading order; tablet and desktop
  spans are explicit and content-driven.
- Spacing props mean the same thing everywhere: a named gap maps directly to
  the same named spacing token in `Stack`, `Cluster`, and other primitives.
- The 4px content-spacing scale remains intact. Two structural roles sit above
  it: a 20px page inset and a 10px grid gutter.
- Reading measure remains independent from page width, so widening the canvas
  never produces overlong paragraphs.
- Existing colour palettes, typography, content, interaction behavior, and
  media treatments remain intact unless a layout adaptation requires a narrow
  responsive adjustment.

## Approach

### 1. Separate content spacing from structural geometry

Keep the existing primitive content scale:

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128px`

Retain semantic roles for card padding, vertical section rhythm, and reading
stacks. Change the structural roles to:

- `--spacing-gutter: 1.25rem` (20px): page inset and safe-area floor.
- `--spacing-grid: 0.625rem` (10px): the single gutter between layout tracks.
- `--container-page: 81.25rem` (1300px): content width, excluding page inset.
- `--container-measure: 36rem` (576px): unchanged long-form reading measure.

The 10px grid gutter is intentionally a semantic structural value, not a new
ordinal step in the 4px content-spacing scale. Avoid Cursor's 17.5px inset;
card and component interiors continue to use the portfolio's readable 16px or
24px content tokens.

### 2. Make primitive APIs literal and predictable

- `Container` remains the only page-width primitive and still has no size
  prop. Its CSS produces a 1300px content box plus the safe page inset.
- `Stack` and `Cluster` accept the actual spacing-token names they use
  (`2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`) instead of remapping `sm` to
  8px or `md` to 16px behind the caller's back.
- `Section` keeps semantic variants (`page`, `compact`, `standard`, `large`,
  `hero`) because vertical page rhythm is a role, not a claim that `large`
  equals one raw spacing step.
- Replace the current auto-fit `Grid` min-width API with a 24-track master
  grid whose gutter is always `--spacing-grid`.
- Add a typed `GridItem` primitive. It owns constrained responsive spans
  (`6`, `8`, `12`, `16`, `18`, `24`) and optional starts; pages never write
  raw `grid-column` declarations or Tailwind span classes.
- Every grid child receives `min-width: 0` so code, tables, and media cannot
  force a track wider than the page.

### 3. Use one responsive span model

Treat these as starting hypotheses and confirm the exact breakpoints against
real content before freezing them:

| View | Default composition |
| --- | --- |
| Phone | 24-column item spans; major regions stack full width |
| Tablet | 12/12 collections where cards retain a useful minimum width |
| Desktop | 8/16 features, 12/12 pairs, 8/8/8 collections, 6×4 compact grids |

Cursor collapses its feature split at roughly 1024px. Use 64rem as the first
test boundary, then move it only if the portfolio's actual headline, cards,
preview list, or reading measure requires a different point. Breakpoints must
be documented with the measured failure they prevent.

### 4. Migrate by route family, not with a global visual jump

Build and document the token/primitives layer first, then migrate the shell,
homepage, indexes, and detail templates in sequence. Each route family should
be checked at 390px, a measured tablet width, 1024px, and 1440px before the
next family moves.

Proposed desktop compositions:

| Surface | Grid composition |
| --- | --- |
| Header / footer | 24 columns inside the shared container; internal content aligns to track edges |
| Homepage hero | Copy 8 / shader 16; stack 24/24 below the measured split breakpoint |
| Featured projects | Two 12-column cards per row |
| Homepage experiments | List 16 / preview 8, replacing the local 70/30 flex split |
| Work / Experiments indexes | Three 8-column cards; two 12-column cards on tablet; full-width on phone |
| Case-study header | Intro and metadata placed on explicit spans without widening body copy |
| Case-study body | On-this-page rail 4 / content 20; collapse to full-width content |
| Hero media and embeds | Full 24 columns |
| About | Reading content anchored to grid tracks while retaining `max-w-measure` |

These mappings are structural defaults, not permission to invent new content,
change copy, or force empty columns where the current page works better.

### 5. Make the system visible and enforceable

- Expand `/style-guide` with a live 24-column specimen showing 8/16, 12/12,
  thirds, quarters, and full-width stacking.
- Document the distinction between content spacing, page inset, grid gutter,
  page width, and reading measure.
- Update the convention checker so public pages cannot regress to raw grid
  columns, inline layout declarations, or mismatched gap names after migration.
- Update the durable styling convention and system map when implementation is
  complete.

## Scope

In:

- Refactor spacing roles and primitive gap APIs for consistent token mapping.
- Increase the shared content container from 1024px to 1300px.
- Adopt a 20px safe page inset and 10px structural grid gutter.
- Replace auto-fit page grids with a typed 24-column `Grid` / `GridItem`
  system and explicit responsive spans.
- Migrate every public route, the header/footer, homepage components, Work and
  Experiments indexes, both detail templates, the About page, embeds, and the
  style guide to the new alignment model.
- Rework `PlayPreviewList` and `Sidebar` internals to use the same grid math.
- Preserve the independent 576px reading measure.
- Add grid documentation, regression checks, and responsive visual QA.

Out:

- Copy, information architecture, project ordering, or content-schema changes.
- Colour, page-palette, typography, corner, border, or interaction redesigns.
- Reproducing Cursor's branding, product-demo layouts, 17.5px inset, rounded
  controls, motion system, or marketing narrative.
- Adding a CSS framework, grid library, JavaScript layout engine, or runtime
  viewport logic.
- Making the 24-column guides visible on the public site outside an explicit
  style-guide/debug specimen.
- Publishing, merging, or deploying before the full route matrix passes.

## Files To Modify

- `src/styles/global.css`: container, structural spacing, grid, responsive
  span, section, sidebar, Play preview, and layout-primitive CSS.
- `src/components/primitives/Container.astro`: update the container contract.
- `src/components/primitives/Grid.astro`: replace the auto-fit/min-width API
  with the 24-track structural grid.
- `src/components/primitives/GridItem.astro`: add typed responsive spans and
  starts.
- `src/components/primitives/Stack.astro`: make gap names map literally.
- `src/components/primitives/Cluster.astro`: make gap names map literally.
- `src/components/primitives/Section.astro`: clarify semantic section roles.
- `src/components/primitives/Sidebar.astro`: express the rail through shared
  grid spans or retire it if `GridItem` fully replaces it.
- `src/components/layout/Header.astro`: align site furniture to the master
  grid.
- `src/components/layout/Footer.astro`: align footer groups to the master
  grid and retain wrapping behavior.
- `src/components/PlayPreviewList.astro`: replace its percentage split with
  explicit 16/8 grid regions.
- `src/components/EmbedFrame.astro`: adopt the new full-span/container geometry
  and remeasure its container-query thresholds.
- `src/pages/index.astro`: migrate hero, featured projects, experiments, and
  contact sections.
- `src/pages/work/index.astro`: migrate the project collection grid.
- `src/pages/play/index.astro`: migrate the experiment collection grid.
- `src/pages/work/[...slug].astro`: migrate header, media, rail, and prose.
- `src/pages/play/[...slug].astro`: keep the shared detail composition aligned.
- `src/pages/about.astro`: anchor reading content to grid tracks.
- `src/pages/style-guide.astro`: document and demonstrate the new system.
- `scripts/check-conventions.mjs`: enforce the new public-page layout rules.
- `agent-os/conventions/styling.md`: replace the 1024px/auto-fit conventions.
- `agent-os/system-map.md`: update the layout-primitives subsystem contract.
- `agent-os/plans/cursor-inspired-spacing-grid.md`: record decisions, review,
  and verification results.

## Steps

- [x] Capture baseline geometry and screenshots for `/`, `/about`, `/work`,
      `/play`, one default project, one blue-palette project, one experiment,
      and `/style-guide` at 390px, tablet, 1024px, and 1440px.
- [x] Inventory current spacing-token usage and choose each call site's
      literal replacement before changing the primitive gap mappings.
- [x] Add the 1300px container, 20px inset, and 10px grid-gutter foundation.
- [x] Implement and type the 24-track `Grid` and responsive `GridItem` spans.
- [x] Normalize `Stack`, `Cluster`, and `Section` APIs without accidental
      spacing changes.
- [x] Add the grid specimen to `/style-guide` and verify track arithmetic at
      1440px before migrating content.
- [x] Migrate header/footer and verify shared outer edges and wrapping.
- [x] Migrate the homepage hero, featured cards, Play preview, and contact.
- [x] Migrate Work and Experiments indexes.
- [x] Migrate both detail templates, sidebar rail, media, and embeds; remeasure
      sticky and container-query breakpoints.
- [x] Migrate About and the remaining style-guide layout utilities.
- [x] Remove the old auto-fit grid CSS, obsolete min-width variants,
      percentage splits, and superseded breakpoint comments.
- [x] Extend convention checks and prove each new rule fails on a deliberate
      violation before removing that violation.
- [x] Run `git diff --check`, the convention checker, and a production build.
- [x] Visually verify every route family in light/dark, default/blue palettes,
      mobile/tablet/desktop, reduced motion, keyboard focus, and RTL; confirm
      zero horizontal overflow.
- [x] Record final measurements and update conventions/system-map; decide
      whether a reusable grid learning note is warranted.

## Review

- Baseline: at 1440px the old container measured 1024px including 24px side
  padding (976px of content). The case-study body was a separate
  192px / 48px / 736px composition.
- Final desktop geometry: at 1440px `Container` measures 1340px from x=50,
  with 20px padding and exactly 1300px of content from x=70. The 24 tracks
  measure about 44.58px with 10px gutters; verified fractions are 427/863px
  (8/16), 645/645px (halves), 427px thirds, and 318px quarters.
- Responsive geometry: at 390px the content box is 350px and every major item
  is full-width. Work cards measure 359px two-up at 768px, 423px two-up at
  896px, and 427px three-up at 1440px. The case-study rail/content split
  measures 208/1082px at 1440px, 156/818px at 1024px, and 134/712px at
  896px; it collapses at 895px.
- Embeds: the phone-capable experiment remains edge-to-edge at 390px with no
  document overflow, measures 728px at 768px, and aligns to the 1300px content
  box at 1440px. Its existing measured container-query height modes remain
  1024px when narrow and 768px when wide.
- Visual and interaction QA: light/dark default pages and the blue case-study
  palette were checked at phone and desktop sizes. Keyboard focus retains the
  2px tokenized outline; reduced-motion branches remain intact. A 36-case
  route/viewport matrix (nine route families × four widths) and an eight-case
  RTL matrix both returned zero horizontal-overflow failures.
- Enforcement: three new convention rules reject raw public-page columns, the
  retired auto-fit Grid API, and unsupported Stack/Cluster gaps. Each was
  proved against a temporary deliberate violation before the violation was
  removed.

## Learnings

The reusable results are captured in `agent-os/conventions/styling.md` and
`agent-os/system-map.md`. No separate learning note is needed: the literal gap
contract, 24-track fractions, measured breakpoints, and `min-width: 0` guard
are all durable primitive rules rather than one-off migration discoveries.
