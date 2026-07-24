# Spacing & Type Scale

## Status

Complete — shipped 2026-07-23. Type scale simplified to one font + sizes
only, and Geist Mono retired site-wide (kept only as a code fallback) per
Anuj's follow-up.

## Context

Colour is fully tokenized; nothing else is. Every size on the site is a raw
Tailwind utility, so there is no vocabulary to specify a design in. Evidence
from the current codebase:

- `px-6` appears 9× and `max-w-3xl` 9× — the page shell is re-typed in every
  page file instead of being a component.
- Spacing values in use: `4, 8, 16, 24, 32, 40, 48, 80, 96px` — roughly a
  4px base, but with redundant neighbours (40 *and* 48, 80 *and* 96) and no
  names.
- Type sizes are Tailwind defaults (`text-5xl/4xl/2xl/lg/base/sm/xs`) with no
  defined line-heights or tracking.
- Only one container width exists (`max-w-3xl`, 768px), but the mockup's
  projects grid clearly needs a much wider one.

Consequence: a design brief can't say "section padding" or "grid gap" and
mean anything exact, so values get hardcoded and drift.

## Desired Outcome

- A named spacing scale and type scale live in `src/styles/global.css` as
  tokens, following the same two-tier discipline as colour.
- A brief can be written in token names ("section rhythm `space-section`,
  cards gap `space-md`") with zero ambiguity.
- `/style-guide` catalogs both scales visually.
- Future sessions need no re-explanation — the tokens are the contract.

## Approach

Mirror the colour architecture exactly: **primitives** (raw steps) plus
**semantic** tokens (named roles that reference them).

### Tier 1 — Spacing primitives

4px base. Normalizes today's 40→48 and 80→96 so neighbours stop competing.

| Token | rem | px | Replaces today's |
| --- | --- | --- | --- |
| `--space-3xs` | 0.25 | 4 | `mt-1`, `gap-1` |
| `--space-2xs` | 0.5 | 8 | `mb-2`, `mt-2` |
| `--space-xs` | 0.75 | 12 | — |
| `--space-sm` | 1 | 16 | `gap-4`, `mb-4` |
| `--space-md` | 1.5 | 24 | `px-6`, `mb-6`, `gap-6` |
| `--space-lg` | 2 | 32 | `mb-8`, `py-8` |
| `--space-xl` | 3 | 48 | `pt-12`, `mb-12`, `py-10`* |
| `--space-2xl` | 4 | 64 | — |
| `--space-3xl` | 6 | 96 | `pb-24`, `pt-20`* |
| `--space-4xl` | 8 | 128 | — |

\* deliberate normalization: `py-10` (40) → 48, `pt-20` (80) → 96.

### Tier 2 — Semantic spacing

The tokens a brief actually names. Change one, the whole site follows.

| Token | Value | Role |
| --- | --- | --- |
| `--space-gutter` | `--space-md` (24) | page side padding (today's `px-6`) |
| `--space-section` | `clamp(3rem, 8vw, 6rem)` | vertical rhythm between sections — fluid, so mobile shrinks automatically |
| `--space-stack` | `--space-sm` (16) | default gap between stacked elements |
| `--space-card` | `--space-md` (24) | card interior padding |
| `--space-grid` | `--space-sm` (16) | gap between grid/cards |

### Container widths

| Token | Value | Used for |
| --- | --- | --- |
| `--container-narrow` | 36rem (576) | lead paragraphs (today's `max-w-xl`) |
| `--container-content` | 48rem (768) | case-study body (today's `max-w-3xl`) |
| `--container-wide` | 80rem (1280) | homepage + projects grid (per mockup) |

### Type scale

**One font (Geist Sans), sizes only.** No per-role tracking or weight in the
tokens — apply weight or uppercase as ordinary utilities where a specific
design needs them. Display and h1 are fluid so a 72px hero doesn't overflow
a phone.

| Token | Size |
| --- | --- |
| `--text-display` | `clamp(2.5rem, 8vw, 4.5rem)` → 40–72px |
| `--text-h1` | `clamp(2rem, 5vw, 3rem)` → 32–48px |
| `--text-h2` | 2rem → 32px |
| `--text-h3` | 1.5rem → 24px |
| `--text-lead` | 1.125rem → 18px |
| `--text-body` | 1rem → 16px |
| `--text-small` | 0.875rem → 14px |
| `--text-label` | 0.75rem → 12px |

Each size ships with a sensible default line-height (tight for display and
headings, roomy for body) so large text doesn't break. These are
implementation defaults, not knobs to manage.

Naming note: `--text-*` already exists for colour roles (`--text-primary`),
so sizes get namespaced at build time (Tailwind `text-display` etc.).

**Open question, deliberately out of scope here:** the site currently uses a
second font, Geist Mono, for section labels, the header wordmark and card
metadata. "One font" implies retiring it — but that visibly changes the live
site, so it's a separate decision from adding these tokens.

### Breakpoints

Keep Tailwind defaults (`sm 640 / md 768 / lg 1024 / xl 1280`). Fluid
`clamp()` on section rhythm and display type means few explicit breakpoints
are needed.

## Scope

In:

- Spacing primitives + semantic spacing tokens in `global.css`
- Container width tokens
- Type scale tokens (sizes only, one font), exposed via `@theme`
- `/style-guide` sections cataloging both scales

Out:

- **Typeface choice** — Geist stays; the scale is font-agnostic and survives
  a later typeface swap.
- **Retiring Geist Mono** from existing components — see the open question
  above; that's a visual change to the live site, decided separately.
- **Layout primitives** (`PageWrapper`/`Section`/`Container`/`Stack`/`Grid`)
  — these consume the tokens and are the natural *next* plan.
- Refactoring existing pages onto the new tokens — separate pass, so this
  change is purely additive and can't regress the live site.
- Homepage redesign.

## Files To Modify

- `src/styles/global.css`: add spacing/container/type tokens + `@theme` exposure
- `src/pages/style-guide.astro`: catalog both scales
- `agent-os/conventions/styling.md`: record the scales as the convention

## Steps

- [ ] Anuj reviews and edits the numbers
- [ ] Add tokens to `global.css` (additive only — no page changes)
- [ ] Resolve the `--text-*` namespace collision
- [ ] Catalog in `/style-guide`
- [ ] `corepack pnpm build` + screenshot both themes
- [ ] Follow-up plan: layout primitives that consume these tokens

## Review

- Design: do the section rhythm and display size match the mockup's feel?
- Architecture: two-tier discipline matches colour; additive so nothing regresses
- Verification: build + style-guide screenshots

## Learnings

- **Tailwind v4 `@theme inline` vs `@theme`:** custom scale tokens must go in
  a plain `@theme {}` block. Putting `--spacing-*` / `--container-*` in the
  existing `@theme inline {}` block *replaced* Tailwind's built-in scales, so
  `max-w-3xl` collapsed to 96px and broke every page's layout. A plain
  `@theme {}` block *adds* to the built-ins.
- **Never reuse a built-in utility name:** `max-w-prose` is a Tailwind
  built-in (65ch, font-dependent). Our `--container-prose: 48rem` looked like
  it worked but silently resolved to 65ch. Renamed to `--container-content`.
  Lesson: name custom scale keys distinctly from anything Tailwind ships.
- Fluid `clamp()` on display type and section rhythm did remove the need for
  per-breakpoint overrides — no responsive spacing utilities were needed.
- Both regressions were caught only by the screenshot + computed-value checks,
  not by the build (which passed clean throughout). Visual verification is
  load-bearing for token work.
