# Design sync notes

## This is an off-script, tokens-only sync

This repo is an Astro **website**, not a component library, so the
`/design-sync` converter (which bundles a compiled `dist/` of React
components) does not apply. There are zero React components to ship.

Per the skill's allowance for repos outside the converter's envelope, the
bundle is produced by hand and contains **only the colour tokens**:

- `ds-bundle/styles.css` — entry the app reads; `@import`s the tokens.
- `ds-bundle/tokens/tokens.css` — primitives + semantic tokens + `.dark`
  overrides, extracted verbatim from `src/styles/global.css`.
- `ds-bundle/tokens/colours.html` — the one preview card (`@dsCard`),
  a palette catalog mirroring the site's `/style-guide` page.

No `_ds_bundle.js`, no `components/**`, no `_vendor/**` — there are no
components. No `_ds_sync.json` anchor is written (off-script, no story
facts), so the next sync re-verifies from scratch, which is correct.

## To re-sync after changing tokens

The source of truth is `src/styles/global.css`. When tokens change there,
regenerate `ds-bundle/tokens/tokens.css` to match, refresh the swatches in
`colours.html`, and re-run the upload to project
`8b771c23-a549-49dc-b6b2-5189d309df80` (pinned in config.json).

## Follow-up

`--background-elevated` (card surface: white / neutral-700) exists here but
is not yet in the Figma variables — mirror it into Figma.
