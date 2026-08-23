# Experiment Interface System

**Status:** Proposed. Adopt this contract through the approved phases in
`agent-os/plans/experiment-interface-system.md`.

## Purpose

This system gives native experiments a small, reliable interface kit for
control panels, guided explainers, toolbars and live outputs. It should make a
new experiment quicker to build without making every experiment look or
behave the same.

The intended experience is calm, direct and curious. Controls should feel
immediate and physical, but the styling stays consistent with the portfolio:
KMR Apparat, zero tracking, semantic colour, restrained surfaces and minimal
chrome.

## Non-goals

- Do not build a dashboard framework or a schema-driven form generator.
- Do not predict every control a future experiment may need.
- Do not move experiment data, timers or domain rules into shared components.
- Do not make diagnostics, event logs or status badges default interface
  chrome.
- Do not add a second visual language for experiments.
- Do not add Storybook until the in-site workbench stops meeting the need.

## System Layers

Dependencies flow down this list. Lower layers never import or know about
higher layers.

| Layer | Owns | Does not own | Primary location |
| --- | --- | --- | --- |
| Foundations | Semantic colour, type, space, radius, size and motion tokens | Component markup or experiment identity | `src/styles/global.css`, `src/styles/themes/` |
| UI primitives | Semantics, keyboard/pointer behaviour, focus, disabled and validation states | Experiment state or page layout | `src/components/ui/` |
| Control anatomy | Label, description, message, units and field grouping | A complete panel or domain-specific copy | `src/components/ui/` |
| Demo recipes | Stage/panel layout, control sections, guided steps, toolbar and output regions | Domain state, calculations or timers | `src/components/demo/` |
| Experiment | Domain state, data, simulation, timing and authored visual identity | Reimplementing shared control behaviour | Experiment component and local stylesheet |

State flows from the experiment into controlled primitives. Events flow back
through callbacks. A shared component may manage only transient interaction
state that is intrinsic to the primitive, such as tooltip visibility.

## Component Maturity

Every shared component has one of three states:

- **Candidate:** available for a real experiment to prove. Its API may change.
- **Supported:** documented, tested and used by at least two live experiments,
  or by one live experiment when the control is accessibility-critical or
  behaviourally complex.
- **Deprecated:** retained temporarily with a documented replacement and
  removal target.

A style-guide specimen alone does not promote a component to Supported.
Promotion happens after live use exposes the right API.

### Current catalog

| Component | Current maturity | Evidence / next action |
| --- | --- | --- |
| `Button`, `IconButton` | Supported | Used in Interaction Anatomy; this accessibility-critical action primitive has a deliberately small API. Align icon and customization contracts during Phase 1. |
| `Switch` | Supported | Used in Interaction Anatomy; the accessible toggle behaviour qualifies for support from one live adopter. Keep it for immediate boolean settings. |
| `SegmentedControl` | Candidate | Used in Nutrition Labels; validate with a second real mode switch before promotion. |
| `Tabs` | Candidate | Wrapper exists but has no live adopter. Keep only after its first real content-view use. |
| `Slider` | Candidate | Wrapper exists but has no live adopter. Prove with a continuous-value experiment. |
| `Tooltip` / `Hint` | Candidate | Provider exists, but the content wrapper has no live adopter. Keep hints supplemental. |
| `DemoShell`, `DemoStage` | Supported | The responsive two-region behaviour is proven by Interaction Anatomy and documented in the style guide. |
| `DemoPanel` family | Supported | The complex guided interaction is proven by Interaction Anatomy and documented in the style guide; reserve it for guided explanation. |
| Field anatomy | Planned candidate | Add before text, number, select or validation controls. |
| `DemoInspector` | Planned candidate | Add for compact control panels after a real adopter is selected. |

## Primitive Selection

Choose the native interaction model before choosing its appearance.

| Need | Use | Avoid |
| --- | --- | --- |
| Trigger an action | `Button` or labelled `IconButton` | A styled `div`, link or unlabeled icon |
| Toggle an immediate setting | `Switch` | Checkbox styled as a switch |
| Include an item in a form or multi-select set | `Checkbox` | Switch when the change is not immediate |
| Pick one visible option from 2–5 compact modes | `SegmentedControl` | Tabs when no content panel changes |
| Pick one explicit option from roughly 2–7 choices | `RadioGroup` | A select that hides a short, useful comparison |
| Pick from a longer list or save narrow space | `Select` | A dense row of buttons |
| Move between content views | `Tabs` | Segmented control used as page navigation |
| Choose an approximate continuous value | `Slider` | Slider for a value that must be exact |
| Enter an exact numeric value | `NumberField` | Unconstrained text input |
| Enter short text | `Input` inside field anatomy | A bare input without a programmatic label |
| Reveal secondary or advanced controls | `Collapsible` / disclosure | A hidden hover-only panel |
| Explain an unfamiliar icon or term | `Tooltip` / `Hint` | Tooltip as the only location for essential instructions |

Controls outside this table start inside the experiment. Promote them only
after a repeated need or a complex accessibility requirement becomes clear.

## Shared Control Anatomy

Every form-like control composes from the same anatomy:

1. `Field` provides the semantic relationship and state.
2. `FieldLabel` names the control in plain language.
3. `FieldDescription` explains consequences or units only when necessary.
4. The primitive owns the input behaviour.
5. `FieldMessage` reports validation or status and is associated with the
   control programmatically.

Use `FieldGroup` to group related fields and `fieldset`/`legend` semantics for
a true set of choices. Required, invalid, read-only and disabled are distinct
states and must remain distinct visually and semantically.

Labels describe the setting, not the widget: “Show highlight,” not “Toggle.”
Place units next to the value they qualify. Do not put essential instructions
only in placeholders or tooltips.

## Demo Recipes

Recipes are composable structure, not configuration objects that render an
entire interface from a schema.

### `DemoShell` and `DemoStage`

Keep the stage and controls in one responsive frame. The stage receives the
largest stable area and contains the experiment object. The default reading
order is stage first, controls second; reverse it only when the control is the
primary learning object and document that decision.

### `DemoPanel`

Use the existing guided panel when the visitor is learning an interface one
part at a time. It owns the heading, progress, step list, explanation, one or
two contextual settings and previous/next actions. It is not a general
control panel.

### `DemoInspector` (planned)

Use for persistent controls that manipulate the stage. Compose it from:

- `DemoInspectorHeader`: title and optional short description;
- `DemoControlSection`: labelled group of related fields;
- field anatomy and UI primitives;
- `DemoInspectorFooter`: optional reset or primary action;
- `DemoAdvanced`: optional disclosure for secondary or diagnostic controls.

The inspector should accept children rather than a control schema. The
experiment remains responsible for values, callbacks, validation and reset
logic.

### Optional recipes

- `DemoToolbar`: a small set of immediate stage actions. Prefer labelled
  buttons; icon-only actions require an accessible label and hint.
- `DemoOutput`: a labelled result, measurement or short status region. Use a
  polite live region only when an update would otherwise be missed.
- `DemoDiagnostics`: event history, raw values or playback controls behind an
  explicit disclosure. Never visible by default without a visitor-facing
  reason.

## Visual Contract

### Tokens

- Shared components use semantic tokens only. Experiment palettes remap those
  roles; components do not add light/dark overrides.
- Reuse the existing control height, icon, radius and motion tokens before
  adding new values.
- Add a token only when at least two components share a durable role. Do not
  turn every measured value into a token.
- Structural panels remain square. Radius communicates a functional object:
  a control, a round control or a device.
- Keep typography roles complete: size, line-height and weight travel
  together, with zero tracking across the system.

### Density and touch

- The fine-pointer visual control height may remain 32px where the existing
  system calls for compact controls.
- On coarse pointers, every interactive target must expose an effective hit
  area of at least 48×48px without visually inflating the whole panel.
- Space related label, control and help text more tightly than adjacent field
  groups.
- Do not offer user-selectable density modes. Responsive density is part of
  the component contract.

### States

Every applicable primitive documents and tests:

- rest, hover, active and focus-visible;
- selected or checked;
- disabled;
- invalid;
- read-only, when the control supports it;
- loading, only for actions that can actually wait.

Hover is an enhancement, never the only signal. Selected, invalid and status
states cannot rely on colour alone.

### Customization boundary

- A component's `className` is for layout only: width, alignment, gap and
  responsive placement. It must not restyle the component's colours, border,
  radius, typography or interaction states.
- If two experiments need a new shared appearance, add a named variant to the
  shared component. If only one experiment needs it, build a domain-local
  control without a shared `.ui-*` class.
- Base UI imports are allowed only inside `src/components/ui/`. Demo recipes
  and experiments consume the local wrappers.
- Use the configured Lucide icon set. Icons inside controls follow the
  `data-icon` contract so sizing belongs to the control, not every call site.
- The public Astro `.btn` pattern and React `Button` solve different runtime
  needs. Keep them visually related, but do not force one implementation
  across both environments.
- Overlay placement comes from the primitive. Do not add arbitrary z-index
  values at call sites.

## Interaction and Motion

- A control acknowledges pointer-down immediately. The state change happens
  on the native activation event, not after decorative animation.
- Direct manipulation stays one-to-one with pointer movement. Do not smooth a
  drag until it feels detached.
- Transitions start from the current rendered value and remain interruptible.
- Use the existing feedback and settle timings. Add a spring library only
  when a real gesture needs velocity-aware continuation or snap-back.
- Reduced motion removes non-essential movement while preserving state
  clarity. Reduced transparency replaces materials with opaque semantic
  surfaces. Increased-contrast preferences must keep boundaries and focus
  visible.

## Accessibility Contract

Every experiment interface must meet these requirements before it is called
complete:

- A keyboard user can reach, operate and leave every control in a logical
  order; composite widgets implement the expected arrow-key model.
- Every control has a programmatic name. Description, units and errors are
  associated with it when present.
- Focus-visible remains clearly distinguishable across page palettes and both
  appearance modes.
- Icon-only actions have an accessible label. Tooltips remain supplemental.
- Touch targets are at least 48×48px on coarse pointers and do not overlap.
- Output updates use a live region only when necessary and never announce
  rapid drag values continuously.
- The interface reflows at 320 CSS pixels and 200% zoom without two-axis
  scrolling, clipped controls or a trapped nested scroll area.
- The stage remains usable with keyboard, touch and coarse pointer input; it
  does not depend on hover.
- Layout and icon direction remain correct when an experiment is tested in
  right-to-left direction, even if the portfolio is not localized yet.

## Responsive Behaviour

- Let content and control minimum widths determine breakpoints; do not target
  named devices.
- Preserve document reading order. CSS may change columns, not meaning.
- On narrow screens, stack stage then panel and let the page scroll. Avoid a
  fixed-height control panel with its own scroll unless the experiment truly
  requires it.
- Sticky controls must not obscure the stage, keyboard focus or the browser's
  own interface.
- A continuous control keeps enough inline room for its label, value and
  thumb. Move the value to a new row before shrinking the hit target.

## Documentation Workbench

`/style-guide` is the in-product source of truth for the implemented system.
Expand it in three layers:

1. **Primitive matrix:** variants and meaningful states in light/dark and
   relevant page palettes.
2. **Control anatomy:** label, description, units, required, invalid,
   read-only and disabled examples.
3. **Recipes:** one guided panel and one control-heavy inspector at desktop
   and narrow widths.

Each specimen names the component's maturity and links to one live adopter.
Do not document a planned API as if it is shipped.

## Governance and Delivery

### Adding or changing a primitive

1. Start with a real experiment need and write the interaction model.
2. Check the configured shadcn/Base UI component and inspect the generated
   diff before accepting it.
3. Wrap the behaviour in `src/components/ui/`; keep it controlled where the
   experiment owns the value.
4. Implement the full applicable state and accessibility matrix.
5. Add a style-guide specimen labelled Candidate.
6. Add behaviour tests for keyboard, pointer and state changes.
7. Adopt it in the real experiment and verify all supported themes and input
   modes.
8. Promote to Supported only when the maturity rule is met.

### Automated boundaries

Static checks should enforce:

- Base UI imports remain inside `src/components/ui/`;
- experiment styles do not target shared `.ui-*` internals;
- shared component CSS uses semantic tokens and approved dimension/motion
  tokens;
- interactive icon usage follows the shared icon contract;
- every supported component has a style-guide specimen and behaviour test.

These are scoped guards, not a global ban on native controls. A native input
inside a simulated device can be correct domain UI.

### Definition of done

A new experiment interface is done when:

- domain state stays in the experiment;
- shared behaviour comes from local UI primitives;
- labels, descriptions and errors are programmatically connected;
- keyboard, pointer, touch and reduced-motion paths work;
- light, dark and authored page palettes remain legible;
- narrow, 200% zoom and coarse-pointer layouts remain operable;
- the style guide and component maturity table reflect reality;
- convention checks, behaviour tests, build and the visual QA matrix pass.
