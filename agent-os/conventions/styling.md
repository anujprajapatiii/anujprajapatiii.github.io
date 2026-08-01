# Styling Conventions

> STATUS: Starter rules. The visual direction section is a placeholder until
> Anuj runs the design token session. The token *system* rules below are
> permanent.

## Visual Direction

TODO(Anuj): describe the feel in your own words after the token session.
Until then: neutral, minimal, content-first. Do not add decorative
complexity.

## Rules

- Tailwind CSS v4 is configured through the Vite plugin, not PostCSS.
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
- **One brand font: Geist Sans** for everything visible. `--font-mono` is a
  system fallback stack reserved for code only (inline `code` + code blocks)
  — never for labels, wordmarks, or metadata.
- **Spacing** uses the named scale (`p-md`, `gap-sm`, `py-xl`, …) or the
  semantic roles (`--spacing-gutter/section/stack/card/grid`) — not arbitrary
  Tailwind step numbers. 4px base; see `/style-guide`.
- **Type** uses the size tokens (`text-display/h1/h2/h3/lead/body/small/label`),
  sizes only; apply weight/uppercase as utilities where a design needs them.
- **Containers** use `max-w-narrow` (36rem), `max-w-content` (48rem),
  `max-w-wide` (80rem). NOTE: never name a custom container `prose` or reuse
  Tailwind's own scale keys — `max-w-prose` is a built-in (65ch) and a
  `--container-<key>` that matches a built-in silently overrides it. Custom
  scale tokens live in a plain `@theme {}` block (they add), never `@theme
  inline {}` (which replaces the built-in scale — this broke `max-w-3xl`).
- **Layout comes from primitives, never inline.** Compose pages as
  `Section > Container > Stack | Grid | Cluster` using the components in
  `src/components/primitives/`. Never inline `max-width`, `padding-block/
  inline`, `margin`, `display:flex/grid` for layout in a page or component —
  all layout CSS lives in global.css's "Layout primitives" section, driven by
  the spacing/container tokens. Container sizes: `narrow` / `content` / `wide`.
  Component CSS is for typography, colour, and component-internal details only.
- The `/style-guide` page must stay in sync with the token system — update it
  when tokens change.

## Related Files

- `src/styles/global.css`
- `src/pages/style-guide.astro`
- `src/components/`
- `src/layouts/`
