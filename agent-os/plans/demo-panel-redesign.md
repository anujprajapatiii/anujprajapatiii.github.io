# Demo Panel Redesign

## Status

Complete

## Context

The first shared demo panel is technically functional but fails as an
interface. A new visitor meets sixteen controls, five type treatments, two
navigation models, a setting, playback, raw state, an event log and code
fragments at once. The panel asks people to understand the implementation
before it gives them a reason to interact.

The visual hierarchy reinforces the confusion. Tabs, segmented controls,
buttons and readout cards all have similar weight. The white inverted action
looks like the primary task even though autoplay is incidental. In dark mode,
the off switch is a 32 × 16px borderless shape whose track differs from the
panel by only a small neutral step, so it nearly disappears.

This redesign establishes the first durable demo-panel pattern for the
portfolio. Its concrete subject is the anatomy of a small interactive chat
interface. Its audience is a design- or development-curious visitor who does
not already know React terminology. Its single job is: **choose one part, see
where it lives, and understand what it does.**

## Desired Outcome

- A first-time visitor can answer “What is this?”, “What should I do?” and
  “What changed?” without reading the case-study prose below.
- The panel has one dominant interaction: selecting one of six meaningful
  parts. The stage prepares the relevant example state automatically.
- Direct selection and Previous/Next form one coherent navigation model, not
  competing control systems.
- The default interface contains no autoplay, raw JSON, event log, faux code
  snippets or manual state-machine controls.
- Panel typography uses KMR Apparat and only two size roles: heading and meta.
  Weight and colour create the remaining hierarchy.
- The highlight toggle is secondary but unmistakable in both states. Off has
  a visible track boundary and contrasting thumb; on adds the semantic accent.
- The annotation callout is a tonal demo surface, not a bright inverse box.
- The six-step navigation has no accent rule. Current state is communicated by
  a clear selected surface, primary text and `aria-current`; the control does
  not invent a different selection language from the existing four-option
  segmented control.
- The annotation outline contains no translucent fill, and the phone has no
  glow or drop shadow. Separation comes from real surfaces and boundaries.
- The annotation outline and callout use the same border colour, radius and
  tonal surface family so they read as one connected annotation system.
- Demo canvases are visually clean by default. They contain the artifact and
  only the feedback required to use it—no persistent status badges, mode chips
  or diagnostic labels. A demo may opt into status UI only when that status is
  meaningful to the visitor and cannot be communicated by the artifact itself.
- The shared components are narrow, controlled and reusable by future guided
  demos without forcing every experiment into the same content model.

## Design Direction

### Colour

No new palette. The panel uses the existing semantic surface ladder:
background for the page, raised for the panel, inset for grouped navigation,
and raised-hover for the selected step. The step navigation uses no accent;
its selected state comes from neutral surface and text hierarchy. Brown remains
available for the active switch and the connected stage annotation only. Text
stays on primary and secondary roles. The system therefore inherits light/dark
and authored page palettes automatically.

### Type

- Panel title: existing 20px heading role, Medium.
- Every other label, explanation, step and action: existing 14px meta role,
  Regular or Medium where emphasis is semantic.
- No monospace in the default panel. No uppercase utility labels. No third
  size introduced to manufacture hierarchy.

### Layout

The panel becomes a short guided walkthrough rather than a dashboard:

```text
┌─────────────────────────────────────┐
│ Explore the interface      1 of 6   │
│ Choose a part to see what it does.  │
│                                     │
│ 01  Demo area              current  │
│ 02  Device                          │
│ 03  Screen                          │
│ 04  State                           │
│ 05  Input                           │
│ 06  Feedback                        │
│                                     │
│ The demo area keeps the example     │
│ contained. It gives the phone and   │
│ its annotation one clear boundary.  │
│                                     │
│ Show highlight          [ switch ]  │
│ [ Previous ]       [ Next: Device ] │
└─────────────────────────────────────┘
```

Numbers are justified here because the walkthrough has a real outside-in,
then cause-to-feedback sequence. The list provides overview and direct access;
Previous/Next provides an obvious path for someone who does not want to scan.

### Signature

The memorable element is the synchronized “anatomy lens”: each selected step
prepares the phone, moves one restrained annotation to the relevant part and
updates one plain-language explanation. The panel stays quiet so that this
mapping—not the controls themselves—is the experience.

The lens is drawn as one coherent system: an unfilled outline, connector and
tonal callout share the same border language. There is no glow behind the phone
and no wash inside the selected bounds.

The canvas stays equally quiet. The current “Live interface” and phase badges
are removed rather than relocated; the phone and synchronized annotation
already communicate the relevant state.

## Interaction Model

1. The demo opens on **Demo area**, with its annotation visible.
2. Selecting a step updates three things as one action:
   - the current item in the ordered list;
   - the short explanation in the panel;
   - the phone preset and annotation target on the stage.
3. Previous and Next move through the same ordered list. Previous is disabled
   on the first item; the final Next action becomes **Start again**.
4. **Show highlight** controls only the annotation overlay. Its label describes
   the on state, and the selection remains understandable when it is off.
5. Direct interaction with the phone remains available. It never changes the
   selected lesson or locks navigation.
6. There is no autoplay. The panel never moves on behalf of the visitor.

## Content Model

Use one vocabulary across the panel and stage:

| Step | Panel explanation | Annotation |
| --- | --- | --- |
| Demo area | The demo area keeps the example contained. It gives the phone and its annotation one clear boundary. | Contains the complete example. |
| Device | The device frame creates one surface. It keeps the screen and controls inside the phone shape. | Keeps screen content inside the phone. |
| Screen | The screen renders the conversation. Messages, empty states and controls are ordinary interface elements. | Renders the current conversation. |
| State | State remembers what is happening. It keeps the draft, messages and current response together so the screen can update. | Keeps the interface in sync. |
| Input | Input turns intent into an action. Typing updates the draft; sending moves the interface to its next state. | Turns typed text into a message. |
| Feedback | Feedback makes waiting understandable. The thinking indicator appears while the reply is prepared. | Shows that a response is in progress. |

The case-study prose below can explain architecture in depth. The live panel
only says enough to orient, demonstrate and move forward.

## Architecture

Keep the existing three-layer ownership model, but make the demo-composition
layer more specific:

```text
InteractionAnatomyLab
owns lessons, phone state and annotation geometry
            ↓ controlled props/events
DemoPanel · DemoPanelHeader · DemoStepList · DemoStepDetail
DemoPanelFooter · DemoSetting
            ↓
Button · Switch · Tooltip and semantic tokens
```

- `DemoPanel` owns the responsive inspector surface and spacing.
- `DemoStepList` owns ordered-list semantics, current-step state and keyboard
  focus behaviour; it receives controlled values and callbacks.
- `DemoStepDetail` owns the stable explanation region and polite announcement.
- `DemoSetting` owns label/control mapping for an optional secondary setting.
- `DemoPanelFooter` owns wayfinding actions, not experiment state.
- The experiment continues to own every preset, timer and annotation target.
- Generic diagnostics are not part of the default panel contract. If a future
  technical experiment genuinely needs them, they return behind an explicit
  optional disclosure rather than occupying the main hierarchy.

Retire the current generic `ControlGroup`, `DemoActions`, `DemoReadout` and
dashboard-shaped specimen if no remaining production use proves them. Fewer
fundamental patterns are preferable to preserving abstractions that encode the
wrong experience.

## Scope

In:

- Redesign the shared demo panel composition around header, guided steps,
  explanation, one optional setting and wayfinding footer.
- Rewrite the Interaction Anatomy lessons and annotations in plain language.
- Remove autoplay, manual phase selection, raw state, event history and code
  snippets from the live panel and delete their unused state/CSS.
- Strengthen the shared Switch off/on/disabled states and slightly increase its
  functional geometry while preserving compact density.
- Replace the bright inverse annotation callout with a tonal semantic surface.
- Remove the six-step navigation accent and rely on selected neutral surface,
  primary text and semantic current state.
- Remove the low-opacity annotation bounding-box fill and the phone drop
  shadow/glow.
- Unify the annotation outline and callout through the same semantic border,
  radius and tonal-surface treatment.
- Remove the Interaction Anatomy canvas status badges and make badge/status
  chrome an explicit opt-in composition rather than a `DemoStage` default.
- Rework the style-guide specimen so it demonstrates the new hierarchy rather
  than the retired dashboard pattern.
- Verify light/dark, keyboard, direct phone interaction, reduced motion and
  stacked layouts.
- Update the demo architecture and styling conventions after the pattern is
  proven in-browser.

Out:

- Redesigning the phone UI, its chat interaction or the case-study page shell;
  removing the presentational outer glow is the one scoped phone treatment.
- Adding charts, a developer console, a schema-driven experiment framework or
  controls without a current use.
- Changing the portfolio palette, typography scale, page grid or other cards.
- Reworking Nutrition Labels unless a shared primitive change causes a real
  regression there.

## Files To Modify

- `src/components/demo/DemoShell.tsx`: retain the stage/panel relationship and
  remove controls-specific exports that move to the panel layer.
- `src/components/demo/DemoPanel.tsx`: add the focused panel, header, detail,
  setting and footer compositions.
- `src/components/demo/DemoStepList.tsx`: add the controlled ordered walkthrough
  navigation.
- `src/components/demo/DemoControls.tsx`: retire after all live references are
  migrated, if nothing still proves it.
- `src/components/demo/DemoReadout.tsx`: retire the default diagnostic pattern
  if it has no remaining production use.
- `src/components/ui/switch.tsx`: preserve accessible controlled behaviour.
- `src/styles/global.css`: adjust semantic switch geometry tokens only if the
  revised component needs them.
- `src/styles/demo-controls.css`: implement the new hierarchy and complete
  switch states; remove dashboard/readout rules that are no longer used.
- `src/components/InteractionAnatomyLab.tsx`: simplify state and replace the
  panel with the walkthrough.
- `src/components/interaction-anatomy-lab.css`: delete retired panel rules and
  make annotation surfaces tonal.
- `src/components/DemoPrimitivesSpecimen.tsx`: demonstrate the new panel model.
- `src/components/demo-primitives-specimen.css`: simplify specimen-specific
  styling around the new composition.
- `src/pages/style-guide.astro`: revise the demo-system explanation if needed.
- `agent-os/conventions/styling.md`: record the two-level panel hierarchy and
  visible binary-state rule.
- `agent-os/conventions/architecture.md`: record the guided-panel composition
  boundary and progressive-disclosure rule for diagnostics.
- `agent-os/system-map.md`: update the demo subsystem description if component
  ownership changes materially.
- `agent-os/plans/demo-panel-redesign.md`: track implementation and review.

## Steps

- [x] Replace the current panel inventory with the approved walkthrough
  information architecture and final copy.
- [x] Build the small shared DemoPanel and DemoStepList composition layer.
- [x] Make the Switch legible in off, on, focus, hover and disabled states in
  both appearances without adding palette-specific selectors.
- [x] Refactor Interaction Anatomy to one active lesson plus its required phone
  preset; remove autoplay, phase controls, diagnostics and dead state.
- [x] Restyle the annotation callout and remove the stage status badges; keep
  shared canvas status chrome opt-in and absent by default.
- [x] Remove the navigation accent, annotation fill and phone glow; unify the
  annotation tooltip and outline as one visual system.
- [x] Refactor the style-guide specimen and delete unproved demo abstractions.
- [x] Browser-test the four orientation questions, direct step selection,
  Previous/Next, final restart, highlight setting and phone interaction.
- [x] Verify keyboard order/focus, light/dark contrast, reduced motion and
  responsive stacking.
- [x] Run `pnpm check`, `pnpm build` and `git diff --check`.
- [x] Update conventions/system map and capture any reusable learning.

## Review

- Design: one restrained panel surface, one selected-step signal, no bright
  incidental action, no nested card stack, no decorative micro-labels and no
  default status badges floating over the canvas. Selection is neutral, the
  annotation bounds are unfilled, the phone has no glow and the callout reads
  as part of the same annotation boundary.
- UX: every screen state answers where the visitor is, what changed, what they
  can choose and how to continue.
- Content: labels name recognizable parts; explanations describe purpose and
  effect before implementation; all actions use consistent sentence case.
- Accessibility: ordered-step semantics, current state, polite detail updates,
  visible focus, labelled switch, meaningful disabled state and no colour-only
  selection.
- Architecture: the walkthrough is reusable without owning experiment state;
  advanced diagnostics are optional rather than structural.
- Verification: browser review in light/dark and stacked layouts, keyboard
  interaction, reduced motion, convention check, production build and diff
  check.

## Learnings

`DemoStepList` proved to be the right reusable boundary: it owns ordered-list
semantics and current-step presentation while the experiment retains every
preset and state transition. Diagnostics remain outside the default panel;
the short durable rule is recorded in the architecture and styling
conventions instead of a separate learning note.
