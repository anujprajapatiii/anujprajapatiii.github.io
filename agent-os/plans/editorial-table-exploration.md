# Editorial Table Exploration

## Status

In progress

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

## Files To Modify

- `agent-os/plans/editorial-table-exploration.md`: frame and record the comparison.
- `src/pages/lab/tables.astro`: temporary comparison route and shared page context.
- `src/components/lab/tables/EditorialDirectory.astro`: split directory direction.
- `src/components/lab/tables/QuietLedger.astro`: horizontal-rule ledger direction.
- `src/components/lab/tables/FactsRail.astro`: row-header/value direction.
- `src/components/lab/tables/table-lab.css`: isolated visual and responsive rules.

## Steps

- [x] Frame the design question, shared constraints, and scope.
- [x] Build the comparison page and all three directions.
- [x] Run checks and build.
- [x] Review desktop/mobile and light/dark screenshots in one bounded pass.
- [x] Fix the observed issues in one batch and confirm once.
- [x] Record review notes and leave the selection open.

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

## Decision

- Selected direction: Pending Anuj's review.
- Why it was selected:
- Useful ideas retained from other directions:
- Ideas deliberately rejected:

## Cleanup Before Pull Request

- [ ] Selected direction moved into the production component.
- [ ] Rejected variants removed.
- [ ] Temporary `/lab/` route removed.
- [ ] Temporary lab components, styles, assets, and imports removed.
- [ ] No unrelated changes included.
- [ ] Responsive and appearance states reviewed again after cleanup.
- [ ] `pnpm check` passes.
- [ ] `pnpm build` passes.

## Learnings

Pending review. No durable convention changes are made during exploration.
