# Neutral Button System

## Status

Implemented

## Context

The portfolio currently has two visually related button implementations: Astro
links styled with `.btn` and stateful React controls styled with `.ui-button`.
Their hierarchy is broadly correct, but their state contracts have drifted.
The public primary changes from almost black to black in light mode and almost
white to white in dark mode, while the React primary unexpectedly changes from
neutral to Sage only while pressed. Public buttons also reuse hover for press,
the guided-panel next action is understated, the send action has no shared
loading presentation, and the homepage preview buttons lack complete pointer
feedback.

The colour direction is deliberately neutral. Sage and Blue page palettes are
future design explorations and are not inputs to this batch.

## Desired Outcome

- Primary, secondary, quiet and text-link actions form an obvious hierarchy.
- Neutral primary CTAs have visibly distinct rest, hover and pressed states in
  light and dark mode, with no white-to-white or hue-changing transitions.
- Astro action links and React buttons use the same visual state vocabulary
  while retaining implementations appropriate to their runtimes.
- Loading, disabled, focus and coarse-pointer behavior are predictable without
  adding specialist modes or speculative variants.
- The style guide, conventions, generated design bundle and automated checks
  describe and protect the shipped system.

## Approach

Add a small set of button-specific semantic colour roles mapped directly to
the existing neutral primitives for light and dark mode. Use those roles in
both button runtimes, with separate hover and pressed selectors. Introduce one
typed Astro `ActionLink` wrapper for boxed and inline CTA links, and extend the
existing React `Button` with a loading contract that preserves its geometry and
focus. Correct action hierarchy at current call sites and finish the preview
thumbnail button states using existing neutral roles.

## Scope

In:

- Neutral CTA colours for default light and dark appearance.
- Primary, secondary, quiet and link hierarchy.
- Rest, hover, pressed, focus, disabled and loading behavior where applicable.
- A typed Astro action-link component and the existing React button primitive.
- Guided-panel action hierarchy, send loading feedback, public CTA touch
  height, and homepage preview-button hover/pressed/selected feedback.
- Style-guide specimens and state documentation.
- Automated checks for token mappings, contrast, CTA component usage and state
  coverage.
- Focused browser QA at desktop and narrow widths in neutral light and dark.

Out:

- Sage or Blue button mappings, palette-specific QA, or new palette stops.
- Content, copy, imagery, navigation, footer, wordmark, switch, tab, segmented,
  slider or theme-toggle redesigns.
- Forced-colour, increased-contrast, RTL or localization-specific additions.
- Danger buttons, new size variants, gradients, shadows or a new motion system.
- Changes to application behavior beyond the existing send action's visual
  loading contract.

## Files To Modify

- `src/styles/global.css`: neutral button roles, public CTA states, touch height
  and preview-button feedback.
- `src/styles/ui-controls.css`: React button states and loading presentation.
- `src/components/ui/button.tsx`: shared loading API and stable content anatomy.
- `src/components/ActionLink.astro`: typed public CTA link primitive.
- `src/pages/index.astro`, `src/pages/work/[...slug].astro`,
  `src/pages/play/[...slug].astro`, `src/components/EmbedFrame.astro`: adopt
  `ActionLink` without changing labels or destinations.
- `src/components/InteractionAnatomyLab.tsx`,
  `src/components/DemoPrimitivesSpecimen.tsx`: correct hierarchy and use the
  loading contract.
- `src/pages/style-guide.astro`: document tokens, hierarchy and state matrix.
- `agent-os/conventions/styling.md`,
  `agent-os/conventions/experiment-interfaces.md`: record the durable contract.
- `scripts/check-conventions.mjs`: protect CTA usage, mappings and contrast.
- `ds-bundle/`: regenerate the checked-in design-system bundle.

## Steps

- [x] Audit current public, React and preview-button states.
- [x] Add and verify the neutral button semantic roles.
- [x] Implement complete public and React action states.
- [x] Add `ActionLink`, loading anatomy and correct current hierarchy.
- [x] Finish preview-button pointer and selected feedback.
- [x] Update specimens, conventions and automated checks.
- [x] Regenerate `ds-bundle`.
- [x] Run checks, production build and focused browser QA.

## Review

- Design: Primary is clearly strongest; neutral state changes are visible but
  remain restrained; secondary, quiet and link actions do not compete.
- Content: Existing labels, destinations and imagery remain unchanged.
- Architecture: Each runtime keeps its appropriate component while sharing one
  neutral semantic state contract; no page palette is coupled to the buttons.
- Verification: `pnpm check`, `pnpm build`, and neutral light/dark browser checks
  at desktop and narrow widths all pass. Browser QA covered CTA rest, hover and
  keyboard focus, guided-action hierarchy, stable loading geometry, preview
  selection feedback and horizontal overflow. The available desktop browser
  reports a fine pointer, so the coarse-pointer media rules are protected by
  structural checks but still need confirmation on a physical touch device.

## Learnings

After implementation, update the existing styling and experiment-interface
conventions rather than creating a separate learning note unless browser QA
reveals a reusable failure mode not already covered there.
