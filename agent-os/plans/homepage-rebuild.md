# Homepage Rebuild

## Status

Complete — shipped 2026-07-24. Built the full layout-primitive system and
rebuilt the homepage + nav on top of it. Heading confirmed as "Monsoon
Projects 2026".

## Context

The homepage is still the neutral scaffold: a narrow (`max-w-content`, 768px)
single-column hero with `name` + `description`, then a 3-slice project grid.
Anuj provided a Webflow mockup for the direction he wants: a wide, two-column
editorial hero with a restyled nav. This rebuild adopts that layout using the
site's own tokens and systems (colour, spacing, type, containers) — not the
mockup's fonts/colours.

Decisions already made with Anuj (2026-07-24):

- **Nav:** About / Work / Connect (not the mockup's "Now" — Work keeps the
  portfolio reachable; Connect links to a contact section, no orphan pages).
- **Role line:** "Brand & Growth Designer" — NOT the mockup's "Design Lead at
  BrowserStack" (that contradicts the site and is an unverified claim).
- **Hero image:** neutral token-styled placeholder block, real asset later.

## Desired Outcome

- A wide, two-column homepage hero matching the mockup's structure, rendered
  entirely from our tokens so it themes light/dark automatically.
- A restyled global nav: wordmark left, `About | Work | Connect` with divider
  pipes right, theme toggle retained.
- Projects grid below the hero, on the wide container.
- No new raw values — spacing, type, container, colour all come from tokens.
- Responsive: two columns collapse to one on mobile; verified at 4 widths.

## Approach

Build with token utilities directly (no new layout-primitive components this
pass — see Out). Everything sits on `max-w-wide` (1280px) with `px-gutter`.

### Nav (`Header.astro` + `site-config.ts`)

- `site-config.nav` → `[About /about, Work /work, Connect /#connect]`.
  The wordmark already links home, so "Home" is dropped intentionally.
- Header container widens `max-w-content` → `max-w-wide` to align with the
  hero edges (inner pages keep their own narrower content width).
- Nav items separated by thin vertical divider pipes (`border-l border-border`
  spacers), matching the mockup. Wordmark left, nav+toggle right.
- **Theme toggle stays** (the mockup omits it, but it's a real feature — light
  the site can't otherwise switch). Placed after Connect.
- `Connect → /#connect` resolves from any page to the homepage contact
  section, so it's never a dead link.

### Hero (`index.astro`)

Two-column grid inside `max-w-wide`, `gap` from scale, stacking to one column
below `lg`:

- **Left column:**
  - Eyebrow: vertical accent bar + `text-label` "Personal Site"
    (`border-l-2 border-accent pl-*`).
  - Heading: `text-display` — **"Monsoon Projects 2026"** (see Open question).
  - Info box: bordered container, two rows split by a divider —
    row 1 `text-body` "Brand & Growth Designer", row 2 a "Connect" link
    (`→ #connect`). Mirrors the mockup's box.
- **Right column:** placeholder block, `aspect-[16/10]`, `bg-background-
  secondary` + `border`, sized to fill the column. Swap for a real image later
  via a simple `heroImage` prop.

### Contact section (`index.astro`, `id="connect"`)

A `section#connect` on the wide container: short "Connect" heading + email and
GitHub links (LinkedIn when Anuj adds it). This is the nav Connect target.

### Projects grid (`index.astro`)

Keep the featured-projects logic; restyle onto `max-w-wide`, two columns,
`gap-grid`. Shows whatever real projects exist (currently just the sample).

## Scope

In:

- `src/components/layout/Header.astro` — restyle, widen, divider pipes
- `src/data/site-config.ts` — nav items
- `src/pages/index.astro` — new hero, contact section, restyled grid
- Verify at mobile / tablet / desktop / wide, light + dark

Out:

- **Layout primitive components** (`Section`/`Container`/`Stack`/`Grid`) —
  still a worthwhile future refactor, but building them is its own scope; this
  pass uses token utilities so the homepage ships without that dependency.
- Inner pages (About, Work, case study) — untouched; they keep their current
  narrower layout. Only the shared Header changes for them (wider bar).
- A real hero image asset.
- The `/work` index redesign.

## Files To Modify

- `src/components/layout/Header.astro`: nav restyle + width
- `src/data/site-config.ts`: nav array
- `src/pages/index.astro`: hero, contact, grid

## Steps

- [ ] Anuj approves this plan + confirms the hero heading (Open question)
- [ ] Update nav in site-config
- [ ] Restyle Header (wide, pipes, toggle retained)
- [ ] Rebuild index.astro hero + contact + grid on tokens
- [ ] `corepack pnpm build`
- [ ] Screenshot mobile/tablet/desktop/wide × light/dark; check no h-scroll
- [ ] Show Anuj; adjust; deploy

## Open Question

**The hero heading.** The mockup reads "Monsoon Projects 2026". I'll use it
verbatim unless told otherwise, but it may be mockup flavour rather than your
real H1 — confirm, or give me the heading you want. Trivial to change.

## Review

- Design: does the two-column rhythm and display scale read like the mockup?
- Content: heading confirmed; role line correct; no unverified claims.
- Architecture: token-only, no raw values; nav has no dead links.
- Verification: 4-width × 2-theme screenshots, no horizontal scroll.

## Learnings

- Built the primitive system (`src/components/primitives/`: PageWrapper,
  Section, Container, Stack, Cluster, Grid) with all layout CSS in
  global.css's "Layout primitives" section. Adapted the layout-primitives
  skill to THIS repo: Container sizes are narrow/content/wide (our
  `--container-*` tokens), and Container carries the horizontal gutter so no
  global PageWrapper is needed — legacy pages keep working untouched
  (incremental adoption, no double-padding).
- The asymmetric hero (text | image) uses `<Grid min="360px">`, not a media
  query: auto-fit collapses it to one column at ≤768px. The
  `minmax(min(<min>, 100%), 1fr)` guard kept mobile at zero horizontal
  overflow (verified 0px at 375).
- Header/Footer were migrated to primitives (Container + Cluster) and widened
  to `wide`; inner page bodies (About, Work, case study) were left on their
  existing utility layout — a future pass can migrate them for perfect
  left-edge alignment with the wide header.
- Verified via the four-width loop (375/768/1024/1440) × light+dark, plus a
  scripted overflow check. No regressions; console clean.
