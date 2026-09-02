# Experiment Interface System

**Status:** Active. The lean foundation is implemented; advanced controls and
promotion remain gated by real experiment needs.

## Purpose

This system gives native experiments a small, reliable kit of accessible
interaction primitives. It should make a new experiment quicker to build
without imposing a shared panel or page composition.

The intended experience is calm, direct and curious. Controls should feel
immediate and physical, but the styling stays consistent with the portfolio:
KMR Apparat, zero tracking, semantic colour, restrained surfaces and minimal
chrome.

## Working Model

For day-to-day design work, remember four things:

- **Tokens are the materials:** colour, type, space, radius and motion.
- **Primitives are the parts:** button, switch, segmented control and slider.
- **Fields arrange the parts:** label, control and optional explanation.
- **The experiment owns the idea:** its state, behaviour and visual character
  remain local.

Start with the parts that already exist. Add a new shared control only when a
real experiment needs it; until then, leave it out.

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
| Control anatomy | Label, description, message, units and field grouping | Page composition or domain-specific copy | `src/components/ui/` |
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
| `Button`, `IconButton` | Supported | Previously validated in Interaction Anatomy; this accessibility-critical action primitive has a deliberately small API and a shared `data-icon` contract. |
| `Switch` | Supported | Accessibility-critical primitive with a permanent Style Guide specimen and focused browser coverage for semantics, geometry, themes, direction, motion, and narrow layouts. |
| `SegmentedControl` | Candidate | Previously tested in Nutrition Labels; validate it with the next real mode switch. |
| `Tabs` | Supported | Promoted through the behaviourally-complex exception: the formal style-guide specimen and browser suite protect Line, Contained, direction, collection, keyboard and overflow behaviour before production adoption. |
| `Slider` | Supported | The continuous-value experiment selected one single-value fill field; a permanent Style Guide specimen and focused browser suite protect semantics, precision, geometry, themes, motion, endpoints, and narrow layouts. |
| `Tooltip` / `Hint` | Candidate | Provider exists, but the content wrapper has no live adopter. Overlay placement remains owned by Base UI and hints stay supplemental. |
| `Field`, `FieldLabel` | Supported | The accessibility-critical label/control relationship was validated in Interaction Anatomy. |
| Remaining field anatomy | Candidate | `FieldGroup`, `FieldContent` and `FieldDescription` exist, but fieldset and error APIs remain unproven in live use. |

### Lean foundation implemented

- Shared UI primitive styles have one owner in `src/styles/ui-controls.css`.
- The field family provides shared label, description, grouping, disabled and
  invalid anatomy without introducing a form framework.
- `/style-guide` documents supported primitives as ordinary top-level sections,
  alongside established sections such as Actions and Tables.
- Convention checks protect the Base UI import boundary and shared `.ui-*`
  style ownership.

Additional input primitives, a full state matrix and dedicated browser-test
dependencies remain deferred until a real control-heavy experiment needs
them.

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

### `Switch`

Switch is the Supported control for an immediate boolean setting. Keep one
local Base UI-backed module so pointer, keyboard, form, focus, checked, and
disabled behavior remain behind the same small interface.

- The visual contract is one 42×20 square solid rail with a 22×16 borderless
  thumb, a 2px resting inset on every near edge, and 16px of travel. There are
  no appearance or size variants.
- Off uses the persistent neutral `--border-interactive` rail. On uses
  `--background-alternate`. The thumb uses the elevated surface while off and
  the primary surface while on. Hover, active, disabled, increased-contrast,
  forced-colour, and reduced-motion treatments stay in the shared stylesheet.
- Thumb position is the required non-colour state cue. A nearby visible On/Off
  value is recommended when settings are scanned in rows, but the programmatic
  label must still name the setting itself rather than the widget.
- Use controlled state when the owner needs the value immediately. The Base UI
  uncontrolled interface remains available for simple local settings. Do not
  place save semantics inside the Switch; if a change waits for form
  submission, use Checkbox instead.
- Logical direction is inherited. In RTL, the unchecked and checked resting
  edges mirror without callers reversing state or changing the value model.
- The compact visible control retains a 48×48px effective target on coarse
  pointers without changing surrounding layout.

The formal contract does not include icons, inner marks, loading state,
indeterminate state, labels inside the rail, accent-colour variants, or a size
selector. Those needs require a separate design decision rather than more
props on this primitive.

### `Slider`

Slider is the Supported control for an approximate continuous value. Keep one
local Base UI-backed module so pointer dragging, track presses, keyboard input,
focus, disabled state, form behavior, and accessible value text remain behind
the same interface.

- The supported anatomy is horizontal and single-value: a visible label and
  rounded live value inside one square 44px field, an optional description,
  and formatted minimum and maximum endpoints below it.
- The 48×8px handle is center-aligned to the fill edge, projects 2px above and
  below the field, and allows the indicator to map exactly from the minimum to
  the maximum without reserving endpoint gaps.
- Controlled and uncontrolled values are supported. The default step is 0.1
  for fine pointer and Arrow-key control; the default large step is 1. The
  displayed value may round more coarsely than the stored value, and custom
  ranges use one `formatValue` function for the live value, endpoints, and
  assistive value text.
- Direct dragging remains immediate. Track presses alone use the shared brief
  settle motion, and reduced-motion removes that travel without changing the
  final value.
- The label is required and programmatically names the slider. Description is
  optional but, when present, is associated with the nested range input.
- The primitive inherits logical direction, appearance mode, and authored page
  palettes through semantic roles. Disabled, increased-contrast, and
  forced-colour treatments stay centralized in `ui-controls.css`.

The formal contract does not include segmented, inset, vertical, range,
multiple-thumb, icon, accent-colour, or size variants. Those needs require a
new design decision rather than more props on this primitive.

### `Tabs`

Tabs are Supported through the behaviourally-complex maturity exception. The
formal style-guide specimen is the stable proving ground, and the repeatable
browser suite provides the evidence required for this composite widget before
production adoption. Keep one local `Tabs` family rather than separate Line
and Contained implementations so semantics, focus and fallback behaviour
cannot drift between appearances.

Choose the appearance by panel context:

- **Line** (`variant="line"`) connects a content view to the edge of its
  panel with a quiet rule and neutral active indicator. It defaults to
  `layout="content"`, allowing each visible label to take the width it needs.
- **Contained** (`variant="contained"`) groups a compact set of peer views on
  one bounded neutral surface. The selected trigger uses a surface shift plus
  paired light-and-shadow inset borders, with no indicator line. It defaults
  to `layout="equal"` so short, comparable choices carry equal weight.
- `layout` is an intentional sizing override, not a third appearance. Use
  `equal` only when the set is small, labels are similarly short and the
  available inline size remains comfortable. Use `content` for varied,
  translated, long or dynamic labels. Omitting it preserves the
  variant-aware defaults above.

The shared behaviour contract is the same for both appearances:

- Trigger and panel values are stable, unique strings. Every server-rendered
  set supplies exactly one explicit enabled `defaultValue`, or one enabled
  controlled `value`; the server cannot infer which registered trigger is
  enabled. A controlled owner remains responsible when its selected value
  becomes disabled or disappears. An uncontrolled set may use Base UI's
  first-enabled fallback. Its `onValueChange` handler must also accept `null`
  because no fallback exists if a dynamic collection removes every enabled
  tab; supported call sites keep at least one enabled tab available.
- Activation is manual by default: horizontal or vertical Arrow keys move
  focus, Home and End reach the bounds, and Enter or Space selects the focused
  view. Pointer activation selects immediately. Set `activateOnFocus` only
  when every panel is already available and changing views has no delay,
  destructive effect or expensive work.
- A disabled trigger remains discoverable in the roving-focus sequence and
  exposes `aria-disabled`, but pointer, Enter and Space cannot activate it.
  Do not replace that composite-widget behaviour with a native disabled
  button or remove it from the collection merely to skip focus.
- Set `orientation` from the visual arrangement and set `dir` on `Tabs` when
  direction is known. Horizontal Arrow behavior mirrors in RTL; vertical
  Up/Down behavior does not. A live direction switch preserves selection and
  causes the Line indicator to remeasure after layout. Call sites do not
  reverse arrays or patch physical CSS to simulate direction.
- Inactive panels unmount by default. Use `keepMounted` only when panel-local
  state, measured layout or persistent DOM is a documented requirement; a
  hidden mounted panel remains non-interactive.

Tabs scale by preserving the interaction model, not by squeezing labels.
Labels are visible, one-line panel identities in sentence case; icons may be
supplemental but icon-only tabs are outside the supported contract. A
horizontal list stays on one row and scrolls within its own inline region when
content no longer fits. It never wraps, shrinks its touch targets or makes the
page scroll sideways. Prefer `content` sizing before labels collide, and let
keyboard focus expose an off-screen trigger. A vertical set needs enough
inline room for both the list and its panel.

The formal contract supports Line and Contained appearances, horizontal and
vertical orientation, LTR and RTL, controlled and uncontrolled values,
manual and automatic activation, disabled items, dynamic collections,
optional mounted panels, and single-axis overflow. It does not cover route or
URL navigation, closable or reorderable tabs, nested tabsets, icon-only tabs,
asynchronously unavailable panels, experiment-local recolouring, or a third
visual variant. Those needs require a separate design decision rather than
more props on this primitive.

## Shared Control Anatomy

Every form-like control composes from the same anatomy:

1. `Field` provides the semantic relationship and state.
2. `FieldLabel` names the control in plain language.
3. `FieldDescription` explains consequences or units only when necessary.
4. The primitive owns the input behaviour.
5. `FieldError` reports validation; connect its `id` to the control with
   `aria-describedby`. Non-error output remains local to the experiment.

Use `FieldGroup` to group related fields and `fieldset`/`legend` semantics for
a true set of choices. Required, invalid, read-only and disabled are distinct
states and must remain distinct visually and semantically.

Labels describe the setting, not the widget: “Show highlight,” not “Toggle.”
Place units next to the value they qualify. Do not put essential instructions
only in placeholders or tooltips.

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

For actions, use one hierarchy across the site:

- primary advances or completes the action a region is for;
- secondary supports that action without competing;
- quiet handles reset, previous and other low-emphasis commands;
- loading retains the chosen variant and its dimensions, exposes `aria-busy`,
  prevents repeat activation and remains focusable until the work finishes.

Button rest, hover and active colours come from the neutral `--button-*`
component roles. Experiment-local CSS must not recolour them, and authored page
palettes do not remap them. Primary hover moves to a slightly darker surface;
pressed/active flips to the light surface. Text contrast follows that surface
change. Button labels do not append decorative arrows.

### Customization boundary

- A component's `className` is for layout only: width, alignment, gap and
  responsive placement. It must not restyle the component's colours, border,
  radius, typography or interaction states.
- If two experiments need a new shared appearance, add a named variant to the
  shared component. If only one experiment needs it, build a domain-local
  control without a shared `.ui-*` class.
- Base UI imports are allowed only inside `src/components/ui/`. Experiments
  consume the local wrappers.
- Use the configured Lucide icon set. Icons inside controls follow the
  `data-icon` contract so sizing belongs to the control, not every call site.
- Public links presented as actions use `ActionLink.astro`; React commands use
  `Button` or `IconButton`. They solve different runtime needs and share the
  neutral state contract without forcing one implementation across both.
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
- The experiment remains usable with keyboard, touch and coarse pointer input;
  it does not depend on hover.
- Layout and icon direction remain correct when an experiment is tested in
  right-to-left direction, even if the portfolio is not localized yet.

## Responsive Behaviour

- Let content and control minimum widths determine breakpoints; do not target
  named devices.
- Preserve document reading order. CSS may change columns, not meaning.
- On narrow screens, preserve the authored reading order and let the page
  scroll. Avoid fixed-height nested control regions unless the experiment
  truly requires them.
- Sticky controls must not obscure experiment content, keyboard focus or the
  browser's own interface.
- A continuous control keeps enough inline room for its label, value and
  thumb. Move the value to a new row before shrinking the hit target.

## Documentation Workbench

`/style-guide` is the in-product source of truth for the implemented system.
Expand it in two layers:

1. **Primitive matrix:** variants and meaningful states in light/dark and
   relevant page palettes.
2. **Control anatomy:** label, description, units, required, invalid,
   read-only and disabled examples.

Actions, Switch, Tables and Tabs are ordinary top-level sections rather than
content nested inside a special panel specimen. Each specimen names the
component's maturity and points to a live adopter when one exists. Do not
document a planned API as if it is shipped.

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
