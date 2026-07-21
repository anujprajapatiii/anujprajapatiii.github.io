# Colour Tokens — Anuj Prajapati

A colour-only design system: the palette from Anuj Prajapati's portfolio.
No components — style with these CSS custom properties.

## How to use

All colour lives in CSS custom properties, defined in `styles.css` (which
imports `tokens/tokens.css`). Reference them with `var(--…)`.

**Prefer semantic tokens over primitives.** Semantic tokens carry the design
intent and adapt to dark mode automatically; primitives are the raw palette.

- Semantic (use these): `var(--background-primary)`, `var(--background-secondary)`,
  `var(--background-elevated)` (cards), `var(--text-primary)`,
  `var(--text-secondary)`, `var(--border-primary)`, `var(--link-primary)`,
  plus state colours `--text-success` / `--text-warning` / `--text-error`
  and their `--background-*` counterparts.
- Primitives (raw scale, use only when no semantic token fits):
  `--neutral-100`…`--neutral-900` (+ `-black`/`-white`), `--brown-50`…`--brown-600`,
  `--amber-100`…`--amber-400`, `--blue-100`…`--blue-600`, `--green-100`…`--green-400`,
  `--red-100`…`--red-400`, `--yellow-100`…`--yellow-600`.

## Dark mode

Add `class="dark"` to an ancestor element. Semantic tokens remap themselves;
you do not write any dark-mode colours by hand. Primitives never change.

## Example

```html
<article style="background: var(--background-elevated);
                color: var(--text-primary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius); padding: 24px;">
  <h3 style="color: var(--text-primary);">Card title</h3>
  <p style="color: var(--text-secondary);">Secondary copy.</p>
  <a style="color: var(--link-primary);">A link</a>
</article>
```

The source of truth is `tokens/tokens.css`. See the "Colours" preview card
for the full palette with light/dark mappings.
