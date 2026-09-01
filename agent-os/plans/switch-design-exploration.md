# Switch Design Exploration

## Status

Complete — selected direction promoted

## Design Question

Which boxy Switch treatment should become the portfolio system's next visual
direction while retaining Shadcn/Base UI behaviour and a persistent, legible
off state?

## Why It Matters

The first three directions made unchecked controls depend too heavily on a
fine outline. They could recede into the surrounding surface, especially near
other borders. Six revised, equally constrained options now test filled tracks,
recessed surfaces, redundant marks, and permanent housings without changing
the familiar left/right interaction.

## Research Synthesis

- WAI-ARIA requires a stable accessible label, binary `aria-checked` state,
  and Space activation; the existing Base UI primitive already supplies this
  behaviour: <https://www.w3.org/WAI/ARIA/apg/patterns/switch/>.
- Carbon combines position with visible state text, and adds a redundant mark
  to compact switches so colour is not the only cue:
  <https://carbondesignsystem.com/components/toggle/usage/>.
- Spectrum keeps an unselected track and handle visibly distinct, calls for at
  least 3:1 contrast for identifying UI component state, and supports neutral
  rather than accent-emphasized switches:
  <https://spectrum.adobe.com/page/switch/>.
- Apple recommends obvious visual differences through background shape and
  inner details, not colour alone:
  <https://developer.apple.com/design/human-interface-guidelines/toggles>.
- Fluent reinforces the immediate-effect model and keeps a visible label close
  to the control in normal settings contexts:
  <https://fluent2.microsoft.design/components/web/react/core/switch/usage>.
- Shadcn's Base UI implementation remains the behavioural seam; visual states
  are styled through its checked, unchecked, disabled, and focus hooks:
  <https://base-ui.com/react/components/switch>.

## Shared Constraints

- Real content: immediate settings with short and long labels, descriptions,
  checked/unchecked examples, and a disabled example.
- Existing design tokens and primitives: semantic colour, spacing, type,
  motion, focus, and the existing compound light/shade effects only.
- Required information or actions: label, optional description, visible on/off
  state, and a clear disabled state.
- Accessibility requirements: Shadcn/Base UI Switch semantics, native keyboard
  activation, programmatic labels, visible focus, 48px coarse-pointer targets,
  and no colour-only state.
- Responsive contexts: 320px through wide desktop without clipping or
  horizontal page overflow.
- Appearance and motion modes: global light and dark appearances, plus reduced
  motion.

## Directions

| Direction | Idea being tested | Expected strength | Possible weakness |
| --- | --- | --- | --- |
| A — Solid rail | Keep the entire off track filled with an interactive neutral. | Most familiar, strongest baseline, no outline dependency. | Least distinctive. |
| B — Recessed trough | Press the filled rail inward and raise the square thumb. | Clear fixed/moving part relationship using existing material effects. | More visual weight than the baseline. |
| C — Twin cell | Divide the filled rail into two explicit destinations. | Position reads before interaction and remains clear without colour. | Can lean slightly toward segmented-control language. |
| D — Binary marker | Add a 0/1-style inner mark to the moving thumb. | Strong redundant cue at compact sizes. | The technical symbol may be more explicit than most settings need. |
| E — Tactical gauge | Place fine ticks behind a crosshair thumb with hard light/shade. | Most distinctive and closest to the requested tactical character. | Highest detail density. |
| F — Framed chassis | Keep a permanent outer housing around an inset filled slot. | Best separation from surrounding card and table borders. | Heaviest construction and smallest thumb. |

## Comparison Surface

- Starting point: clean `main`
- Branch: `codex/switch-lab`
- Temporary route: `/lab/switches`
- Temporary components: `src/components/lab/switches/`
- Temporary Base UI seam: `src/components/ui/experimental-switch.tsx`

## Evaluation Criteria

- Information hierarchy: the label remains primary and the control state reads
  immediately.
- Fit with the portfolio's visual direction: square geometry, neutral colour,
  hard one-pixel edges, and restrained depth.
- Real-content resilience: short and long settings remain clear.
- Mobile and desktop behaviour: comfortable 320px layout and compact desktop
  density.
- Light and dark appearance: rail, thumb, focus, checked, unchecked, and
  disabled states stay distinguishable in both modes.
- Interaction and keyboard behaviour: click, Space, focus-visible, and disabled
  behavior remain native to Base UI.
- Motion and reduced-motion behaviour: the thumb moves quickly and stops
  moving when reduced motion is requested.
- Complexity introduced: no new dependency, no new colour token, and no change
  to the production Switch while exploring.

## Scope

In:

- Build six interactive Switch directions on one temporary comparison page.
- Use one lab-only Base UI wrapper so behaviour is identical across options and
  the existing Supported Switch remains untouched.
- Use the existing field anatomy, semantic tokens, square geometry, and shared
  compound light/shade effects.
- Show checked, unchecked, focusable, and disabled examples using realistic
  settings copy.
- Verify light/dark appearance, 320px and desktop layout, keyboard operation,
  reduced motion, and console health.
- Save the exploration as a branch checkpoint for review.

Out:

- Changing or promoting the production `Switch` component.
- Adding new design tokens, dependencies, public navigation, or production
  routes.
- Choosing a winner, deleting alternatives, or merging to `main` before review.
- Redesigning Field anatomy, Tabs, Buttons, or unrelated Style Guide sections.

## Review Notes

### Direction A — Solid rail

- Works well: the filled neutral track gives the unchecked state the clearest
  silhouette and stays closest to the familiar Shadcn model.
- Concerns: it contributes the least distinctive surface character.

### Direction B — Recessed trough

- Works well: the recessed rail and raised thumb distinguish fixed and moving
  parts without adding colour.
- Concerns: the material treatment is visually heavier than the baseline.

### Direction C — Twin cell

- Works well: the centre divider makes both destinations explicit.
- Concerns: it approaches segmented-control language if made any wider.

### Direction D — Binary marker

- Works well: the inner mark provides a compact redundant state cue.
- Concerns: it is intentionally more technical than a general-purpose switch.

### Direction E — Tactical gauge

- Works well: the thin rail marks and square thumb crosshair remain visible in
  light and dark mode, while the shared compound shadow supplies both highlight
  and shade edges. It feels the most specific to the requested direction.
- Concerns: it carries the most detail and should remain an intentional variant
  rather than the default for every boolean setting.

### Direction F — Framed chassis

- Works well: the persistent housing separates the component from neighbouring
  borders and surfaces.
- Concerns: the extra frame makes it the heaviest option and reduces the thumb
  size slightly.

## Decision

- Selected direction: A — Solid rail.
- Why it was selected: it is the most familiar, retains a strong unchecked
  silhouette without relying on a fine border, and harmonises with the
  portfolio's neutral, square controls.
- Selected measurements: 42px-wide by 20px-high rail, 22px-wide by 16px-high
  thumb, 2px resting inset on every edge, and 16px thumb travel.
- Useful ideas retained from other directions: none; position and the visible
  On/Off label already provide sufficient redundant state communication.
- Ideas deliberately rejected: recessed depth, divided cells, binary marks,
  tactical ticks, and the outer chassis from directions B–F.

## Cleanup Before Pull Request

- [x] Selected direction moved into the production component.
- [x] Rejected variants removed.
- [x] Temporary `/lab/switches` route removed.
- [x] Temporary lab components, styles, assets, and imports removed.
- [x] No unrelated changes included.
- [x] Responsive and appearance states reviewed again after cleanup.
- [x] `pnpm check` passes.
- [x] `pnpm build` passes.

## Learnings

The Shadcn/Base UI root-and-thumb behavior accepts all six square silhouettes
without additional state logic. A filled neutral track is a substantially more
reliable unchecked foundation than a surface-coloured rail plus fine border.
The selected 42px by 20px rail and 22px by 16px thumb need a 2px internal inset
and 16px travel to keep every resting edge mathematically equal. At 320px,
placing the status and control on a second row still protects real setting copy
more effectively than shrinking the switch or its touch target.
