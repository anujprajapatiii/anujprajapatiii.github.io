# Light And Shade System

## Status

Complete

## Context

The portfolio already separates canvas, inset, raised and raised-hover
surfaces through neutral tonal steps. This experiment tests whether a single
directional light model can make that depth easier to read without turning the
site into a shadow-heavy or decorative interface.

## Desired Outcome

Project cards, experiment rows and the desktop experiment preview should feel
like parts of one restrained material system in both light and dark
appearance. The sticky header retains its vanilla translucent treatment. The
effect should preserve the portfolio's square geometry, neutral palette,
instant interactions and content-first hierarchy.

## Approach

Keep the tonal surface ladder as the foundation. Add semantic highlight and
shade colours mapped separately for light and dark appearance, then compose
them into a small set of directional effects with a fixed top-left light
source. Raised surfaces receive fine highlight/shade edges and restrained
contact depth; pressed linked surfaces become subtly inset.

## Scope

In:

- Semantic light and shade colour roles for both appearances.
- Compound effect tokens for raised, hover and pressed states.
- Project cards, experiment rows and the desktop experiment preview pane.
- A style-guide specimen documenting the experiment.
- Light/dark, desktop/mobile and interaction-state review.

Out:

- Palette primitive changes or a new page palette.
- Buttons, tables, embeds and ordinary prose surfaces.
- Rounded geometry, gradients, glassmorphism or pointer-following light.
- New animation or JavaScript.

## Files To Modify

- `src/styles/global.css`: define and apply the light/shade system.
- `src/pages/style-guide.astro`: document semantic mappings and show the effect.
- `agent-os/conventions/styling.md`: record the adopted material rules.
- `agent-os/plans/light-and-shade-system.md`: track review and the decision.

## Steps

- [x] Select the tonal-depth plus edge-light direction and approve the scope.
- [x] Add light/dark semantic roles and compound effect tokens.
- [x] Apply the effects to the three representative surfaces.
- [x] Add a compact style-guide specimen.
- [x] Review both appearances, responsive layouts and interaction states.
- [x] Run convention checks and the production build.

## Review

- Design: confirm the light source reads consistently and stays subordinate to
  content.
- Content: no copy or content hierarchy changes.
- Architecture: components consume compound effects; colour roles still
  reference primitives.
- Verification: `pnpm check`, `pnpm build`, and browser review in light/dark
  mode.

The review confirmed that tone remains the main depth cue, while the fixed
top-left highlight adds hard-edged definition without soft or rounded shadow
halos. Light and dark appearances remain legible at desktop and mobile sizes,
and no horizontal overflow was introduced. The project-card hover and pressed
states preserve the existing instant interaction model. Experiment rows now
share the same raised and press effects as project cards. Desktop selection
changes the row's surface and accent marker without overriding the shared hover
shadow or changing the mobile list's selection semantics. Every hard shadow is
limited to a subtle one-pixel edge. The sticky header remains outside the
experiment and keeps its original translucent material without light/shade
effects.

## Learnings

The direction was approved and its durable material rules now live in
`agent-os/conventions/styling.md`. No system-map or cross-agent guidance change
is needed: the existing token and component architecture remains intact.
