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
- All colors are OKLCH design tokens in `src/styles/global.css`, defined for
  light mode in `:root` and dark mode in `.dark`.
- Components use semantic Tailwind tokens (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-card`, `border-border`, `text-accent`) — never
  raw hex values, named colors, or palette classes like `bg-zinc-100`.
- Dark mode is class-based with `.dark` on `<html>`; both modes must be
  checked for any visual change.
- Geist Sans for body text; Geist Mono for small labels and metadata
  (placeholder fonts until the token session).
- Section labels use mono, uppercase, small text with wide tracking.
- The `/style-guide` page must stay in sync with the token system — update it
  when tokens change.

## Related Files

- `src/styles/global.css`
- `src/pages/style-guide.astro`
- `src/components/`
- `src/layouts/`
