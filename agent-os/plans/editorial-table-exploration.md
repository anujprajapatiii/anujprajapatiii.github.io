# Editorial Table Exploration

## Status

Complete — Quiet ledger promoted

## Design Question

Which table structure best extends the portfolio's disciplined visual system:
an editorial split directory, a quiet comparison ledger, or a compact facts
rail?

## Why It Matters

The current full-grid table is clear and robust, but it gives every table the
same dense specification character. This exploration tests whether selective
ruling, asymmetric space, and content-led hierarchy can make different kinds
of tabular information feel more authored without weakening semantics or
scanability.

## Shared Constraints

- Real content: the same published portfolio projects wherever the direction
  allows a fair comparison.
- Existing design tokens and primitives: KMR Apparat, the 24-track grid,
  semantic colour roles, the spacing scale, and square structural geometry.
- Required information or actions: project title, role/type, year, and an
  explicit link where the pattern is navigational.
- Accessibility requirements: native table markup for comparable data,
  scoped row and column headers, labelled overflow regions, visible keyboard
  focus, and useful link text.
- Responsive contexts: narrow phone, tablet, desktop, and wide desktop.
- Appearance and motion modes: light and dark appearances; no new motion.

## Directions

| Direction | Idea being tested | Expected strength | Possible weakness |
| --- | --- | --- | --- |
| A — Split directory | A spacious group label beside a horizontally ruled navigational table | Closest to the reference; strongest editorial composition | Needs careful collapse when the side label no longer fits |
| B — Quiet ledger | A conventional comparison table with only horizontal rules | Calmer than a full grid while preserving familiar scanning | Related values may need stronger column anchors in wide layouts |
| C — Facts rail | Project metadata as compact row-header/value pairs | Excellent wrapping and phone behaviour | Less efficient when many records must be compared |

The existing full-grid `DataTable` is shown as an unchanged control.

## Comparison Surface

- Worktree starting point: clean `main`
- Branch: `codex/bettertables`
- Temporary route: `/lab/tables`
- Temporary components: `src/components/lab/tables/`

## Evaluation Criteria

- Information hierarchy: the primary label, values, metadata, and actions are
  distinguishable at a glance.
- Fit with the portfolio's visual direction: restrained, content-first, and
  recognisably part of the current system rather than a copy of the reference.
- Real-content resilience: long titles, roles, skills, and missing values wrap
  without breaking the structure.
- Mobile and desktop behaviour: macro layout stacks when needed while genuine
  table relationships remain understandable.
- Light and dark appearance: rules, text hierarchy, focus, and hover remain
  legible in both.
- Interaction and keyboard behaviour: linked rows expose an explicit action
  and `:focus-within` feedback.
- Motion and reduced-motion behaviour: no motion is introduced.
- Complexity introduced: all experimental code stays isolated from production
  components and shared Markdown styling.

## Scope

In:

- Build the three named directions in a clean exploration worktree.
- Show the unchanged production table as a control.
- Use current published project content and shared design tokens.
- Review phone and desktop layouts in light and dark appearance.
- Run convention checks, the production build, and the layout detector.
- Record evidence and observations for Anuj's selection.

Out:

- Changing `DataTable.astro`, shared table CSS, Markdown tables, or live pages.
- Choosing or promoting a winner before Anuj reviews the comparison.
- Publishing or merging the temporary lab route.
- Mixing the active light-and-shade experiment into this branch.

## Promotion Scope

Authorized after review and selection:

- Replace the shared full-grid component and Markdown table treatment with
  Quiet ledger's selective horizontal rules.
- Preserve native table markup and existing content while distinguishing
  column headers, row headers, and values through semantic roles.
- Make component-table overflow conditionally keyboard focusable and allow
  explicit row-header columns to remain pinned whenever their table overflows.
- Update the public style-guide specimen and durable styling convention.
- Remove the temporary lab route and rejected lab-only components after the
  shared treatment is verified.

Still out:

- Adding Split directory or Facts rail as production variants.
- Changing project facts, case-study prose, or table data.
- Adding new tokens or dependencies for the table treatment.

## Files To Modify

- `agent-os/plans/editorial-table-exploration.md`: frame, decide, and record the
  comparison and production promotion.
- `src/components/DataTable.astro`: conditional keyboard overflow and optional
  pinned row-header column.
- `src/styles/global.css`: shared component and Markdown Quiet ledger rules.
- `src/pages/style-guide.astro`: production specimen and row-header semantics.
- `agent-os/conventions/styling.md`: durable Quiet ledger convention.
- `agent-os/plans/table-standard.md`: mark the original full-grid plan as
  superseded decision history.
- Temporary `/lab/tables` files: removed after selection.

## Steps

- [x] Frame the design question, shared constraints, and scope.
- [x] Build the comparison page and all three directions.
- [x] Run checks and build.
- [x] Review desktop/mobile and light/dark screenshots in one bounded pass.
- [x] Fix the observed issues in one batch and confirm once.
- [x] Record review notes and leave the selection open.
- [x] Record Anuj's Quiet ledger selection.
- [x] Promote the selected treatment to component and Markdown tables.
- [x] Remove the temporary lab route and rejected variants.
- [x] Verify real style-guide and case-study tables after promotion.

## Review Notes

### Direction A — Split directory

- Works well: The 8/16 composition translates the reference into the existing
  grid without one-off page arithmetic. Selective rules, muted role text, and
  explicit actions create the strongest editorial hierarchy. Hover,
  `:focus-within`, and keyboard-scroll focus remain clear in both appearances.
- Concerns: On a phone the role and action columns intentionally move offscreen.
  The specimen therefore includes a visible scroll instruction and makes the
  overflow region arrow-key scrollable only while it actually overflows.

### Direction B — Quiet ledger

- Works well: It remains immediately recognisable as a comparison table while
  losing the boxed spreadsheet texture. Row headers, a stronger header rule,
  tabular right-aligned years, and quiet body rules scan cleanly.
- Concerns: It is the least distinctive direction, and four comparable columns
  still require horizontal scrolling on a phone.

### Direction C — Facts rail

- Works well: The vertical row-header/value structure gives metadata the best
  wrapping behaviour and needs no phone-specific overflow. It fits project
  detail pages naturally and preserves a calm 8/16 composition.
- Concerns: It is designed for one record; using it for several projects would
  make cross-record comparison slower than either of the other directions.

### Verification

- `pnpm check`: passes all design-system rules and structural audits.
- `pnpm build`: passes; `/lab/tables` is generated successfully.
- Impeccable layout detector: no findings for the lab route or components.
- Browser review: light and dark at 1440px and 390px; desktop hover, mobile
  overflow, focus ring, arrow-key scrolling, and anchor offsets confirmed.
- Production pass: public style-guide and case-study tables use outer block
  rules, a stronger column-header rule, quiet row separators, and no vertical
  cell walls. Explicit row-header columns remain pinned whenever their table
  overflows, including a 73px overflow at 768px, and return to normal flow
  when no overflow exists. Component and Markdown tables have no page-level
  overflow at 320px, 390px, 768px, 1024px, or 1440px. Light and dark
  appearances, keyboard paging, focus, the clean development console, the
  production build, convention checks, and the mechanical detector pass.

## Decision

- Selected direction: Quiet ledger.
- Why it was selected: It is the strongest shared table foundation. It keeps
  familiar comparison behaviour and native semantics while replacing the
  boxed spreadsheet texture with a calmer hierarchy of horizontal rules.
- Useful ideas retained from other directions: Facts rail remains the better
  specialist for single-project metadata. Split directory remains a useful
  reference for future curated indexes. The selected ledger pins its project
  column while horizontally scrolling on phones, preserving row identity.
- Ideas deliberately rejected: Full cell borders as the default portfolio
  treatment; Split directory as a universal comparison table; Facts rail for
  cross-project comparison.

## Cleanup Before Pull Request

- [x] Selected direction moved into the production component.
- [x] Rejected variants removed.
- [x] Temporary `/lab/` route removed.
- [x] Temporary lab components, styles, assets, and imports removed.
- [x] No unrelated tracked changes included.
- [x] Responsive and appearance states reviewed again after cleanup.
- [x] `pnpm check` passes.
- [x] `pnpm build` passes.

## Learnings

Quiet ledger provides the best balance of scanability, semantic familiarity,
and portfolio restraint for shared comparison tables. The other two directions
solve narrower information jobs and should not be forced into a universal
variant. The durable table convention now records the selected rule hierarchy,
row-header treatment, conditional keyboard overflow, and pinned-column guard.
