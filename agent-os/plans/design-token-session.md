# Design Token Session — Anuj's Palette

## Status

Planned

## Context

The site launched with a deliberately neutral placeholder palette (single-tier
OKLCH values in `src/styles/global.css`). Anuj has now provided his actual
design system from Figma: seven primitive color families and a semantic layer
(background / border / link / text roles) with explicit light ("Base") and
dark mode mappings. This session makes the site render from that system.

Decisions made with Anuj (2026-06-12):

- **Typeface:** Geist stays for now; fonts are a follow-up session.
- **Default theme:** keep following the device setting.
- **Links:** follow Figma — links are text-colored with underlines, not blue.
- **Scope:** tokens only; the homepage redesign in the mockup is a separate
  future plan.

## Desired Outcome

- Every color on the site comes from Anuj's palette, in both light and dark
  mode, with no layout changes.
- Tokens are two-tier: primitives (exact Figma hex values, defined once) and
  semantic tokens (Figma's names, referencing primitives via `var()`).
- Saying "change background secondary" in a future session maps 1:1 to the
  Figma variable of the same name.
- `/style-guide` shows the primitive families and the semantic mappings the
  same way Figma does.

## Approach

**Tier 1 — Primitives** in `:root`, exact hexes from Figma, never re-mapped:

| Family | Steps |
| --- | --- |
| Neutral | black, 900 `#0e0f12`, 800 `#141619`, 700 `#1c1f24`, 600 `#21252b`, 500 `#2c323a`, 400 `#434b56`, 300 `#99a1ac`, 200 `#d3d7dd`, 100 `#f6f7f8`, white |
| Brown | 600 `#2e2d2c`, 500 `#302f2e`, 400 `#595551`, 300 `#847b73`, 200 `#aba199`, 100 `#cfc7c1`, 50 `#f1eeec` |
| Amber | 400 `#7c370e`, 300 `#e66c24`, 200 `#ee9a68`, 100 `#f5c2a3` |
| Blue | 600 `#002c83`, 500 `#1841ac`, 400 `#1e50d3`, 300 `#99b6ff`, 200 `#dae5ff`, 100 `#f0f3ff` |
| Green | 400 `#1a4723`, 300 `#37954a`, 200 `#53c069`, 100 `#b4e4be` |
| Red | 400 `#67090a`, 300 `#ec2426`, 200 `#f2696a`, 100 `#f7a1a2` |
| Yellow | 600 `#853e0f`, 500 `#d17600`, 400 `#ffb700`, 300 `#ffd293`, 200 `#ffe9d0`, 100 `#fff5f5` |

**Tier 2 — Semantic tokens**, Figma names kebab-cased, light values in
`:root`, dark re-maps in `.dark`, always `var(--primitive)`:

| Token | Light | Dark |
| --- | --- | --- |
| `--background-primary` | neutral-100 | neutral-800 |
| `--background-secondary` | neutral-200 | neutral-600 |
| `--background-tertiary` | yellow-500 | yellow-500 |
| `--background-alternate` | neutral-800 | neutral-100 |
| `--background-success` | green-100 | green-100 |
| `--background-warning` | yellow-200 | yellow-200 |
| `--background-error` | red-100 | red-100 |
| `--background-hover` | neutral-200 | neutral-600 |
| `--border-primary` | neutral-300 | neutral-500 |
| `--border-secondary` | brown-200 | brown-400 |
| `--border-alternate` | neutral-500 | neutral-300 |
| `--border-hover` | neutral-800 | neutral-100 |
| `--link-primary` | = text-primary | = text-primary |
| `--link-secondary` | neutral-800 | neutral-100 |
| `--link-alternate` | neutral-100 | neutral-800 |
| `--text-primary` | neutral-600 | neutral-200 |
| `--text-secondary` | brown-400 | brown-200 |
| `--text-alternate` | neutral-100 | neutral-800 |
| `--text-success` | green-400 | green-400 |
| `--text-warning` | yellow-600 | yellow-600 |
| `--text-error` | red-400 | red-400 |

**Tier 2b — Compatibility aliases.** The existing shadcn/Tailwind semantic
names stay, pointed at the Figma tokens, so no component file needs editing
and future shadcn components keep working:

| Existing alias | Now points at | Judgment call? |
| --- | --- | --- |
| `--background` | background-primary | |
| `--foreground` | text-primary | |
| `--card` | background-elevated | revised per Anuj's review: cards sit one subtle step off the page (white / neutral-700), not the full secondary step. `--background-elevated` is a new semantic token not yet in Figma — mirror it there. |
| `--card-foreground` | text-primary | |
| `--muted` | background-secondary | |
| `--muted-foreground` | text-secondary | yes — secondary text goes warm brown |
| `--border` / `--input` | border-primary | |
| `--accent` | text-secondary | yes — hover color on links/card titles becomes warm brown instead of blue |
| `--accent-foreground` | text-alternate | |
| `--primary` / `--primary-foreground` | background-alternate / text-alternate | |
| `--secondary` / `--secondary-foreground` | background-secondary / text-primary | |
| `--destructive` | text-error | |
| `--ring` | border-hover | yes — focus outlines become high-contrast neutral |
| `--popover` / `--popover-foreground` | background-primary / text-primary | |

The three "judgment call" rows are choices Figma doesn't dictate — flag for
Anuj's eye during visual review.

## Scope

In:

- Token block rewrite in `src/styles/global.css` (primitives, semantic,
  aliases, Tailwind `@theme` exposure for the new names).
- `/style-guide` color section rebuilt to show primitive families and the
  semantic table with Figma names, light/dark.
- Visual verification of every page in both modes.

Out:

- Fonts (Geist stays), type scale, spacing, radii.
- Homepage redesign from the mockup (separate plan).
- New pages (Now, Connect), nav changes.
- Any component or layout restructuring.

## Files To Modify

- `src/styles/global.css`: replace placeholder token block with two-tier system
- `src/pages/style-guide.astro`: catalog primitives + semantic mappings

## Steps

- [ ] Anuj approves this plan (especially Scope and the judgment calls)
- [ ] Write primitives, semantic tokens, aliases, `@theme` block
- [ ] Rebuild style-guide color sections
- [ ] `corepack pnpm build` passes
- [ ] Preview: screenshot every page, light and dark; check text contrast
- [ ] Show Anuj screenshots; adjust judgment calls if needed
- [ ] Deploy and verify live

## Review

- Design: does the warm brown secondary/hover treatment match the mockup's feel?
- Content: n/a
- Architecture: two-tier discipline per the colour-token skill; aliases keep shadcn compatible
- Verification: build + both-mode screenshots of all five pages

## Learnings

To capture after completion: any contrast fixes needed, and the
Figma-name-to-Tailwind-utility mapping convention.
