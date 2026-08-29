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
- **One portfolio font, three approved cuts.** KMR Apparat Light 300, Regular
  400 and Medium 500. Hierarchy comes from size, space and colour before it
  comes from weight; Medium is reserved for headings, emphasis and real labels.
- **Big type is set regular.** Display and title use Apparat Regular 400. Their
  scale and spacing carry the hierarchy without requiring a heavier cut.
- **14px is the shared body step.** Body copy, metadata, captions and compact
  interface labels all use it at 1.5 leading.
- **Tracking is zero, everywhere.** One value for every size, in both
  directions. Apparat is drawn to be spaced correctly at each size; the system
  trusts it rather than second-guessing it per step.
- **Portfolio reading text stays neutral.** Public content currently uses the
  primary and secondary neutral roles after Apple's label model. The canonical
  system also contains tertiary, disabled, accent and status roles so the
  vocabulary is complete; their existence is not permission to add hue to
  ordinary body copy without a real semantic reason.
- **Sage is the portfolio accent family.** The authored Sage stops support the
  canonical accent surfaces, text, icons and borders. The live site uses
  `sage-500` through `--decorative-accent` for homepage section markers and
  wide-screen navigation dividers; that specialised role stays identical in
  both themes. The complete Brown ramp remains available as a primitive family
  for future page palettes, but does not drive the default theme.
  - Accent bars use the 4px `--spacing-3xs` width and
    `--decorative-accent` colour, including homepage section markers and
    Experiments selection strips. Do not approximate either at the component.
    Wide-screen navigation dividers remain 1px because they separate labels
    rather than mark section state. Autonomous progress may use the same colour
    at a thinner, component-local 2px rule when it needs to read as time rather
    than selection; the Experiments preview loader is the standing example.
- **Geometry follows function.** Structural cards, images, embeds and code
  blocks stay crisp and square. Controls and physical simulations may use the
  small semantic radius vocabulary when curvature clarifies their behaviour:
  modest control corners, fully round switches/thumbs and a device radius.
  Rounding is never a decorative skin applied to an entire page.
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
- `ds-bundle/` is a generated, tokens-only distribution of that colour source
  graph. Run `pnpm sync:design-bundle` after changing base tokens or page
  palettes; never hand-edit its generated token or preview files. `pnpm check`
  verifies the checked-in bundle against the canonical CSS.
- Colours are a two-tier token system in `src/styles/global.css`: 55 primitives
  (raw hex, `:root` only) and 107 canonical semantic roles across background,
  text, icon and border groups. Semantic roles reference primitives via
  `var()`, with light values in `:root` and a complete dark remap in `.dark`.
  Portfolio-specific compatibility roles sit above those two tiers and keep
  established components stable.
- **Appearance mode and page palette are separate axes.** `.dark` is the
  visitor-controlled light/dark preference. `data-palette` on `<html>` is an
  authored page identity such as `default`, `blue` or `sage`; changing one
  must never overwrite or persist the other.
  - Content pages opt in with validated `palette` frontmatter. Ordinary Astro
    pages pass the same value to `PageLayout`; components never inspect the
    palette name.
  - Each non-default palette gets one isolated file in `src/styles/themes/`
    with both its light selector and its combined dark selector. It remaps
    semantic roles to existing primitives; it never adds literal colours or
    component selectors.
  - Page palettes may remap the full structural stack, as Blue does, or retain
    the neutral stack and remap one authored accent family, as Sage does.
    Error, success, warning and info retain their canonical families so state
    meaning is not erased for the sake of content identity.
  - `--text-reading` is the long-form body-copy role. It aliases primary text
    by default, while a page palette can make reading text quieter than titles
    without weakening headings, navigation states, or controls. Prose headings
    stay on `--text-primary`; prose paragraphs and lists use
    `--text-reading`.
  - Valid names live in `src/data/page-palettes.ts`. Adding a palette means
    registering the name, adding its mapping file, importing it in
    `global.css`, and documenting it on `/style-guide`.
  - The blue primitive family runs from 50–950. Its 700–950 stops give
    blue-authored dark pages real canvas, inset and surface depth; its 50 stop
    gives light pages a raised surface without falling back to grey.
  - Blue dark mode is deliberately low-glare and fully monochrome: 200 carries
    titles and primary controls, 300 carries reading and secondary text, and
    700–950 carry rules and quiet surfaces against the 900 canvas. Neutral
    white is reserved for the light palette's raised-hover endpoint; resting
    surfaces remain blue.
  - Sage begins with three deliberately deep authored stops: 900, 700 and 500.
    The 500 stop carries visible accents and boundaries; 700 and 900 add depth
    to interactive states. Filled Sage controls use neutral text until lighter
    Sage tints are authored, so contrast is not invented from missing stops.
  - **Every palette uses the same four-level surface ladder.** Canvas is
    `--bg-primary`, inset/recessed content is `--bg-secondary`, raised content
    is `--bg-quaternary`, and raised hover is `--bg-quaternary-hover`.
    `--bg-primary-hover` deliberately equals raised rest, while
    `--bg-secondary-hover` deliberately returns to canvas. A parent and nested
    child must never resolve to the same primitive in either state. New page
    palettes preserve this topology even when their colour ramps differ.
  - Shiki is the one cascade exception: it injects GitHub-dark colours inline
    on rendered code blocks. The scoped blue-dark override in `global.css`
    uses semantic surface/reading roles with `!important` and makes token spans
    inherit, because otherwise one Markdown fence reintroduces a grey palette.
- Components use semantic Tailwind tokens (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-card`, `border-border`, `text-accent`) — never
  raw hex values, named colors, or palette classes like `bg-zinc-100`.
- Dark mode is class-based with `.dark` on `<html>`; both modes must be
  checked for any visual change.
- **One portfolio font: KMR Apparat**, self-hosted from `src/assets/fonts/`
  under the purchased Kimera Web License. The site uses the three original,
  unchanged WOFF2 files supplied by Kimera and maps their authored cuts to
  **Light 300, Regular 400 and Medium 500**.
  - Regular carries display/title/body. Medium carries heading,
    wordmark, strong emphasis and genuine labels. Light remains available but
    is not assigned to a shared type role.
  - The convention checker rejects weights outside that approved hierarchy,
    even when the font file could technically render them, and rejects weight
    utilities at component call sites.
  - All three cuts are preloaded in `BaseLayout.astro`; those URLs and the
    `src()` paths in `global.css` must resolve to the same three hashed assets
    or a preload silently double-downloads. Check `dist/` after changing either.
  - `KMR Apparat Fallback` is Arial calibrated from Apparat's real x-height,
    ascent, descent and line gap. All three cuts share those metrics. Do not
    copy metric overrides from another typeface.
  - `font-synthesis-weight: none` is inherited from `html`; if a role asks for
    a weight outside 300/400/500, the browser must not fabricate it.
  - The Web License permits only `@font-face` use on the licensed domain with
    the fonts stored on the same server. Do not modify, convert, subset,
    rename, or move the font files to a third-party host.
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
  and title use Regular 400 and let size do the work; heading sits close enough
  to body that size alone cannot separate it, so it carries Apparat Medium 500.
  Weight lives inside the token — no component writes `font-*`.
- **No decorative eyebrows or uppercase kickers.** Section headings are real
  headings. `.label` is reserved for genuine metadata (table headers, the
  on-this-page title, style-guide section names) and is the only place
  uppercase and Medium 500 combine.
- **Type** uses four role tokens
  (`text-display/title/heading/body`) — never raw Tailwind sizes
  (`text-lg`, `text-4xl`, `text-[10px]`). Each token carries its own
  line-height and weight, so **never write `tracking-*`, `leading-*` or
  `font-*` at a call site**: if a step needs to change, change the token in
  global.css and every use follows.
- **Four sizes, by decision: 64 → 36 → 20 → 14.** Display is fluid
  from 40–64px; title is a fixed 36px; heading is a fixed 20px. The old
  h2 and h3 steps share `text-heading` in prose and cards: semantic document
  structure and space distinguish their level instead of a second size.
  Homepage section h2s use `text-title` (36px) to carry the same major
  rhythm as page titles. The homepage hero alone uses the named `hero-display`
  treatment: it keeps the display token's size and leading, then applies
  Medium 500 and uppercase. All project, work, and experiment card titles use
  `text-body` (14px), medium weight (500), uppercase, and the primary text
  colour. Apply uppercase as a presentation rule so content titles retain
  their natural casing everywhere else. Card descriptions use `text-body` in
  the secondary colour, creating hierarchy without a local type size. Body,
  metadata, captions and compact interface text all share 14px / 1.5.
  - Project cards and homepage experiment rows are quiet, borderless linked
    surfaces. Copy comes first and project-card media comes last. Titles and
    descriptions use the 4px `3xs` gap. Their tonal surface ladder remains the
    main depth cue, while the shared `--light-shade-raised`,
    `--light-shade-raised-hover` and `--light-shade-pressed` effects add a
    fixed top-left light source. Every edge is one pixel, zero blur and low
    opacity; do not substitute soft shadows, rounded halos or component-local
    values. Cards and experiment rows consume the same rest, hover/focus and
    pressed effects, while primary/secondary text colours remain stable.
    The experiment row's thin accent/progress strip is selection state, not a
    border, and remains independent of the shared interaction treatment. A
    selected desktop row may retain the elevated-hover surface, but it must not
    override the shared shadow state.
    The desktop experiment preview pane shares the card's borderless raised
    surface and interior padding; its main frame and filmstrip are inset media.
    The sticky header stays outside this system and retains its vanilla
    translucent material without a light/shade effect.
  - `.type-reading` layers secondary reading colour and
    `--leading-reading` (1.4) on the 14px body role. Rendered prose shares the
    same declarations. This is a treatment, not a fifth size, and it never
    mutates the body token through a local scope.
  - The retired `text-h1`, `text-h2`, `text-h3`, `text-small`, `text-meta`,
    `text-lead` and `text-label` names match no token, so Tailwind emits
    nothing and the element silently inherits. `pnpm check` fails on all seven.
  - Do not add a step back to make one call site fit. If something needs to
    sit between two steps, it needs different space or colour, not a
    fifth size.
- **Tracking is 0 on every step and every class.** No negative tracking on
  display type, no positive tracking on uppercase labels, no exceptions.
  Do not reintroduce per-size tracking "to tighten the hero" — uniformity is
  the point, and this is the variation the system exists to prevent.
- **Uppercase micro-text uses `.label`**, not a pile of utilities. It is a
  treatment, not a size: uppercase and Medium 500 carry it, it draws its size
  from `--text-body` like everything else, and tracking stays at 0.
- **Demo interfaces use the shared primitive contract.** Low-level behaviour
  and states live in `src/components/ui/`; guided stage/panel composition lives
  in `src/components/demo/`; experiment-specific CSS owns only the artifact and
  domain visuals. New demos compose those layers instead of hand-rolling tabs,
  switches, tooltips or action buttons.
  - Compact desktop controls use `--control-height-compact` (32px), and
    coarse-pointer layouts grow them to `--control-height-touch` (48px).
    Icons use `--control-icon-size` (16px).
  - Guided panels use one 20px Medium heading. Steps, explanations, settings
    and actions all use the 14px body role; colour and Regular/Medium weight
    carry hierarchy instead of extra sizes or fonts.
  - The default panel contains one ordered task, its current explanation, at
    most a small number of secondary settings, and wayfinding. Raw state,
    event logs, code and playback controls require an explicit disclosure and
    a demonstrated visitor need. Canvas status badges are opt-in, not default.
  - Binary controls use the familiar shadcn/Base UI switch anatomy: a 32×20
    round track, a 16px round thumb and an enlarged 48px coarse-pointer target.
    Off uses `--border-interactive` as a neutral track; on moves the thumb and
    fills the track with `--background-alternate`. The position change carries
    the state, so colour is never the only signal. The thumb stays on
    `--background-primary`, preserving at least 3:1 separation from both tracks
    across default, Blue and Sage palettes in light and dark mode.
  - Rest, hover, press, selected, focus and disabled states use semantic
    surface/text roles. Guided-step selection gets a quiet neutral surface,
    primary text and `aria-current`; it does not add an accent rule.
  - Demo motion uses `--motion-feedback` for immediate response and
    `--motion-settle` for restrained state settling. Reduced motion removes
    travel; reduced transparency returns materials to solid semantic surfaces.
  - Page palettes and dark mode work by remapping semantic roles. Shared
    controls contain no palette names, raw colours or component-level dark
    exceptions.
- **Corners are square by default, with three semantic exceptions.** Never
  use a radius utility or a raw radius value at a call site. Functional
  curvature must use `--radius-control`, `--radius-round` or
  `--radius-device`: modest input/control corners, true capsule/circle
  geometry, and simulated hardware respectively. Annotation outlines mirror
  the target's computed radius and fall back to `--radius-control`. The
  convention checker permits only those tokens and rejects arbitrary
  `border-radius` values, so a purposeful exception cannot quietly become a
  site-wide rounded-card style.
- **There is one table treatment, and it is a real table.** Quiet ledger:
  strong outer block and column-header rules, quiet horizontal row separators,
  no vertical cell walls, padding from the spacing scale and tabular figures.
  Column headers use the `.label` treatment; explicit row headers use Medium
  500 in natural case and primary text; values use secondary text. Never build
  a table out of divs, a `<dl>`, or aligned spans — if the data has columns, it
  is a `<table>` with `<th>` headers.
  - Component tables go through `DataTable.astro`, which supplies the class
    and horizontal-scroll wrapper. The wrapper becomes a labelled, keyboard-
    focusable region only while it overflows; Left and Right Arrow page it by
    one visible width. `pnpm check` fails on a bare `<table>`.
  - Markdown tables in a case study need nothing: `.prose table` carries the
    same rules, written as a grouped selector alongside `.data-table` so the
    two cannot drift. Header cells repeat `.label`'s declarations rather than
    requiring `class="label"`, because a markdown `<th>` cannot carry one.
  - **A table scrolls; it does not reflow.** Its columns are its meaning, so
    it scrolls inside its own container and the page never scrolls sideways.
  - A table with a true row-header first column may opt into
    `pinFirstColumn` on `DataTable`; only then does that column stay visible
    whenever the table overflows. Do not pin a value column or use the prop
    unless every body row starts with `<th scope="row">`.
  - Prose tables need `width: max-content; max-width: 100%` with their
    `display: block`. Without it the border stretches to the container while
    the cells shrink-wrap, leaving empty space inside the outer rule.
  - The hero info box is deliberately *not* a table — it has no headings and
    none were invented for it. It retains a full box border because it is a
    self-contained panel, while sharing the table's padding and type.
- **Buttons are levels of emphasis, not shapes.** `ActionLink.astro` is the
  public Astro entry point; React commands use `Button` or `IconButton`. The
  two runtimes remain separate, but share the same neutral component roles and
  state vocabulary.
  - `primary` — the action a region is *for*. Use one per action group; a
    simulated device and its surrounding guided panel are separate regions.
    Its surface follows a real three-step neutral ladder: rest, hover, pressed.
  - `secondary` — the bordered default for navigation and supporting actions.
    Rest is transparent; hover and pressed use separate neutral surfaces while
    border and text move with them.
  - `quiet` — React-only support for actions such as Previous and Reset beside
    a stronger action. It has no resting box.
  - `link` — an Astro action inside, or beside, running text. It stays
    underlined, has no box, and uses the neutral button foreground ladder.
  - **Do not hand-author `.btn` at a call site.** Pass `variant` to
    `ActionLink`; the component writes both classes and the checker rejects raw
    CTA class lists elsewhere.
  - The base carries `border: 1px solid transparent` so a filled button and an
    outlined one are the same height. Without it the primary sits 2px shorter,
    which is only visible once two variants stand side by side — by which time
    the base is load-bearing everywhere.
  - **`.btn--link` sets `display: inline`, and that is load-bearing.** The base
    is `inline-flex`, which cannot break across lines; mid-sentence that pushes
    the whole label onto one line and blows the paragraph sideways. It also
    resets `font-size` to `inherit`, so a link in body copy follows its
    surrounding type. It is the one variant that appears inside text.
  - **Markdown links get the link variant through `.prose a`**, grouped into
    the same rule rather than written twice — a case-study `<a>` cannot carry a
    class, exactly as with `.prose table`. They join at the *variant*, never at
    `.btn`: the base is a box and a prose link is not.
  - **Button component roles map directly to neutral primitives in `:root` and
    `.dark`.** Page palettes do not override them. This keeps current CTAs calm
    and deliberately leaves Sage and Blue button direction open for future
    design work.
  - Boxed public CTAs grow to `--control-height-touch` on a coarse pointer while
    preserving their compact fine-pointer presentation. The inline link
    variant is excluded because it must wrap like the sentence around it.
  - Loading is distinct from disabled: the React button retains its variant,
    preserves the content box, marks itself busy and blocks reactivation while
    remaining focusable. Disabled controls use the neutral disabled roles.
  - The header nav and the footer are deliberately **not** buttons. They are
    site furniture with their own quiet treatment (`--text-secondary`, no
    underline); giving them `.btn--link` would make both louder than the
    content they frame.
  - The theme shortcut keycap is an affordance inside the theme toggle's one
    click target, not a standalone action or a fourth public button variant.
    It is square and borderless, uses the shared raised effect at rest, the
    raised-hover effect on pointer hover and keyboard focus, and the pressed
    effect for both pointer press and the physical `L` key. The visible `L` is
    hidden from assistive technology because the button owns the action label
    and declares `aria-keyshortcuts="L"`.
- **Long-form text is capped to the reading measure.** `.prose` applies
  `var(--container-measure)` to `p`/`ul`/`ol`/`blockquote` only, so images and
  code blocks still run the full width of their wrapper.
- **Wrapping is set once in the base layer**: `text-wrap: balance` on
  headings, `pretty` on paragraphs. Don't repeat either at a call site.
- Numbers that sit in a column or change at runtime get `tabular-nums`.
- **One page container: 1300px of content** (`--container-page`, 81.25rem),
  plus the 20px safe inset carried by `Container`. At a 1440px viewport the
  inner content runs from x=70 to x=1370; below the cap it keeps 20px at each
  side. Header, footer and every page use it, so everything sits on the same
  two vertical edges. `Container` has **no size prop** — a second container
  width is how a layout starts drifting.
- **`max-w-measure` is not a container.** It is the shared 36rem reading
  measure for long-form text and lead paragraphs. It lives in the
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
- **Compact site furniture keeps a 48px hit area without taking 48px of
  layout.** Header navigation, the wordmark, footer links and the theme toggle
  use `.site-hit-target`; its absolutely positioned pseudo-element expands hit
  testing to `--control-height-touch` in both axes without changing header
  height or spacing. Do not replace it with padding at individual call sites.
- **Three readable text levels, all measured.** `--text-primary` (14.35:1 light,
  12.55:1 dark) and `--text-secondary` (8.23:1 / 6.95:1), checked against
  both the page background and the card surface, carry ordinary portfolio
  copy. `--text-tertiary` is reserved for compact supporting labels and uses
  separate accessible intermediate stops: 5.08:1 / 5.06:1 on the canvas and
  5.41:1 / 4.62:1 on raised surfaces. Placeholder text shares those measured
  mappings. The wider canonical vocabulary remains reserved for the semantic
  situations named by each token.
- **Structural and interactive rules are different jobs.** `--border-primary`
  and `--border-tertiary` may stay quiet when a line only divides content.
  Controls whose outline communicates affordance use `--border-interactive`,
  measured at 4.08:1 / 3.89:1 on the canvas and 4.35:1 / 3.54:1 on raised
  surfaces. Blue supplies the same contract at 4.47:1 / 4.01:1 and 4.71:1 /
  3.63:1. Hover moves to the stronger `--border-hover`; never strengthen every
  divider to solve a control-boundary problem.
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
  - **Measured on the neutral buttons**, rest → hover → pressed: primary is
    12.05 → 15.41 → 19.58 light and 6.95 → 12.55 → 18.13 dark. Secondary is
    13.47 → 17.87 → 10.65 light and 12.55 → 15.41 → 13.26 dark; its resting
    boundary remains 4.08:1 / 3.89:1 and strengthens in interactive states.
    Link is 13.47 → 16.78 light and 12.55 → 16.90 dark. Label readability and
    state visibility are reviewed separately; a high text-contrast number does
    not prove that two surfaces look different.
  - **`--background-hover` brightens in both themes**, to white on light and
    neutral-700 on dark, rather than changing direction between modes. It was
    `neutral-200`, which laid a heavy grey band under a hovered row; one step
    off the page background is enough when the rules and the text are moving
    with it.
- **Never dilute a text colour with an alpha** (`text-foreground/90`). It
  invents an undeclared colour outside the token system and quietly costs
  contrast — prose body was rendering at 10.66:1 instead of 14.35:1. If a
  softer colour is wanted, that is `--text-secondary`.
- **Ambient effects belong to media, not the page.** Clip them to the image
  that gives them meaning, keep them non-interactive and absent from the
  accessibility tree, and derive their colour from an existing semantic role.
  Motion must stop when the media is offscreen or the document is hidden;
  reduced-motion gets one deliberate still frame rather than an empty hole.
  Cap resolution and frame rate, and let the underlying image remain the
  complete fallback if the rendering API is unavailable. The homepage rain
  overlay is the reference implementation.
- **`pnpm check` enforces the mechanical rules** (`scripts/check-conventions.mjs`,
  run in CI before the build). It covers raw spacing steps, raw type sizes,
  call-site tracking/leading/weight, unapproved font weights, non-zero
  letter-spacing, physical direction properties, alpha-diluted colours, raw
  hex in components, inline layout, raw public-page grid columns, the retired
  auto-fit Grid API, unsupported primitive gaps, corner radius, bare tables,
  variant-less buttons, retired type steps, and eyebrows. Structural audits
  additionally cover unresolved custom-property references, tokenized motion
  and type literals, ProjectCard heading-level contracts, shared site hit
  targets, and generated design-bundle parity.
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
