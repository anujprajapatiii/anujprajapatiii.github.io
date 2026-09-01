# Slider Design Exploration

## Status

Complete — awaiting selection

## Design Question

Which neutral, boxy Slider treatment should become the portfolio system's
continuous-value control while remaining familiar, legible, and easy to use?

## Why It Matters

The shared Base UI Slider already supplies sound behavior, but it has no live
adopter and its current round, accented visual treatment does not yet match the
square neutral direction established by Actions, Tabs, and Switch.

## Shared Constraints

- Real content: a preview-scale setting with a live percentage and clear
  endpoints.
- Existing design tokens and primitives: the local Shadcn/Base UI `Slider`,
  Field anatomy, semantic colours, Apparat type roles, spacing, focus, and
  light/shade effects only.
- Required information or actions: label, description, current value, minimum,
  maximum, active control, and disabled example.
- Accessibility requirements: programmatic label, keyboard operation,
  focus-visible state, non-colour position cue, and a 48px coarse-pointer
  target.
- Responsive contexts: 320px through wide desktop without page overflow.
- Appearance and motion modes: light, dark, and reduced motion.

## Directions

| Direction | Idea being tested | Expected strength | Possible weakness |
| --- | --- | --- | --- |
| A — Block rail | Pair a familiar low rail with a compact square thumb and strong filled segment. | Clearest baseline and easiest to understand. | Least distinctive. |
| B — Calibrated rule | Add thin neutral ticks and a narrow index thumb to make position feel measured. | Strong precision and tactical character. | Detail may be unnecessary for loose values. |
| C — Inset channel | Place a raised square thumb inside a thicker recessed channel using the shared light/shade effect. | Strongest visibility and physical relationship. | Heavier than other portfolio controls. |

## Comparison Surface

- Worktree starting point: clean `main`
- Branch: `codex/slider-lab`
- Temporary route: `/lab/sliders`
- Temporary components: `src/components/lab/sliders/`

## Evaluation Criteria

- Information hierarchy: the current value reads first and the rail remains
  secondary.
- Fit with the portfolio's visual direction: square, neutral, restrained, and
  token-driven.
- Real-content resilience: the label, description, value, and endpoints stay
  clear.
- Mobile and desktop behaviour: usable at 320px and calm at wide widths.
- Light and dark appearance: inactive rail, filled range, thumb, focus, and
  disabled state remain distinct.
- Interaction and keyboard behaviour: pointer drag and arrow-key stepping stay
  native to Base UI.
- Motion and reduced-motion behaviour: feedback is brief and movement is
  suppressed when requested.
- Complexity introduced: no dependency, production token, or permanent
  component change while exploring.

## Scope

In:

- Build three visual directions around the existing Slider primitive.
- Show all directions under the same real content and state constraints on one
  temporary lab route.
- Keep visual treatment in lab-only classes; keep the production Slider
  untouched.
- Review active, disabled, focus, narrow, light, dark, and reduced-motion
  states.
- Save one experimental branch checkpoint for selection.

Out:

- Selecting or promoting a direction before review.
- Adding colour, size, orientation, or range variants to the production API.
- Changing Switch, Tabs, Actions, or the permanent Style Guide.
- Merging or deploying the temporary route.

## Review Notes

### Direction A — Block rail

- Works well: the filled segment and bordered square thumb read immediately in
  light and dark mode. It is the calmest general-purpose option.
- Concerns: it is intentionally the most familiar and contributes the least
  distinctive character.

### Direction B — Calibrated rule

- Works well: the thin rule, nine measured ticks, and narrow index create the
  strongest precision cue without adding colour.
- Concerns: the full rule does not communicate elapsed range as strongly as a
  filled rail, and the ticks may be unnecessary for loose values.

### Direction C — Inset channel

- Works well: the thick recessed channel, raised thumb, and light/shade edge
  make the fixed and moving parts easiest to distinguish physically.
- Concerns: its visual weight competes more with nearby labels and values than
  the other directions.

## Decision

- Selected direction: Pending review.
- Why it was selected: Pending review.
- Useful ideas retained from other directions: Pending review.
- Ideas deliberately rejected: Pending review.

## Cleanup Before Pull Request

- [ ] Selected direction moved into the production component.
- [ ] Rejected variants removed.
- [ ] Temporary `/lab/sliders` route removed.
- [ ] Temporary lab components, styles, assets, and imports removed.
- [x] No unrelated changes included.
- [ ] Responsive and appearance states reviewed again after cleanup.
- [ ] `pnpm check` passes.
- [ ] `pnpm build` passes.

## Learnings

All three treatments can preserve the same Base UI semantics and 48px control
target while changing only lab-owned visual anatomy. Fine ticks need an
explicit vertical position and enough neutral contrast to survive dark mode.
The recessed channel needs both a surface shift and the shared light/shade edge
before the thumb reads as a moving part rather than a gap in the track.
The calibrated ticks should remain visual reference marks and must not force
coarse keyboard or drag increments.
