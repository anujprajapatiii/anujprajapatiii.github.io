# Design sync notes

## Configured shape

This repository is an Astro website with React interactive islands. The design
sync project is deliberately configured as `tokens-only`: application
components remain in the website, while the portable bundle carries the full
colour vocabulary and its preview.

The bundle contains:

- `ds-bundle/styles.css` — the entry stylesheet.
- `ds-bundle/tokens/tokens.css` — all primitives, canonical light/dark
  semantics, portfolio aliases, and Blue/Sage page-palette remaps.
- `ds-bundle/tokens/colours.html` — a generated catalog card.

There is no component distribution, `_vendor` tree, or compiled React bundle
because those are outside the configured shape—not because the website lacks
components.

## Regeneration

The implementation source of truth is `src/styles/global.css`; its imported
files in `src/styles/themes/` are part of the same source graph. Run:

```bash
pnpm sync:design-bundle
pnpm check
```

The generator owns both files under `ds-bundle/tokens/`. The convention checker
fails if checked-in output differs from the canonical sources.

## Figma relationship

Code is the runtime implementation source of truth. The corresponding Figma
variables are a design-documentation mirror of the base palette; they are not a
runtime dependency and there is no bidirectional automated sync. A base palette
change is complete when code, this generated bundle, and the documented Figma
variables agree. Authored page palettes remain code-owned remaps.

The design-sync project identifier remains pinned in `config.json`.
