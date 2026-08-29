# Top Navigation Exploration

## Status

Complete

## Design Question

Which top-navigation structure gives Anuj's portfolio the clearest, most
distinctive sense of identity while keeping the work—not the chrome—as the
main event?

## Why It Matters

The current navigation is clear and technically sound, but it has not yet
been tested against other high-quality portfolio patterns. This exploration
will compare five structurally different directions using the same real
content, design system, viewport conditions, and interaction requirements.

## Research Basis

Primary live references reviewed on 2026-08-29:

- [Apple](https://www.apple.com/): compact translucent material and disciplined
  utility placement, without borrowing its product-link density.
- [Linear](https://linear.app/): muted hierarchy, fixed rail, and restrained
  intent-revealed interaction, without its SaaS CTA cluster.
- [Vercel](https://vercel.com/): a transparent-at-top header that gains a
  quiet surface boundary on scroll.
- [Pentagram](https://www.pentagram.com/) and
  [AREA 17](https://area17.com/): literal portfolio routes, visible identity,
  and almost no decorative shell.
- [Klim Type Foundry](https://klim.co.nz/): an identity-first 48px rail and a
  memorable full-width menu reveal.
- [DIA](https://www.dia.studio/),
  [Base Design](https://www.basedesign.com/),
  [Instrument](https://www.instrument.com/), and
  [Mother Design](https://www.motherdesign.com/): crisp grid zones, explicit
  modes, and navigation used as information architecture rather than ornament.
- [Studio Feixen](https://www.studiofeixen.ch/) and
  [Framer](https://www.framer.com/): useful evidence for signature controls
  and grouped navigation, with their icon ambiguity and product/CTA density
  deliberately excluded.

Accessibility and platform guidance:

- [WAI disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/):
  ordinary site navigation remains semantic links inside a labelled `nav`,
  not an application-style ARIA menu.
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum):
  the site will retain its stronger 48px hit-area contract.
- [WCAG focus order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html):
  DOM, reading, and keyboard order must remain coherent in every layout.
- [MDN Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using):
  the index direction can use native focus-order integration, Escape, light
  dismiss, and implicit expanded-state semantics without a library.

## Shared Constraints

- Real content: Anuj Prajapati; About, Work, and Experiments; the existing
  theme control; real homepage hero and featured portfolio content below.
- Existing design tokens and primitives: KMR Apparat, four type roles, neutral
  light/dark palettes, 24-track grid, 1300px container, square structural
  geometry, token spacing, and existing motion roles only.
- Required information or actions: home, all three routes, current-page state,
  and appearance toggle. No new CTA, social link, or promotional copy.
- Accessibility requirements: labelled navigation landmark, semantic links,
  `aria-current="page"`, visible non-colour active cue, visible focus,
  logical tab order, 48px hit areas, and accessible disclosure behavior where
  used.
- Responsive contexts: 320, 768, 1024, and 1440px; no horizontal overflow or
  overlapping hit targets. Breakpoints follow measured content failure.
- Appearance and motion modes: light and dark, reduced transparency, increased
  contrast, and reduced motion.
- Fair comparison: content, type, colours, and surrounding page remain fixed;
  only navigation structure, active cue, and one deliberate interaction may
  change.

## Design Calibration

- Colour: use only the existing semantic palette. The shared canvas resolves
  to neutral 150 (`#eef0f2`) in light mode and neutral 800 (`#141619`) in dark
  mode; elevated material, text, borders, and sage accent continue to come
  from their existing semantic roles. No variant introduces a colour.
- Type: KMR Apparat Medium at the existing 14px body role for navigation and
  utility copy, with the system's intentional zero tracking. The index sheet
  may use the existing title/display role for hierarchy, never an ad-hoc size.
- Geometry: every direction shares the 1300px page container, 20px safe inset,
  24-track alignment logic, 48px minimum hit areas, and square structural
  edges.
- Material: translucent surfaces may use the established background, border,
  and blur vocabulary. Increased contrast removes translucency; reduced
  transparency resolves to a solid semantic surface.
- Signature: each option gets exactly one defining structural idea. Everything
  else stays deliberately quiet so the comparison is about navigation rather
  than decoration.

```text
A  [ANUJ PRAJAPATI]                     [ABOUT  WORK  EXPERIMENTS  THEME]

B  [ANUJ PRAJAPATI]       [ABOUT  WORK  EXPERIMENTS]              [THEME]

C  [ANUJ PRAJAPATI / WORK]                               [THEME] [INDEX]
   +--------------------------------------------------------------+
   | ABOUT                 WORK                 EXPERIMENTS        |
   +--------------------------------------------------------------+

D  | ANUJ PRAJAPATI |        ABOUT | WORK | EXPERIMENTS | THEME |

E  [ANUJ PRAJAPATI]      [ ABOUT | WORK | EXPERIMENTS ]           [THEME]
```

Self-critique before build: A risks being too familiar, B risks brittle optical
centering, C trades immediate route visibility for character, D risks making
the chrome louder than the work, and E risks resembling a generic product
dock. The implementation should expose those trade-offs instead of styling
around them.

## Directions

| Direction | Idea being tested | Expected strength | Possible weakness |
| --- | --- | --- | --- |
| A — Editorial split | A quiet 56–60px sticky rail: identity left; literal routes and theme right; a hairline appears only after scroll. Inspired by Pentagram, AREA 17, and Vercel. | Most timeless and content-first; closest to a refined portfolio standard. | May feel like an improvement rather than a distinct new signature. |
| B — Centered axis | Identity left, routes optically centered to the viewport, theme right. The route group becomes the stable visual anchor. Inspired by Apple and Framer. | Extremely balanced and calm when alignment is exact. | Future labels can challenge true centering; needs a deliberate collapse point. |
| C — Compact identity rail | A 48px identity/current-section rail with theme and an explicit Index trigger; the trigger opens a full-width oversized route sheet. Inspired by Klim and Pentagram. | Most ownable and editorial while keeping persistent chrome minimal. | Hides primary routes one interaction deep and adds disclosure behavior. |
| D — Modular grid bar | Identity, three routes, and theme occupy crisp grid zones with structural seams and a clear active cell. Inspired by DIA, Base, Instrument, and Mother. | Strongest wayfinding and strongest relationship to the portfolio grid. | Visually louder and potentially too system-like for quiet content. |
| E — Quiet floating dock | Page-aligned identity and theme stay independent while a compact square-edged route dock floats near the top center. Inspired by Linear, distilled through Apple restraint. | Most contemporary and spatially distinctive. | Highest risk of feeling generic or competing with the work if over-styled. |

## Comparison Surface

- Starting point: clean `main` at `ca7c8c7`.
- Branch: `codex/top-nav-exploration`.
- Temporary route: `/lab/top-nav?variant=A` through `E`.
- Temporary components: `src/components/lab/top-nav/`.
- Temporary styling: one scoped lab stylesheet beside the variants.
- Layout host: `BaseLayout`, not `PageLayout`, so the approved production
  `Header.astro` is neither edited nor rendered twice.
- Switcher: a clearly separate bottom control with Previous/Next buttons,
  shareable query state, and Left/Right Arrow support outside editable fields.

## Evaluation Criteria

- Information hierarchy: identity, routes, current location, then utility.
- Fit with the portfolio: clean, disciplined, minimal, and specific to a brand
  and growth designer rather than copied from a SaaS product.
- Real-content resilience: the same labels, theme control, hero, and featured
  content in every direction.
- Mobile and desktop behavior: deliberate layouts at all four review widths,
  not an accidental wrapped desktop bar.
- Light and dark appearance: semantic tokens only, with legible sticky states.
- Interaction and keyboard behavior: hover, press, focus, active state,
  disclosure operation, and no hidden interactive elements in the tab order.
- Motion: one purposeful transition at most; reduced motion removes travel.
- Complexity: no dependency, no new global token, and a clear path to rewrite
  only the selected direction for production.

## Scope

In:

- Build five navigation directions on one isolated lab route.
- Use the approved real navigation labels, appearance control, and portfolio
  page context for every direction.
- Add a development-only variant switcher using `?variant=A–E`.
- Compare narrow/wide, light/dark, focus/hover/press, sticky scroll, and
  preference fallbacks.
- Record the review and selected direction before any production work.

Out:

- Editing `src/components/layout/Header.astro`, `src/data/site-config.ts`, or
  production header CSS during exploration.
- Adding navigation destinations, CTAs, fonts, colours, tokens, or packages.
- Redesigning the homepage content beneath the navigation.
- Publishing the `/lab/` route or merging rejected variants into `main`.
- Choosing a winner without Anuj's review.

## Files To Modify

- `agent-os/plans/top-nav-exploration.md`: research, scope, comparison, and
  eventual decision record.
- `src/pages/lab/top-nav.astro`: temporary comparison route with real context.
- `src/components/lab/top-nav/`: five isolated directions and shared lab-only
  switcher/link helpers.
- `src/components/lab/top-nav/top-nav-lab.css`: scoped prototype styling using
  existing semantic tokens.

## Steps

- [x] Create the isolated exploration branch from clean `main`.
- [x] Audit the production header and design-system constraints.
- [x] Review live primary references and accessibility guidance.
- [x] Approve this scope and the five design questions.
- [x] Build all five directions on the shared comparison surface.
- [x] Review mobile, desktop, light, dark, sticky, focus, and motion states.
- [x] Save the ready-to-review exploration on this branch.
- [x] Record Anuj's selection and reasoning.
- [x] Rewrite only the selected direction for production and remove the lab.

## Review Notes

### A — Editorial split

- Works well: the identity/content alignment is immediate, the routes remain
  visible, and the scroll-only hairline gives the quiet material a useful edge.
- Concerns: it is the safest and most familiar direction; on mobile it becomes
  an intentional two-row rail rather than retaining a distinctive desktop move.

### B — Centered axis

- Works well: the route group is genuinely centered to the viewport at wide
  sizes, which makes the composition feel unusually calm and balanced.
- Concerns: it deliberately converges with A's two-row structure on narrow
  screens, and substantially longer future route labels could threaten the
  center zone.

### C — Compact identity rail

- Works well: the 48px persistent rail is the quietest chrome, while the native
  index sheet is the most ownable interaction and works cleanly at 320px.
- Concerns: the primary destinations move one interaction deep; that trade-off
  should be accepted deliberately rather than treated as a purely visual win.

### D — Modular grid bar

- Works well: structural seams and the filled active cell make location
  unmistakable, and the routes divide evenly on mobile without overflow.
- Concerns: it is the loudest option and may make the navigation feel like a
  product system rather than quiet portfolio furniture.

### E — Quiet floating dock

- Works well: the three independent surfaces feel current, light, and spatially
  distinctive; the dock remains on a second row until 768px so hit areas never
  crowd one another.
- Concerns: page content remains visible in the gaps while sticky, which is
  integral to the floating idea but can compete with dense rows beneath it.

Review surface: 320, 608, 768, 1024, 1280, and 1440px; light and dark modes;
top and sticky positions; visible focus; the C disclosure open/close flow; and
query-based switching. No browser errors or horizontal overflow were observed.

An independent code-quality pass caught and resolved four pre-review issues:
mobile target overlap, visual/focus-order mismatch, the no-JavaScript fallback,
and safe-area coverage in D. A second pass confirmed all four fixes. The lab
route and switcher assets remain branch-only by design and must be removed when
the selected direction is rewritten for production.

## Decision

- Selected direction: A — Editorial split.
- Why it was selected: Anuj chose the most direct, content-first option after
  reviewing all five in real page context.
- Useful ideas retained from other directions: the comparison pass's explicit
  mobile focus-order and hit-target discipline.
- Ideas deliberately rejected: centered-axis, index-sheet, modular-grid, and
  floating-dock structures. None remain in production code.

## Cleanup Before Pull Request

- [x] Selected direction rewritten in the production component.
- [x] Rejected variants removed.
- [x] Temporary `/lab/` route removed.
- [x] Temporary lab components, styles, assets, and imports removed.
- [x] Header height and anchor offsets updated for the selected structure.
- [x] No unrelated changes included.
- [x] Responsive and appearance behavior carried over from the validated A
  prototype.
- [x] `pnpm check` passes.
- [x] `pnpm build` passes.

## Learnings

The comparison route was valuable for choosing structure, but production
integration should not repeat its full viewport matrix when the selected
prototype is being transferred without visual changes. Future visual loops
should use one focused smoke check plus the existing build/convention gates,
and reserve the exhaustive matrix for risky or unvalidated behavior.
