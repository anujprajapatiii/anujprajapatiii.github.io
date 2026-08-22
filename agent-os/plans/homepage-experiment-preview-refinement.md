# Homepage Experiment Preview Refinement

## Status

Complete

## Context

The homepage Experiments module has a useful interaction model: pointing at or
focusing a row selects that experiment and the adjacent pane holds the last
selection. Its current 16/8 split and three vertically stacked previews make
the right side much taller than the five-row index, leaving a large empty area
under the list and making the section feel visually unbalanced.

The approved mock keeps that interaction but contains it: a compact experiment
index sits beside one main preview and a three-thumbnail filmstrip. Preview
frames auto-advance through the filmstrip with a minimal accent loader.

The section-title accent is the alignment reference for selection state. It is
`--spacing-2xs` (8px) wide and uses `--decorative-accent`. The index accent must
reuse those exact values, not approximate them. The progress loader remains a
separate, deliberately thinner 2px treatment in the same accent colour.

## Desired Outcome

- The desktop module reads as one balanced rectangle with aligned top and
  bottom edges rather than a short list beside a tall media rail.
- The list uses roughly 14 of the existing 24 tracks and the preview uses 10.
- Each row is compact and text-led, with a smaller thumbnail and a single-line
  description.
- The selected row retains an 8px vertical brown strip identical in width and
  colour to the Experiments title marker. Hover and keyboard focus select a
  row; the strip stays on the last selected row when the pointer leaves.
- The preview contains one bounded main frame and a static three-thumbnail
  filmstrip.
- A 2px brown loader fills left-to-right beneath the active thumbnail, then
  advances the main frame and active thumbnail.
- Manual interaction always takes priority over autoplay, and reduced-motion
  users receive a stable manual experience.

## Approach

Refactor `PlayPreviewList` around two explicit state values: active experiment
and active frame. Keep row links as the primary navigation. On desktop, row
pointer entry or focus selects an experiment, resets its active frame to the
first available preview, and starts a four-second autoplay cycle.

Each active preview set will render one main media area and three thumbnail
buttons. The filmstrip stays still; only the main media and active state change.
The active thumbnail owns the progress track. Its 2px accent fill is animated
with a transform rather than width so progress does not trigger layout.

Manual thumbnail hover or focus immediately previews that frame and pauses the
cycle. Leaving an unpinned thumbnail restarts a full cycle on that frame so it
does not advance immediately after manual inspection. Clicking a thumbnail pins
it and stops autoplay until another experiment is selected. Autoplay also
pauses when the module leaves the viewport or the document becomes hidden.
Selecting a different experiment clears the pin and starts again from frame
one. Missing preview slots produce neither controls nor autoplay stops; the
cycle advances only through media that exists.

Keep swaps instant, consistent with the site's interaction convention. The
loader is autonomous progress feedback rather than a hover transition. Under
`prefers-reduced-motion: reduce`, do not animate or auto-advance; leave the
first frame active and preserve manual thumbnail controls. Continue respecting
the existing reduced-motion handling for preview videos.

Preserve progressive enhancement. Without JavaScript, rows remain working
links and the CSS row hover/focus fallback displays the selected experiment's
first preview. Hide the interactive filmstrip in that fallback so it never
exposes inert controls.

## Scope

In:

- Homepage Experiments module only.
- Desktop 14/10 list-to-preview balance on the existing 24-track grid.
- Compact row proportions and smaller thumbnails.
- Persistent selected-row accent using the title marker's existing 8px width
  and `--decorative-accent` colour.
- One main preview, three-thumbnail filmstrip, active-thumbnail state, and 2px
  progress loader.
- Four-second autoplay, manual pause/pin behavior, visibility pausing, and
  reduced-motion handling.
- Keyboard-accessible thumbnail buttons with unique labels and active state.
- Light and dark theme styling using existing semantic tokens.
- Durable styling-convention documentation for selection versus progress
  accents.

Out:

- The `/play` listing page and its shared project cards.
- Experiment content, preview assets, thumbnails, or content schemas.
- Changes to homepage section titles or the existing title marker itself.
- Mobile autoplay or a mobile preview pane; below the current 56rem breakpoint,
  the full-width linked list remains the complete experience.
- New global colour or spacing tokens.
- Fades, carousels that physically scroll, arrows, pagination dots, counters,
  or additional decorative controls.

## Files To Modify

- `src/components/PlayPreviewList.astro`: restructure each preview set, add
  accessible thumbnail controls, and manage experiment/frame/autoplay state.
- `src/styles/global.css`: implement the 14/10 layout, compact rows, 8px row
  selection strip, bounded preview, filmstrip, 2px loader, and reduced-motion
  rules.
- `agent-os/conventions/styling.md`: document that section selection strips
  reuse the title marker's exact width/colour while progress indicators may use
  a thinner component-local treatment.
- `agent-os/plans/homepage-experiment-preview-refinement.md`: track build and
  review status.

## Steps

- [x] Refactor preview markup into a main media region plus three labelled
  thumbnail buttons per experiment.
- [x] Preserve row links and the no-JavaScript first-preview fallback; expose
  the filmstrip only after enhancement.
- [x] Change the desktop split from 16/8 to 14/10 and bound the preview module
  so it aligns visually with the five-row index.
- [x] Reduce desktop row-thumbnail proportion while keeping titles and
  descriptions readable and truncation stable.
- [x] Add a reserved selected-row accent layer that is 8px wide, uses
  `--decorative-accent`, and does not shift row content between states.
- [x] Add active-frame state and ensure row hover/focus resets to frame one and
  persists after pointer leave.
- [x] Add a component-local four-second autoplay cycle with a transform-based
  2px loader under the active thumbnail.
- [x] Add manual thumbnail hover/focus preview, click-to-pin, and clear pinning
  when another experiment is selected.
- [x] Skip missing preview sources so the filmstrip never exposes inert buttons
  and autoplay only visits available frames.
- [x] Pause autoplay outside the viewport and while the document is hidden.
- [x] Disable autoplay and the loader animation under reduced motion while
  retaining manual controls and existing video safeguards.
- [x] Update the styling convention.
- [x] Run convention checks and production build.
- [x] Review desktop light/dark states, responsive list-only behavior, row and
  thumbnail pointer interaction, keyboard operation, autoplay/reset/pause,
  tab visibility, and reduced-motion behavior.

## Review

- Design: At the 1280px review viewport, the 14/10 split measures 719px / 511px
  and both list and pane measure 538px tall. The selected-row strip and section
  marker both compute to 8px and the same brown RGB value in light and dark;
  the loader computes to 2px.
- Content: Long descriptions retain their one-line truncation. Weathering and
  Voxel expose three uniquely labelled thumbnail buttons; experiments without
  preview sources expose no empty group or inert controls.
- Architecture: One component owns one active experiment and one active frame.
  It uses the platform Web Animations and Intersection Observer APIs rather
  than a carousel dependency, and the mobile list remains independent of the
  preview enhancement.
- Verification: `pnpm check` and `pnpm build` pass. Browser review confirmed
  light/dark rendering, exact measurements, one active row/set/frame, accessible
  pressed states, four-second advancement while visible, and progress pausing
  outside the viewport. Source review confirmed the below-56rem list-only and
  no-JavaScript first-frame fallbacks plus reduced-motion and visibility gates.

## Learnings

Updated `agent-os/conventions/styling.md` with the durable selection-versus-
progress accent rule. No separate learning note is needed: visibility pausing,
reduced motion, media loading, and pointer/keyboard parity stayed local to the
existing preview component rather than revealing a new cross-site pattern.
