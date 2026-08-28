# Colour Tokens — Anuj Prajapati

This is the portfolio's generated, colour-only design-system bundle. The
website itself contains Astro and React components; those components are
intentionally outside this bundle's configured `tokens-only` shape.

## Source of truth

`src/styles/global.css` is the implementation source of truth and imports the
authored page-palette remaps from `src/styles/themes/`. Never edit
`tokens/tokens.css` or `tokens/colours.html` by hand.

Regenerate both files after a colour-system change:

```bash
pnpm sync:design-bundle
```

`pnpm check` also compares the generated output with the checked-in bundle and
fails when they drift.

## How to use

`styles.css` imports the complete generated token file. Prefer semantic roles
over primitives so appearance changes remain automatic and each component
keeps its intended relationship to page palettes.

- Canonical semantics: `--bg-*`, `--text-*`, `--icon-*`, and `--border-*`.
  Use `--border-interactive` for a control boundary that communicates
  affordance; keep `--border-primary` and `--border-tertiary` for structure.
- Button semantics: `--button-*`. These roles share one neutral hierarchy in
  light and dark appearance and intentionally do not remap under Blue or Sage
  page palettes.
- Portfolio aliases: `--background-*`, `--text-reading`,
  `--text-interactive`, `--decorative-accent`, and the Tailwind/shadcn aliases
  currently consumed by the site.
- Primitives: Neutral, Brown, Amber, Blue, Green, Sage, Red, and Yellow.

Example:

```html
<article style="background: var(--bg-quaternary);
                color: var(--text-primary);
                border: 1px solid var(--border-primary);">
  <h3>Card title</h3>
  <p style="color: var(--text-secondary);">Secondary copy.</p>
</article>
```

## Appearance and page palettes

Add `.dark` to the root element for dark appearance. Primitives remain fixed;
the complete semantic set remaps.

Page identity is independent from appearance. Set `data-palette="blue"` or
`data-palette="sage"` on the root element, optionally together with `.dark`.
The default palette needs no attribute. Page palettes remap structural and
content colours; neutral button roles only respond to light or dark
appearance.

The generated Colours preview catalogs every primitive, base semantic token
and button role. It also confirms that the Blue and Sage structural remaps ship
in the bundle without defining palette-specific button themes.
