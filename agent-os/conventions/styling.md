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
- **One reading font, three approved weights.** TASA Orbiter Regular 400,
  Medium 500 and Semibold 600. Hierarchy comes from size, space and colour
  before it comes from weight; 600 is reserved for emphasis and real labels.
- **One display font, one step.** Violet Sans on `text-display` and nowhere
  else. It has a single weight, so it can only sit on a step already set in
  400; extending it downward means dropping the heading role to 400 first.
- **Big type is set light.** Display and title at 400 — this is the Klim habit
  and it is why the hero reads as composed rather than shouted.
- **14px is the meta step.** It carries metadata, captions and compact
  interface labels at 1.5 leading; body remains 16px for reading.
- **Tracking is zero, everywhere.** One value for every size, in both
  directions. TASA Orbiter is drawn to be spaced correctly at each size; the system
  trusts it rather than second-guessing it per step.
- **Portfolio reading text stays neutral.** Public content currently uses the
  primary and secondary neutral roles after Apple's label model. The canonical
  system also contains tertiary, disabled, accent and status roles so the
  vocabulary is complete; their existence is not permission to add hue to
  ordinary body copy without a real semantic reason.
- **Brown is the portfolio accent family.** The complete brown ramp supports
  canonical accent surfaces, text, icons and borders. The live site still uses
  `brown-300` through `--decorative-accent` for homepage section markers and
  wide-screen navigation dividers; that specialised role stays identical in
  both themes.
  - Accent bars use the 4px `--spacing-3xs` width and
    `--decorative-accent` colour, including homepage section markers and
    Experiments selection strips. Do not approximate either at the component.
    Wide-screen navigation dividers remain 1px because they separate labels
    rather than mark section state. Autonomous progress may use the same colour
    at a thinner, component-local 2px rule when it needs to read as time rather
    than selection; the Experiments preview loader is the standing example.
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
- `src/styles/global.css` is the **base implementation source of truth** for
  the colour system. Authored page-palette remaps live in
  `src/styles/themes/` and are imported by that file. The Figma variables are
  the canonical base palette's design-documentation mirror; a base
  colour-system change is complete only when the primitive values, semantic
  mappings and names agree in both places.
- Colours are a two-tier token system in `src/styles/global.css`: 46 primitives
  (raw hex, `:root` only) and 106 canonical semantic roles across background,
  text, icon and border groups. Semantic roles reference primitives via
  `var()`, with light values in `:root` and a complete dark remap in `.dark`.
  Portfolio-specific compatibility roles sit above those two tiers and keep
  established components stable.
- **Appearance mode and page palette are separate axes.** `.dark` is the
  visitor-controlled light/dark preference. `data-palette` on `<html>` is an
  authored page identity such as `default` or `blue`; changing one must never
  overwrite or persist the other.
  - Content pages opt in with validated `palette` frontmatter. Ordinary Astro
    pages pass the same value to `PageLayout`; components never inspect the
    palette name.
  - Each non-default palette gets one isolated file in `src/styles/themes/`
    with both its light selector and its combined dark selector. It remaps
    semantic roles to existing primitives; it never adds literal colours or
    component selectors.
  - Page palettes remap structural background, text, icon, border,
    interaction and decorative roles. Error, success, warning and info retain
    their canonical families so state meaning is not erased for the sake of a
    monochrome treatment.
  - `--text-reading` is the long-form body-copy role. It aliases primary text
    by default, while a page palette can make reading text quieter than titles
    without weakening headings, navigation states, or controls. Prose headings
    stay on `--text-primary`; prose paragraphs and lists use
    `--text-reading`.
  - Valid names live in `src/data/page-palettes.ts`. Adding a palette means
    registering the name, adding its mapping file, importing it in
    `global.css`, and documenting it on `/style-guide`.
  - The blue primitive family runs from 100–900. Its 700–900 stops exist to
    give blue-authored dark pages real canvas and surface depth; the default
    portfolio palette does not consume those stops.
  - Blue dark mode is deliberately low-glare and fully monochrome: 200 carries
    titles and primary controls, 300 carries reading and secondary text, and
    700–800 carry rules and quiet surfaces against the 900 canvas. Do not use
    neutral white inside this palette.
  - Shiki is the one cascade exception: it injects GitHub-dark colours inline
    on rendered code blocks. The scoped blue-dark override in `global.css`
    uses semantic surface/reading roles with `!important` and makes token spans
    inherit, because otherwise one Markdown fence reintroduces a grey palette.
- Components use semantic Tailwind tokens (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-card`, `border-border`, `text-accent`) — never
  raw hex values, named colors, or palette classes like `bg-zinc-100`.
- Dark mode is class-based with `.dark` on `<html>`; both modes must be
  checked for any visual change.
- **One reading font: TASA Orbiter** (SIL OFL), self-hosted as a variable
  WOFF2 from `src/assets/fonts/`. The font axis covers 400–800; this design
  intentionally uses **Regular 400, Medium 500 and Semibold 600** only.
  - Regular carries body/meta/title, Medium carries heading and the wordmark, and
    Semibold is reserved for strong emphasis and genuine labels.
  - The convention checker rejects weights outside that approved hierarchy,
    even when the font file could technically render them, and rejects weight
    utilities at component call sites.
  - The variable face is preloaded in `BaseLayout.astro`; that URL and the
    `src()` paths in `global.css` must resolve to the same hashed asset or
    the preload silently double-downloads. Check `dist/` after changing either.
  - `TASA Orbiter Fallback` is Arial calibrated from the real x-height,
    ascent, descent and line gap in the local font files. Do not copy metric
    overrides from another typeface.
- **One display font: Violet Sans** (SIL OFL, licence copy sits beside the
  file), self-hosted from the same folder. It has
  **one weight and one style — that is the whole family, not a licence limit.**
  - It is bound to `.text-display` in `global.css` rather than to a token,
    because Tailwind's `--text-*` steps carry size, leading and weight but
    not family.
  - `font-synthesis-weight: none` is set on that rule. A fake bold here would
    be a smeared regular with no upside — and
    note this switches off weight only, so `<em>` is unaffected.
  - Violet is conditionally preloaded through `preloadDisplayFont` only on
    routes that render display type; CSS loads it normally everywhere else.
    Its Arial fallback is calibrated separately from TASA's.
  - Do not extend it to heading without first dropping that role to 400.
  `--font-mono` is a system fallback stack reserved for code only (inline
  `code` + code blocks) — never for labels, wordmarks, or metadata.
- **Spacing** uses the named scale (`p-md`, `gap-sm`, `py-xl`, …) or the
  semantic roles (`p-card`, `px-gutter`, …) — **never** raw Tailwind step
  numbers (`p-6`, `mt-1`, `gap-4`). The whole codebase was converted; zero
  raw steps ship in any page. 4px base; see `/style-guide`.
  - Content rhythm stays on the 4px scale: 4, 8, 12, 16, 24, 32, 48, 64,
    96 and 128px. Structural geometry has two named roles outside that ordinal
    scale: `--spacing-gutter` is the 20px page inset and
    `--spacing-grid` is the 10px gutter between the 24 layout tracks. Do not
    use either as general-purpose component spacing.
  - `Stack` and `Cluster` gap props map literally: `gap="md"` means
    `--spacing-md` (24px), never a remapped neighbouring value. Their allowed
    names are `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, and `2xl`.
  - The homepage hero split uses the existing `--spacing-md` (24px) as its
    column gap so the copy and media breathe without changing the global grid
    gutter.
  - Major Work and Experiments prose groups use the existing `2xl` spacing
    token (64px), applied before each body `h2`. Within each group, paragraphs
    and title-to-body transitions use `--spacing-stack` (16px).
  - Tailwind's 5 / 10 / 20 steps (20px / 40px / 80px) have no general-purpose
    equivalent on this content scale. The 20px page inset is a named structural
    role, not permission to use `p-5`. When a content value doesn't map, pick
    the neighbour that suits the context and say why — don't round blindly and
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
  and title stay at 400 and let size do the work; heading sits close enough to
  body that size alone cannot separate it, so it carries TASA Medium 500.
  Weight lives inside the token — no component writes `font-*`.
- **No decorative eyebrows or uppercase kickers.** Section headings are real
  headings. `.label` is reserved for genuine metadata (table headers, the
  on-this-page title, style-guide section names) and is the only place
  uppercase and 600 weight combine.
- **Type** uses five role tokens
  (`text-display/title/heading/body/meta`) — never raw Tailwind sizes
  (`text-lg`, `text-4xl`, `text-[10px]`). Each token carries its own
  line-height and weight, so **never write `tracking-*`, `leading-*` or
  `font-*` at a call site**: if a step needs to change, change the token in
  global.css and every use follows.
- **Five sizes, by decision: 64 → 44 → 20 → 16 → 14.** Display is fluid
  from 40–64px; title is fluid from 32–44px; heading is a fixed 20px. The old
  h2 and h3 steps share `text-heading` in prose and cards: semantic document
  structure and space distinguish their level instead of a second size.
  Homepage section h2s use `text-title` (44px desktop) to carry the same major
  rhythm as page titles. Homepage experiment-row titles use `text-heading`.
  Project-card titles and descriptions both use `text-body`; primary versus
  secondary colour creates their hierarchy without adding a local type size
  or weight. Body is 16px / 1.5; meta is 14px / 1.5.
  - A project card is a quiet, borderless surface, not one large anchor. Copy
    comes first, inset media comes last, and a dedicated `View case study` or
    `View experiment` CTA is its only link and hover target. Never lift the
    card surface, title, description, or media when that link changes state.
  - `.type-reading` layers secondary reading colour and
    `--leading-reading` (1.4) on the 16px body role. Rendered prose shares the
    same declarations. This is a treatment, not a sixth size, and it never
    mutates the body token through a local scope.
  - The retired `text-h1`, `text-h2`, `text-h3`, `text-small`, `text-lead` and
    `text-label` names match no token, so Tailwind emits nothing and the
    element silently inherits. `pnpm check` fails on all six.
  - Do not add a step back to make one call site fit. If something needs to
    sit between two steps, it needs different space or colour, not a
    sixth size.
- **Tracking is 0 on every step and every class.** No negative tracking on
  display type, no positive tracking on uppercase labels, no exceptions.
  Do not reintroduce per-size tracking "to tighten the hero" — uniformity is
  the point, and this is the variation the system exists to prevent.
- **Uppercase micro-text uses `.label`**, not a pile of utilities. It is a
  treatment, not a size: uppercase and 600 weight carry it, it draws its size
  from `--text-meta` like everything else, and tracking stays at 0.
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
  - **A table whose rows are links opts in with `interactive` on
    `DataTable`.** The whole row then takes `--background-hover`,
    `--border-hover` on all four rules and `--text-primary`, with the same
    treatment on `:focus-within` so keyboard users get it too, and its
    resting cells drop to `--text-secondary`. A table without the prop is
    inert and stays at full contrast — that is what keeps the style-guide and
    metadata tables from reacting.
    - It is a modifier class rather than an inferred `:has(a)` because the
      border rules have to reach a **neighbour**, and "the next row is
      hovered and contains a link" cannot be written: `:has()` cannot nest
      inside `:has()`, and an invalid selector is dropped in silence. That is
      how an open-topped highlight shipped through a first build.
    - **Collapsed borders are shared, and the shared edge belongs to the cell
      above**, so a hovered row's top rule is painted by whatever precedes it
      and has to be styled through that element. Two cases, not one:
      `tbody tr:has(+ tr:hover) > *` for rows with a row above them, and
      `thead:has(+ tbody tr:first-child:hover) th` for the first row, whose
      top edge belongs to the header. `thead > tr` is not a sibling of
      `tbody > tr`, so the reach has to be thead-to-tbody — missing that is
      why the first row alone stayed open at the top.
  - Prose tables need `width: max-content; max-width: 100%` with their
    `display: block`. Without it the border stretches to the container while
    the cells shrink-wrap, leaving empty space inside the outer rule.
  - The hero info box is deliberately *not* a table — it has no headings and
    none were invented for it — but it takes the same border, padding and
    type so it reads as part of the same family.
- **There are three buttons, and they are levels of emphasis, not shapes.**
  Every actionable control is `class="btn btn--<variant>"`; nothing hand-rolls
  a border, padding and hover triplet at a call site again.
  - `.btn--primary` — the one action a page is *for*. Inverted surface
    (`--background-alternate` on `--text-alternate`). **At most one per view:**
    a second primary makes both mean less. Today that is "Try it live" on a
    case study, and nothing else.
  - `.btn--secondary` — the bordered default. Navigation and every action that
    is an action but not *the* action: the back links on work and play, the
    "View all" links beside the homepage section headings. It
    moves the same three properties an interactive table row moves — border,
    surface, text — so it reads as one object lifting.
  - `.btn--link` — an action inside, or beside, a run of text. No box.
    `--text-primary`, underlined at `--spacing-3xs` offset, hovering to
    `--accent`.
  - **Always write both classes.** `btn` alone is a transparent box with
    inherited colour, which renders as text with padding — it looks like plain
    markup rather than a bug, so it ships. `pnpm check` fails on a missing or
    unknown variant.
  - The base carries `border: 1px solid transparent` so a filled button and an
    outlined one are the same height. Without it the primary sits 2px shorter,
    which is only visible once two variants stand side by side — by which time
    the base is load-bearing everywhere.
  - **`.btn--link` sets `display: inline`, and that is load-bearing.** The base
    is `inline-flex`, which cannot break across lines; mid-sentence that pushes
    the whole label onto one line and blows the paragraph sideways. It also
    resets `font-size` to `inherit`, so a link in body copy doesn't shrink to
    `--text-meta`. It is the one variant that appears inside text.
  - **Markdown links get the link variant through `.prose a`**, grouped into
    the same rule rather than written twice — a case-study `<a>` cannot carry a
    class, exactly as with `.prose table`. They join at the *variant*, never at
    `.btn`: the base is a box and a prose link is not.
  - `--background-alternate-hover` exists for the primary variant alone, and
    follows `--background-hover`'s rule — step AWAY from the page (black on
    light, white on dark), never toward the middle. `--text-interactive` cannot
    serve: it is correct in light mode and collides exactly with
    `--background-alternate` in dark, so the button would stop responding in
    one theme only.
  - The header nav and the footer are deliberately **not** buttons. They are
    site furniture with their own quiet treatment (`--text-secondary`, no
    underline); giving them `.btn--link` would make both louder than the
    content they frame.
- **Long-form text is capped to the reading measure**
  (`var(--container-measure)`, ~70 characters). `.prose` applies this to
  `p`/`ul`/`ol`/`blockquote` only, so images and code blocks still run the
  full width of their wrapper. Body text ran to ~89 characters before this.
- **Wrapping is set once in the base layer**: `text-wrap: balance` on
  headings, `pretty` on paragraphs. Don't repeat either at a call site.
- Numbers that sit in a column or change at runtime get `tabular-nums`.
- **One page container: 1300px of content** (`--container-page`, 81.25rem),
  plus the 20px safe inset carried by `Container`. At a 1440px viewport the
  inner content runs from x=70 to x=1370; below the cap it keeps 20px at each
  side. Header, footer and every page use it, so everything sits on the same
  two vertical edges. `Container` has **no size prop** — a second container
  width is how a layout starts drifting.
- **`max-w-measure` is not a container.** It is the reading measure (36rem,
  ~70 characters) for long-form text and lead paragraphs. It lives in the
  `--container-*` namespace only so Tailwind generates the utility; it is
  named `measure` precisely so a future "standardise the containers" pass
  cannot collapse it into the page width. The wider 1300px canvas makes this
  separation more important: page width creates compositional room; measure
  controls readable line length.
  Page width and reading width are different concerns and must stay separate
  tokens.
  NOTE: never name a custom container `prose` or reuse Tailwind's own scale
  keys — `max-w-prose` is a built-in (65ch) and a `--container-<key>` that
  matches a built-in silently overrides it. Custom scale tokens live in a
  plain `@theme {}` block (they add), never `@theme inline {}` (which
  replaces the built-in scale — this broke `max-w-3xl`).
- **Layout comes from primitives, never inline.** Compose pages as
  `Section > Container > Stack | Grid + GridItem | Cluster` using the components in
  `src/components/primitives/`. Never inline `max-width`, `padding-block/
  inline`, `margin`, `display:flex/grid` for layout in a page or component —
  all layout CSS lives in global.css's "Layout primitives" section, driven by
  the spacing/container tokens. There is one container width and one 24-track
  grid with a 10px gutter.
  - `Grid` always exposes 24 equal `minmax(0, 1fr)` tracks. `GridItem` owns the
    supported spans (6, 8, 12, 16, 18 and 24) and responsive starts. Pages do
    not write raw column arithmetic or Tailwind `grid-cols-*` / `col-span-*`
    classes.
  - Items are 24 columns by default. Tablet overrides begin at 48rem and
    desktop overrides at 64rem: halves are 12/12, thirds 8/8/8, quarters
    6/6/6/6, and feature splits 8/16 or 16/8. A different breakpoint needs a
    measured content failure documented beside it.
  - Every grid child has `min-width: 0`. Without it, code, tables, or long
    tokens can force a track wider than the page.
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
- **Two reading-text colours, both measured.** `--text-primary` (14.35:1 light,
  12.55:1 dark) and `--text-secondary` (8.23:1 / 6.95:1), checked against
  both the page background and the card surface. These are the roles used by
  ordinary portfolio copy; the wider canonical text vocabulary is reserved for
  the semantic situations named by each token.
- **Hover always increases contrast.** One rule, one token: interactive text
  moves to `--accent` (= `--text-interactive`, 17.87:1 / 16.90:1), which
  out-contrasts `--text-primary` by design. Apple: "Maximize the contrast
  between text and the background of its container." Hover must read as text
  coming forward — the old accent was *lower* contrast than body text, so
  hovering made links recede. Never point a hover at a dimmer colour.
  - **An interactive table row is the one thing that hovers as a surface, not
    as text.** Its cells rest at `--text-secondary` and move to
    `--text-primary` on `--background-hover`, measuring 15.39:1 light and
    13.26:1 dark — the rule above is satisfied, just from a quieter start.
    Resting muted is what makes the lift readable: if every row already sat at
    full contrast, hover would have nothing left to add.
  - **Measured on the buttons**, light → dark: primary 16.90 → 19.58 and
    16.90 → 18.13; secondary 14.35 → 19.17 and 12.55 → 17.87, with its rule
    going 2.43 → 18.13 and 1.40 → 7.34; link 14.35 → 17.87 and 12.55 → 16.90.
    Every variant gains contrast on hover in both themes.
  - **`--background-hover` brightens in both themes**, to white on light and
    neutral-700 on dark, rather than changing direction between modes. It was
    `neutral-200`, which laid a heavy grey band under a hovered row; one step
    off the page background is enough when the rules and the text are moving
    with it.
- **Never dilute a text colour with an alpha** (`text-foreground/90`). It
  invents an undeclared colour outside the token system and quietly costs
  contrast — prose body was rendering at 10.66:1 instead of 14.35:1. If a
  softer colour is wanted, that is `--text-secondary`.
- **`pnpm check` enforces the mechanical rules** (`scripts/check-conventions.mjs`,
  run in CI before the build). It covers raw spacing steps, raw type sizes,
  call-site tracking/leading/weight, unapproved font weights, non-zero
  letter-spacing, physical direction properties, alpha-diluted colours, raw
  hex in components, inline layout, raw public-page grid columns, the retired
  auto-fit Grid API, unsupported primitive gaps, corner radius, bare tables,
  variant-less buttons, retired type steps, and eyebrows.
  Add a rule
  whenever a convention here gets broken in practice.
  - It runs **before** the build on purpose: every one of these produces
    valid CSS that renders wrongly, so a green build proves nothing.
  - It cannot check contrast, reading measure, or anything visual. Those
    still need measuring in a browser.
  - When adding a rule, prove it fires — write the violation, watch it fail,
    then delete it. A silently-passing rule is worse than no rule.
- **`Sidebar` is the case-study 4/20 composition on the same 24-track grid**,
  collapsing to one column below 56rem. At 896px the 20px page insets leave
  856px: the rail receives roughly 134px and content roughly 712px, safely
  above the 576px reading measure.
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
  `Section > Container > Stack | Grid + GridItem | Cluster`. `Section size="page"` is
  the asymmetric opener for the first section under the header (48→64px top,
  96px bottom) — the header supplies weight above, so the top needs less air.
  Other semantic sizes are `compact`, `standard`, `large`, and `hero`; their
  names describe page rhythm rather than pretending to be raw scale aliases.
- The `/style-guide` page must stay in sync with the token system — update it
  when tokens change.

## Related Files

- `src/styles/global.css`
- `src/pages/style-guide.astro`
- `src/components/`
- `src/layouts/`
