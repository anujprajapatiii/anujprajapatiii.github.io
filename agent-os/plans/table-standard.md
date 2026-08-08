# Table Standard

## Status

Complete

## Context

Every tabular thing on the site was built ad hoc, and none of them were
tables. The homepage Play list is a stack of `<a>` rows with the role and
year mashed into one string. The case-study Role/Year/Skills block is a `<dl>`
laid out with a Cluster. The hero box is two bordered `<div>`s. Markdown
tables in a case study had no styling at all — a real table in prose would
have rendered as unstyled browser default.

So there is no answer to "what does a table look like here", and every new
one would invent a fourth thing.

## Desired Outcome

One table treatment, used everywhere, that reads as an actual table: real
`<table>` markup with header cells and ruled cells. A markdown table written
in a future case study picks it up with no extra work.

## Approach

Anuj's decisions (asked before building):

1. **Full grid.** Every cell ruled — outer border plus vertical and
   horizontal lines. The Berkeley Mono spec-table look, cited as the
   reference; the ruling is what separates a table from an aligned list.
2. **Hero box: restyle only.** Keep its two rows exactly as they are and
   apply the table's rules, padding and type. No headings invented for it.
3. **Case study: make it a table.** Role/Year/Skills becomes a real table
   with header cells.

One CSS block serves both component tables (`.data-table`, via a
`DataTable.astro` wrapper that carries the horizontal-scroll container) and
markdown tables (`.prose table`), so the two can never drift.

Header cells repeat `.label`'s declarations rather than requiring
`class="label"`, because markdown-generated `<th>` cannot carry a class.

## Scope

In:

- The table treatment in `global.css`, covering component and prose tables
- Homepage Play list → table (Title / Role / Year)
- Case-study and Play metadata (`<dl>`) → table
- Hero box restyled to match, markup unchanged
- Style guide section, conventions rule, `pnpm check` guard

Out:

- The `/work` and `/play` card grids. Cards are not tables and were not asked
  about; converting them is a separate design decision.
- Any new content. The Play table's columns come from fields that already
  exist in the schema.

## Files To Modify

- `src/styles/global.css`: the table treatment; `.info-box` aligned to it
- `src/components/DataTable.astro`: new — table + scroll wrapper
- `src/pages/index.astro`: Play list becomes a table
- `src/pages/work/[...slug].astro`, `src/pages/play/[...slug].astro`: metadata table
- `src/pages/style-guide.astro`: document the standard
- `src/content/projects/sample-case-study.md`: show the markdown table form
- `agent-os/conventions/styling.md`: the rule
- `scripts/check-conventions.mjs`: guard against a bare `<table>`

## Steps

- [x] Table treatment in `global.css` (component + prose)
- [x] `DataTable.astro`
- [x] Apply to Play list, case-study metadata, hero box
- [x] Style guide + conventions + checker rule
- [x] Verify in both themes, at narrow widths, and with a wide table

## Review

- Design: full grid, square corners, `.label` header cells, scale padding
- Content: no new copy; Play columns come from existing frontmatter
- Architecture: one rule set for component and markdown tables
- Verification: rendered in both themes; wide table scrolls in its own
  container without the page scrolling sideways

## Learnings

A markdown table can be its own scroll container, but `display: block` alone
is a trap. It splits the element in two: the block box takes the border and
stretches to the container, while the cells form an anonymous table box that
shrink-wraps. The first build drew the outer rule out to the full column
width with empty space between it and the last column — caught in a
screenshot, not by the build. `width: max-content; max-width: 100%` sizes the
block to its cells and still caps it for scrolling.

Recorded as a rule in `agent-os/conventions/styling.md` rather than a
separate learning note, since it is a standing constraint on every table
rather than a one-off finding.
