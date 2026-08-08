# Styling Conventions

> STATUS: Active. Colour, type and layout systems are all in code and
> `src/styles/global.css` is the source of truth.

## Visual Direction

Clean, disciplined, structured — the reference points Anuj named are Apple
and Klim Type Foundry.

What that means in practice:

- **Restraint over decoration.** No eyebrows, kickers, or ornamental labels.
  If a piece of text is a section heading, make it a heading; don't dress it
  up as a 12px uppercase whisper.
- **One font, two weights.** Söhne Buch and Halbfett. Hierarchy comes from
  size, space and colour before it comes from weight, and weight is only
  reached for when sizes get close enough that size alone can't separate them.
- **Big type is set light.** Display and h1 in Buch 400 — this is the Klim
  habit and it is why the hero reads as composed rather than shouted.
- **Tracking is zero, everywhere.** One value for every size, in both
  directions. Söhne is drawn to be spaced correctly at each size; the system
  trusts it rather than second-guessing it per step.
- **Text colour is a hierarchy of prominence, never of hue.** All neutral,
  after Apple's label model: primary label and secondary label, and nothing
  else. Apple's tertiary/quaternary levels are for watermarks and disabled
  states — every piece of text here is meant to be read, so there is no
  third level.
- **Corners are square, everywhere.** No radius on cards, images, buttons,
  embeds or code blocks. The edge is the edge; a border and the space around
  it do the containing, and nothing is softened to look friendlier.
- **Space does the grouping.** Rules and separators are a last resort, used
  only where a line genuinely beats space. Tables are the standing exception:
  there the rules *are* the structure, and they are drawn in full.
- **Every value comes from a token.** No one-off sizes, spacing or tracking
  at a call site. If something needs to change, it changes in `global.css`
  and propagates.

## Rules

- Tailwind CSS v4 is configured through the Vite plugin, not PostCSS.
- **Tailwind scans `src/` only**, and nothing else. `global.css` opens with
  `@import "tailwindcss" source(none)` plus a single `@source "../../src"`,
  because automatic detection reads the entire project — prose included — and
  turned written-down class names into real rules. This file was generating
  `bg-zinc-100` just by listing the classes it bans, a plan file shipped
  nineteen more, and `astro.config.mjs` produced a `.static` rule: 42 of 176
  rules and 2.5KB of stylesheet that nothing could reach.
  - So docs, plans and configs can name classes plainly. They are not scanned.
  - **`src/` still is, comments and all.** A class name spelled out in a
    comment in `global.css` or an `.astro` file does become a rule. Name them
    discursively *there* (`rounded-<size>`), not in documentation.
  - If markup ever lives outside `src/`, add an `@source` line for it — with
    automatic detection off, an unlisted directory is silently unstyled.
- `src/styles/global.css` is the **source of truth** for the colour system.
  Figma has been dropped — never treat an external design file as canonical,
  and there is no "mirror back to Figma" step.
- Colours are a two-tier token system in `src/styles/global.css`: primitives
  (raw hex, `:root` only) and semantic role tokens that reference them via
  `var()`, defined for light mode in `:root` and re-mapped for dark in `.dark`.
- Components use semantic Tailwind tokens (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-card`, `border-border`, `text-accent`) — never
  raw hex values, named colors, or palette classes like `bg-zinc-100`.
- Dark mode is class-based with `.dark` on `<html>`; both modes must be
  checked for any visual change.
- **One brand font: Söhne** (Klim Type Foundry, web-licensed), self-hosted
  from `src/assets/fonts/`. Exactly **two weights exist: Buch 400 and
  Halbfett 600.** There is no 500 and no italic:
  - Never write `font-medium` — 500 resolves to Buch 400 and silently
    flattens the hierarchy. Verified: 400 and 500 measure identically.
  - Never set `font-synthesis: none` — with no italic face it would erase
    `<em>` emphasis entirely. Synthetic oblique is the correct trade here.
  - Both faces are preloaded in `BaseLayout.astro`; those URLs and the
    `src()` paths in `global.css` must resolve to the same hashed asset or
    the preload silently double-downloads. Check `dist/` after changing either.
  `--font-mono` is a system fallback stack reserved for code only (inline
  `code` + code blocks) — never for labels, wordmarks, or metadata.
- **Spacing** uses the named scale (`p-md`, `gap-sm`, `py-xl`, …) or the
  semantic roles (`p-card`, `px-gutter`, …) — **never** raw Tailwind step
  numbers (`p-6`, `mt-1`, `gap-4`). The whole codebase was converted; zero
  raw steps ship in any page. 4px base; see `/style-guide`.
  - Tailwind's 5 / 10 / 20 steps (20px / 40px / 80px) have no equivalent on
    this scale. That is the point: when a value doesn't map, pick the
    neighbour that suits the context and say why — don't round blindly and
    don't add a scale step to accommodate one call site.
  - Prefer the semantic role over the raw step when one exists: page side
    padding is `px-gutter`, card interior padding is `p-card`.
  - One deliberate exception: inline `code` keeps `px-1.5 py-0.5`. That is
    optical padding inside a text run, and the scale's 4px floor would push
    inline code taller than its own line.
  - A mistyped scale name emits no CSS at all, so spacing silently collapses
    to zero. After any conversion, measure the computed values — don't just
    check that the build passed.
- **Hierarchy rule: size at large scale, weight at small scale.** Display
  and h1 stay in Buch 400 and let size do the work; h2/h3 sit close enough
  to body size that size alone cannot separate them, so they carry Halbfett
  600. Weight now lives inside the token — no component writes `font-*`.
- **No decorative eyebrows or uppercase kickers.** Section headings are real
  headings. `.label` is reserved for genuine metadata (table headers, the
  on-this-page title, style-guide section names) and is the only place
  uppercase and 600 weight combine.
- **Type** uses the scale tokens
  (`text-display/h1/h2/h3/body/small`) — never raw Tailwind sizes
  (`text-lg`, `text-4xl`, `text-[10px]`). Each token carries its own
  line-height and weight, so **never write `tracking-*`, `leading-*` or
  `font-*` at a call site**: if a step needs to change, change the token in
  global.css and every use follows.
- **Six steps, by decision: 72 → 44 → 30 → 20 → 16 → 14.** An 18px lead and a
  12px label were removed because neither earned a place. The lead sat one
  notch off body and only ever dressed intro paragraphs, which read as
  introductions from their position and their secondary colour. The 12px
  label existed to make metadata quiet, which `--text-secondary` already
  does. **Intros are `text-body`; metadata is `text-small`.**
  - `text-lead` and `text-label` now match no token, so Tailwind emits
    nothing and the element silently inherits its parent's size — the class
    looks right in the diff and does nothing on the page. `pnpm check` fails
    on both names.
  - Do not add a step back to make one call site fit. If something needs to
    sit between two steps, it needs different space or colour, not a
    seventh size.
- **Tracking is 0 on every step and every class.** No negative tracking on
  display type, no positive tracking on uppercase labels, no exceptions.
  Do not reintroduce per-size tracking "to tighten the hero" — uniformity is
  the point, and this is the variation the system exists to prevent.
- **Uppercase micro-text uses `.label`**, not a pile of utilities. It is a
  treatment, not a size: uppercase and 600 weight carry it, it draws its size
  from `--text-small` like everything else, and tracking stays at 0.
- **Corners are square on every element, by decision.** There is no
  `--radius` token and no `--radius-*` scale; never write `rounded-*` or
  `border-radius`. The tokens are *absent* rather than set to 0 on purpose:
  Tailwind keeps its own built-in radius scale for any key `global.css` does
  not override, so a `rounded-lg` that survived a cleanup renders at
  Tailwind's value — a curve no file in this repo declares. `pnpm check`
  fails on both the utility and the raw property.
- **There is one table treatment, and it is a real table.** Full grid: every
  cell ruled, outer border included, header cells in the `.label` style,
  padding from the spacing scale, tabular figures. Never build a table out of
  divs, a `<dl>`, or aligned spans — if the data has columns, it is a
  `<table>` with `<th>` headers.
  - Component tables go through `DataTable.astro`, which supplies the class
    and the horizontal-scroll wrapper. `pnpm check` fails on a bare `<table>`.
  - Markdown tables in a case study need nothing: `.prose table` carries the
    same rules, written as a grouped selector alongside `.data-table` so the
    two cannot drift. Header cells repeat `.label`'s declarations rather than
    requiring `class="label"`, because a markdown `<th>` cannot carry one.
  - **A table scrolls; it does not reflow.** Its columns are its meaning, so
    it scrolls inside its own container and the page never scrolls sideways.
  - **Rows that are links hover as a whole row**: `--background-hover` behind
    it, `--border-hover` on all four rules, text to `--text-primary`, and the
    same treatment on `:focus-within` so keyboard users get it too. Rows
    without a link never react — the effect is gated on `:has(a)`, which is
    what keeps the style-guide and metadata tables inert.
    - Collapsed borders are shared and the shared edge belongs to the cell
      *above*, so the hovered row's top rule is painted by the row before it
      and has to be styled through that row. Beware the shape of the
      selector: `tr:has(+ tr:hover:has(a))` is invalid — `:has()` cannot nest
      inside `:has()` — and an invalid selector is dropped in silence, which
      is how an open-topped highlight shipped through a first build. Split
      the conditions onto one element instead:
      `tr:has(a):has(+ tr:hover)`.
  - Prose tables need `width: max-content; max-width: 100%` with their
    `display: block`. Without it the border stretches to the container while
    the cells shrink-wrap, leaving empty space inside the outer rule.
  - The hero info box is deliberately *not* a table — it has no headings and
    none were invented for it — but it takes the same border, padding and
    type so it reads as part of the same family.
- **Long-form text is capped to the reading measure**
  (`var(--container-narrow)`, ~70 characters). `.prose` applies this to
  `p`/`ul`/`ol`/`blockquote` only, so images and code blocks still run the
  full width of their wrapper. Body text ran to ~89 characters before this.
- **Wrapping is set once in the base layer**: `text-wrap: balance` on
  headings, `pretty` on paragraphs. Don't repeat either at a call site.
- Numbers that sit in a column or change at runtime get `tabular-nums`.
- **One container: 1024px** (`--container-page`, 64rem). The header, the
  footer and every page use it, so everything sits on the same two vertical
  edges at every width. `Container` has **no size prop** — a second container
  width is how a layout starts drifting.
- **`max-w-measure` is not a container.** It is the reading measure (36rem,
  ~70 characters) for long-form text and lead paragraphs. It lives in the
  `--container-*` namespace only so Tailwind generates the utility; it is
  named `measure` precisely so a future "standardise the containers" pass
  cannot collapse it into the page width. Body text at 1024px runs to ~127
  characters — worse than the ~89 that made this a problem in the first place.
  Page width and reading width are different concerns and must stay separate
  tokens.
  NOTE: never name a custom container `prose` or reuse Tailwind's own scale
  keys — `max-w-prose` is a built-in (65ch) and a `--container-<key>` that
  matches a built-in silently overrides it. Custom scale tokens live in a
  plain `@theme {}` block (they add), never `@theme inline {}` (which
  replaces the built-in scale — this broke `max-w-3xl`).
- **Layout comes from primitives, never inline.** Compose pages as
  `Section > Container > Stack | Grid | Cluster` using the components in
  `src/components/primitives/`. Never inline `max-width`, `padding-block/
  inline`, `margin`, `display:flex/grid` for layout in a page or component —
  all layout CSS lives in global.css's "Layout primitives" section, driven by
  the spacing/container tokens. There is one container width.
  Component CSS is for typography, colour, and component-internal details only.
- **Direction-dependent CSS is always logical**, never physical:
  `padding-inline-start` / `margin-inline-end` / `border-inline-start`, and
  `ps-*` / `me-*` / `border-s-*` in Tailwind. Reserve `left`/`right` for
  genuinely physical geometry — `env(safe-area-inset-*)`, which has no
  logical form. Verify by setting `dir="rtl"` on `<html>`: the layout should
  mirror with no overflow.
- **Breakpoints come from the content, not device presets.** Measure where
  the layout actually stops fitting and break there. The header collapsed at
  768px while the bar genuinely fits down to ~540px, so tablets lost the
  full nav for no reason; it now holds to 38rem. When you add a breakpoint,
  write the measured number in a comment next to it.
- **A separator element cannot survive a line break.** As a flex sibling it
  dangles at the end of a wrapped row; as a `::before` it leads the next
  one — CSS cannot know which item starts a line. Use separators only in
  layouts that provably cannot wrap, and let space do the grouping
  everywhere else (gap between groups ≥ 2× the gap within a group).
- **Gutters take the safe area**: `max(var(--spacing-gutter),
  env(safe-area-inset-*))` on `.container` / `.page-wrapper`, so content
  never slides under a notch in landscape.
- **Two text colours, both measured.** `--text-primary` (14.35:1 light,
  12.55:1 dark) and `--text-secondary` (8.23:1 / 6.95:1), checked against
  both the page background and the card surface. No hue: the Neutral family
  is a cool grey and the backgrounds share its cast, so text never reads
  warm against a cool surface.
- **Hover always increases contrast.** One rule, one token: interactive text
  moves to `--accent` (= `--text-interactive`, 17.87:1 / 16.90:1), which
  out-contrasts `--text-primary` by design. Apple: "Maximize the contrast
  between text and the background of its container." Hover must read as text
  coming forward — the old accent was *lower* contrast than body text, so
  hovering made links recede. Never point a hover at a dimmer colour.
  - **A table row is the one thing that hovers as a surface, not as text.**
    Its cells rest at `--text-secondary` and move to `--text-primary`, so the
    contrast still climbs (8.23:1 → 14.35:1 light, 6.95:1 → 12.55:1 dark) —
    the rule above is satisfied, it is just measured from a quieter start.
    Resting muted is what makes the lift readable: if every row already sat at
    full contrast, hover would have nothing left to add.
- **Never dilute a text colour with an alpha** (`text-foreground/90`). It
  invents an undeclared colour outside the token system and quietly costs
  contrast — prose body was rendering at 10.66:1 instead of 14.35:1. If a
  softer colour is wanted, that is `--text-secondary`.
- **`pnpm check` enforces the mechanical rules** (`scripts/check-conventions.mjs`,
  run in CI before the build). It covers raw spacing steps, raw type sizes,
  call-site tracking/leading, unlicensed font weights, non-zero
  letter-spacing, physical direction properties, alpha-diluted colours, raw
  hex in components, inline layout, corner radius, bare tables, retired type
  steps, and eyebrows.
  Add a rule
  whenever a convention here gets broken in practice.
  - It runs **before** the build on purpose: every one of these produces
    valid CSS that renders wrongly, so a green build proves nothing.
  - It cannot check contrast, reading measure, or anything visual. Those
    still need measuring in a browser.
  - When adding a rule, prove it fires — write the violation, watch it fail,
    then delete it. A silently-passing rule is worse than no rule.
- **`Sidebar` is the two-column primitive**: a fixed `--rail-width` column
  beside a flexible one, collapsing to one column below 56rem (measured: the
  content column hits the 576px reading measure at exactly 864px, so the rail
  turns on at 896px with headroom rather than on the boundary).
  - Grid items default to `min-width: auto`, so a track will not shrink below
    its content's intrinsic width — a code block blew the column out to 776px
    inside a 327px container and scrolled the page sideways. `.sidebar-layout
    > * { min-width: 0 }` is the guard. Any new grid layout needs the same
    thought; the flex primitives do not have this failure mode.
  - `position: sticky` on a grid item needs `align-self: start`. A stretched
    item is already as tall as its row and has nothing to stick within.
- **Scroll-spy reads geometry, not intersection.** "Which section am I in" is
  about the last heading above a fold line. An IntersectionObserver answers
  "what is on screen" and leaves a dead zone mid-section where nothing is
  active. Drive updates from both a scroll listener and an observer — a
  programmatic jump can move the page without firing a scroll event — but let
  geometry decide.
- **Layout is composed, never inlined.** Every page is
  `Section > Container > Stack | Grid | Cluster`. `Section size="page"` is
  the asymmetric opener for the first section under the header (48→64px top,
  96px bottom) — the header supplies weight above, so the top needs less air.
- The `/style-guide` page must stay in sync with the token system — update it
  when tokens change.

## Related Files

- `src/styles/global.css`
- `src/pages/style-guide.astro`
- `src/components/`
- `src/layouts/`
