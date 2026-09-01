# Standard Switch Refinement

## Status

Superseded by `switch-system-promotion.md`

## Context

The shared experiment switch uses an unusually wide outlined track, its thumb
travel does not account cleanly for the border box, and the Sage checked track
has too little separation from dark experiment panels. It does not read like a
familiar platform/design-system switch in both appearance modes.

## Desired Outcome

Every experiment uses one conventional 32×20 track-and-thumb switch with clear
off/on positions, strong state contrast, correct RTL travel, and unchanged
keyboard/touch behaviour.

## Approach

Adapt the official shadcn Base UI switch proportions and state anatomy to the
portfolio's semantic tokens. Keep the existing Base UI wrapper and shared CSS;
do not import a second component implementation or copy shadcn's unrelated
theme utilities.

## Scope

In:

- Standard 32×20 track and 16px circular thumb.
- Neutral off state and inverse filled on state in light/dark/page palettes.
- Correct checked translation and RTL mirroring.
- Existing focus, disabled, touch-target and reduced-motion behaviour.
- Durable switch guidance and visual verification.

Out:

- Header theme toggle changes.
- New switch sizes, labels, dependencies, or experiment logic.
- Changes to other controls.

## Files To Modify

- `src/styles/global.css`: correct the shared switch geometry roles.
- `src/styles/ui-controls.css`: adopt the standard visual/state treatment.
- `agent-os/conventions/styling.md`: document the shared switch contract.
- `agent-os/plans/standard-switch-refinement.md`: record scope and review.

## Steps

- [x] Correct shared switch geometry and state styling.
- [x] Update the durable convention.
- [x] Run checks/build and verify on/off in light and dark mode.

## Review

- Design: Familiar proportions and obvious state without introducing a new
  visual language.
- Content: Unchanged.
- Architecture: Existing Base UI wrapper and semantic tokens remain the source
  of truth.
- Verification: `pnpm check`, `pnpm build`, keyboard/state interaction, and
  light/dark mobile plus desktop review.

## Learnings

The switch should follow the familiar design-system anatomy while still using
portfolio semantics: `--border-interactive` provides an accessible neutral off
track, `--background-alternate` supplies a high-contrast on track, and thumb
position remains the non-colour state signal. This is now captured in the
active styling convention, so no separate learning note is needed.
