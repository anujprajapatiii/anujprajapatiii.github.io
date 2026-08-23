# Demo Interface Primitives

## Status

Complete — 2026-08-23

## Context

`InteractionAnatomyLab` proves that the portfolio can host substantial native
experiments, but its control UI is currently bespoke. Tabs, a switch, state
buttons, action buttons, readouts and panel layout are all implemented and
styled inside one component. That makes the demo feel like a one-off interface
and asks the next control-heavy experiment to solve the same interaction,
accessibility and responsive problems again.

The portfolio already has a mature visual foundation: Apparat, five type
roles, restrained geometry, the four-level surface ladder, semantic colour
roles, a disciplined spacing scale and restrained brown accent. The demo layer
should extend those decisions rather than introducing a second visual system.

Apple is useful here as a behavioural reference rather than an aesthetic
template: immediate feedback, direct manipulation, clear mapping between a
control and its result, quiet hierarchy, interruptible motion and careful
accessibility. The result should still look unmistakably like this portfolio,
not like a transplanted Apple settings panel.

## Desired Outcome

- Control-heavy experiments share one coherent, compact interface language.
- A new experiment can compose a stage, inspector and common controls without
  copying CSS or rebuilding keyboard behaviour.
- Controls inherit the current page palette and light/dark appearance through
  semantic roles; no primitive knows palette names or raw colours.
- Interaction Anatomy becomes the first reference implementation, while its
  actual phone demo, annotation geometry and state machine remain local.
- The primitives remain small enough to understand and own. We add controls
  because two demos need them or because the current demo immediately proves
  them—not to pre-build a complete component library.

## Design Contract

### Preserve the portfolio

- KMR Apparat remains the only interface face. Controls use the existing body
  and meta roles; no new type size, tracking or weight is introduced.
- Structural surfaces remain crisp by default, but geometry follows function
  rather than a blanket square-corner rule. Switches, slider thumbs, compact
  control groups, simulated hardware and annotation outlines may be rounded
  when that makes their behaviour or physical model clearer.
- Rounding is restrained and tokenised. It is not applied to every panel,
  stage or card as a decorative skin. Depth still comes primarily from the
  existing canvas → inset → raised → raised-hover surface ladder rather than
  ornamental shadows.
- Space groups controls first. Rules appear only where dense data genuinely
  needs structure.
- Brown remains a sparse state accent. It may mark selection, progress or
  focus, but it does not colour every control.
- Every colour, size, spacing and motion value comes from a semantic token.

### Borrow Apple behaviour, not Apple styling

- A press responds on pointer-down, not after the click completes.
- Dragged controls track the pointer one-to-one; easing happens only after
  release when something needs to settle.
- State changes are continuous and interruptible. A user action always stops
  an autoplay sequence or transition cleanly and takes control immediately.
- Motion explains cause and effect. It never decorates an otherwise static
  control, and it never bounces unless the interaction itself has momentum.
- Controls are familiar, directly labelled and placed beside the value or
  result they affect.
- Reduced-motion, increased-contrast and reduced-transparency preferences have
  explicit fallbacks.

### Compact without becoming difficult to use

- Desktop controls use a compact 32px visual height from the existing spacing
  scale.
- Coarse-pointer layouts expand interactive rows to the existing 48px step,
  preserving a generous touch target without making the desktop inspector
  oversized.
- Icons use the existing 16px step. Icon-only controls always have an
  accessible name and a visible tooltip on hover/focus.
- Primary actions stay visible; diagnostics and secondary explanation can be
  collapsed or moved lower in the hierarchy on narrow screens.

## Architecture

Use two layers with a strict boundary:

```text
Experiment state and domain logic
              ↓ controlled props/events
Demo compositions
DemoShell · DemoStage · DemoControls · ControlGroup · ControlRow · DemoReadout
              ↓
Accessible UI controls
Button · IconButton · Tabs · SegmentedControl · Switch · Slider · Tooltip
              ↓
Portfolio foundations
semantic colour roles · surface ladder · spacing · type · motion · focus
```

### 1. Accessible UI controls

Low-level controls live in `src/components/ui/`. They own semantics, keyboard
behaviour, pointer behaviour and visual states. They do not know what an
experiment is.

Use the repository's configured shadcn setup as a source for headless,
accessible behaviour where the interaction is genuinely complex—Tabs,
Switch, Slider, Toggle Group and Tooltip. Generated stock appearance is not
the design. Keep the locally owned source, strip its default visual treatment
and map it to this portfolio's tokens. Buttons remain native elements with a
small local wrapper.

Do not add a general animation library. CSS handles discrete control feedback;
direct-manipulation experiments can add a focused spring helper later only
when a real drag or momentum interaction requires it.

### 2. Demo compositions

Demo-specific layout primitives live in `src/components/demo/`. They own
structure and density, not domain state:

- `DemoShell`: responsive stage/inspector relationship. Wide screens use the
  established 16/8 split across the 24-column logic; smaller screens stack.
- `DemoStage`: the experiment canvas and optional stage toolbar/status area.
- `DemoControls`: the inspector surface and its primary/secondary hierarchy.
- `ControlGroup`: a labelled set of related controls with optional help text.
- `ControlRow`: stable label/value/control alignment for compact settings.
- `DemoReadout`: state, values or event output; code-like output may opt into
  the existing mono role.

The shell does not own React state. Each experiment remains the source of truth
and passes controlled values and callbacks into the primitives.

### 3. Styling and tokens

Add a small shared control stylesheet rather than keeping UI rules inside a
single experiment stylesheet.

- Canonical control geometry, purposeful radius and motion roles live in
  `global.css` alongside the existing spacing/type foundations.
- Shared component rules live in `src/styles/demo-controls.css` and use a
  `ui-` or `demo-` namespace to prevent leakage.
- Demo surface aliases are scoped to `.demo-shell` and reference existing
  semantic roles such as `--background-secondary`,
  `--background-elevated`, `--background-elevated-hover`, `--text-primary`,
  `--text-secondary`, `--border-tertiary` and `--decorative-accent`.
- Page palettes therefore remap demos automatically. There are no `.dark`
  component exceptions and no palette-specific selectors in a primitive.
- The initial radius vocabulary stays deliberately small:
  - a modest control radius for inputs and grouped controls where it improves
    affordance;
  - a fully rounded role for switches, slider tracks/thumbs and other
    genuinely circular or capsule geometry;
  - a device radius for physical simulations such as the phone.
  Structural panels and stages do not receive a radius by default.
- Annotation outlines mirror the effective radius of the target they
  highlight, with the modest control radius as a fallback. The outline
  therefore describes the selected object instead of imposing its own shape.
- A translucent floating toolbar is allowed only when it sits over changing
  stage media and translucency materially preserves context. The default
  inspector and controls remain solid; reduced transparency gets a solid
  fallback.

## Primitive Semantics

The initial set covers the fundamental input types without becoming a control
catalogue:

| Need | Primitive | Semantic rule |
| --- | --- | --- |
| Perform an action | `Button` / `IconButton` | An action, never persistent state. |
| Change displayed content | `Tabs` | One active tab and its associated panel; arrow/Home/End keys move focus. |
| Choose one mode in the same view | `SegmentedControl` | A compact single-choice group, not navigation. |
| Turn a persistent setting on/off | `Switch` | Immediate binary setting with announced checked state. |
| Change a continuous value | `Slider` | Direct 1:1 tracking with an adjacent live value. |
| Explain an icon-only action | `Tooltip` | Supplemental label, never the only accessible name. |

Checkboxes, selects, colour pickers, disclosure trees and multi-select filters
are explicitly deferred until a real experiment needs them. Their future
implementations follow the same contracts rather than being anticipated now.

## Visual State Matrix

Every interactive primitive implements the same complete state vocabulary:

| State | Surface | Text/icon | Other signal |
| --- | --- | --- | --- |
| Rest | Quiet or transparent | Secondary for quiet actions; primary for main actions | None |
| Hover | One semantic surface step outward | Primary | No layout movement |
| Pressed | One immediate inward/compressed surface step | Primary | Response begins on pointer-down |
| Selected/on | Inset or raised selected shade | Primary | One thin accent indicator only where it clarifies state |
| Focus-visible | State surface is preserved | State colour is preserved | Existing 2px semantic focus outline |
| Disabled | Disabled semantic surface | Disabled text/icon | No hover/press motion |

The selected state is not a border around the entire control. Tabs use a thin
selected indicator plus a quiet selected shade; segmented controls rely mainly
on the selected surface. A modest radius may help a selected control read as
an interactive object, but it is never added to unrelated structural panels.
This follows the existing experiment-tab direction and keeps dense inspectors
from becoming a grid of accented boxes.

## Motion Contract

- **Press:** immediate surface/opacity feedback in roughly one frame, then a
  short tokenised release.
- **Hover/focus:** short ease-out colour transition; no movement solely to
  announce hover.
- **Selection:** a restrained, critically damped-feeling settle when an
  indicator changes position. No overshoot.
- **Direct manipulation:** no easing while the pointer is down. The value and
  visual result update together.
- **Panel/content change:** preserve spatial origin and crossfade/translate
  only when it helps users understand what changed.
- **Autoplay:** always exposes pause/stop and yields immediately to manual
  interaction.
- **Reduced motion:** remove travel and autoplay; use instantaneous state
  changes or a brief opacity change.

## Scope

In:

- The shared UI and demo-composition layers described above.
- The initial Button, IconButton, Tabs, SegmentedControl, Switch, Slider and
  Tooltip set.
- A small semantic radius vocabulary for functional controls and physical
  simulations, plus target-aware annotation geometry.
- A token-backed state matrix for rest, hover, pressed, selected, focus and
  disabled in light/dark and authored page palettes.
- Refactoring Interaction Anatomy to consume the shared shell, tabs, switch,
  segmented control, actions, grouping and readout components.
- Removing the simulated phone's Dynamic Island/notch while retaining its
  purposeful device silhouette and status treatment.
- Refactoring the Project Nutrition Labels switcher to use the same
  SegmentedControl, proving the primitives work outside one demo shell.
- An interactive style-guide specimen showing every primitive, state and
  density in main light/dark and the blue page palette.
- Keyboard, coarse-pointer, reduced-motion and reduced-transparency review.

Out:

- Changing the phone simulation's behaviour/content, lesson content,
  annotation targeting/path logic or state machine in Interaction Anatomy,
  beyond applying the approved functional geometry roles.
- Redesigning the Work/Experiments cards, site navigation or general content
  pages.
- Building every possible form control in advance.
- A new colour palette, type step, site-wide rounded-card treatment or motion
  library.
- Making translucent materials the default demo aesthetic.
- Moving experiment domain state into a generic framework or schema.

## Files To Modify

- `src/styles/global.css`: add semantic control-size, purposeful radius and
  motion roles; import the shared control stylesheet.
- `src/styles/demo-controls.css`: shared UI-control and demo-composition rules.
- `src/components/ui/button.tsx`: native Button and IconButton wrappers with
  controlled variants and complete states.
- `src/components/ui/tabs.tsx`: accessible content tabs with roving keyboard
  behaviour supplied by the configured headless primitive.
- `src/components/ui/segmented-control.tsx`: controlled single-choice mode
  selector.
- `src/components/ui/switch.tsx`: accessible binary setting.
- `src/components/ui/slider.tsx`: accessible continuous input and value API.
- `src/components/ui/tooltip.tsx`: hover/focus help for icon-only controls.
- `src/components/demo/DemoShell.tsx`: shared responsive stage/inspector shell.
- `src/components/demo/DemoControls.tsx`: controls, groups and rows.
- `src/components/demo/DemoReadout.tsx`: compact state/event output treatment.
- `src/components/InteractionAnatomyLab.tsx`: replace bespoke outer controls
  and shell with shared primitives, remove the Dynamic Island element and
  preserve the lab logic.
- `src/components/interaction-anatomy-lab.css`: retain only phone, annotation
  and experiment-specific visuals; apply device/target-aware geometry and
  delete migrated control rules.
- `src/components/ProjectNutritionLabels.tsx`: use the shared segmented
  control for project selection.
- `src/components/project-nutrition-labels.css`: remove duplicated switcher
  control styling while preserving label-specific layout.
- `src/pages/style-guide.astro`: add the interactive primitive/state specimen.
- `scripts/check-conventions.mjs`: replace the blanket radius rejection with a
  rule that permits approved semantic radius tokens while still rejecting raw
  values and arbitrary radius utilities.
- `agent-os/conventions/styling.md`: document the demo-control contract,
  semantic distinctions, purposeful-radius rule and motion rules.
- `agent-os/conventions/architecture.md`: record the `ui/` versus `demo/`
  boundary and controlled-state ownership.
- `agent-os/system-map.md`: register the shared demo layer after it exists.
- `agent-os/plans/demo-interface-primitives.md`: track implementation and
  review.

## Steps

- [x] Establish control height, icon size, purposeful radius, motion and
  easing roles in the token system without adding raw component values.
- [x] Update the convention checker so deliberate token-backed rounding is
  allowed while arbitrary radii still fail review.
- [x] Add the shared stylesheet and implement the full interaction state
  matrix before composing a demo.
- [x] Generate/inspect only the configured headless primitives needed for the
  initial set; keep behaviour and replace stock styling with portfolio roles.
- [x] Build Button/IconButton, Tabs, SegmentedControl, Switch, Slider and
  Tooltip as controlled, typed primitives.
- [x] Build DemoShell, DemoStage/DemoControls composition, ControlGroup/Row and
  DemoReadout on the existing responsive grid.
- [x] Add an interactive style-guide specimen first and tune hierarchy in main
  light/dark plus blue light/dark before migrating a production demo.
- [x] Refactor Interaction Anatomy incrementally: shell, guide tabs,
  annotation switch, phase selector, actions, then readouts. Preserve its
  current state and autoplay behaviour after each step.
- [x] Remove the Dynamic Island markup and its now-unused styling; rebalance
  the phone status/header spacing without introducing a replacement notch.
- [x] Migrate the Nutrition Labels switcher as the second usage and delete its
  duplicated control CSS.
- [x] Verify compact desktop density, coarse-pointer target growth and stacked
  mobile hierarchy at representative widths.
- [x] Verify keyboard order and semantics: tabs, switch, segmented control,
  slider, tooltips and focus-visible states.
- [x] Verify manual interaction interrupts autoplay, motion is restrained, and
  reduced-motion/transparency preferences produce calm fallbacks.
- [x] Run convention checks, production build, diff checks and browser review;
  remove any unused generated dependency or primitive before completion.

## Review

- Design: The system reads as this portfolio—Apparat, restrained, neutral and
  compact—and feels more precise through immediate feedback, clearer hierarchy
  and functional geometry. Rounded forms correspond to controls or physical
  objects rather than becoming a blanket aesthetic. Brown remains an accent,
  not a skin.
- Interaction: Every control has predictable rest, hover, press, selected,
  focus and disabled behaviour. Direct controls track input without lag and
  autoplay yields to the user.
- Accessibility: Native/headless semantics are preserved; controls have direct
  labels, icon actions have names/tooltips, tab and segmented keyboard models
  are correct, touch targets expand on coarse pointers, and state is never
  conveyed by colour alone.
- Responsive: 16/8 stage/inspector on wide screens, clean stacking on smaller
  screens, no horizontal page overflow and no loss of primary controls.
- Architecture: Domain state stays inside each experiment; shared primitives
  own behaviour and visuals only. No duplicated switch/tab/button rules remain
  in the two migrated demos.
- Verification: `pnpm check`, `pnpm build`, `git diff --check`, browser review
  at desktop/tablet/mobile widths, light/dark, default/blue palette, keyboard,
  coarse pointer simulation, reduced motion and reduced transparency.

## Rollout

Ship this as one reference-quality vertical slice rather than converting every
experiment at once:

1. Foundation tokens and state specimen.
2. Shared primitives and demo compositions.
3. Interaction Anatomy migration.
4. Nutrition Labels migration.
5. Only then adopt the layer in future experiments as each is revisited.

This keeps the new system grounded in two real use cases and makes rollback
simple: experiment domain logic never moves, so a primitive can be tuned or
replaced without rewriting the demo.

## Learnings

- Base UI supplies the keyboard and pointer models cleanly while leaving the
  visual system locally owned. The thin wrappers are the useful boundary: the
  experiments consume portfolio primitives without coupling their state to a
  third-party API.
- A slider root label describes its group but does not automatically name each
  thumb. The shared wrapper therefore forwards a single-slider label to its
  thumb and accepts explicit labels for future multi-thumb controls.
- Functional curvature stays coherent when there are only three roles and the
  checker rejects every literal. Computed annotation geometry is the one
  intentional exception because the outline must describe its target.
- The final state, motion and ownership contracts now live in the styling and
  architecture conventions; the shared demo subsystem is registered in the
  system map, so no separate learning note is needed.
