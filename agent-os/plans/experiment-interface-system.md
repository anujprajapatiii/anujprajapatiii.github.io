# Experiment Interface System

**Status:** Planned — scope approval required before implementation.

## Context

The portfolio now has a strong first reusable slice: Base UI-backed buttons,
switches, segmented controls, tabs, sliders and tooltips; a responsive demo
shell; and a guided `DemoPanel`. Interaction Anatomy proves the guided recipe,
while Nutrition Labels proves a compact mode selector.

The next experiments will need denser control panels and standard field
anatomy. Adding controls one at a time without an explicit contract would
create API drift, experiment-specific overrides and inconsistent accessibility.
This plan extends the current system without redesigning shipped experiments
or prebuilding a dashboard framework.

## Desired Outcome

- New experiments can compose an accessible control panel from a small set of
  supported primitives and recipes.
- The guided explainer and control-panel patterns remain distinct and can
  coexist in the same visual system.
- Experiment state remains local while shared components own interaction
  semantics and visual states.
- Candidate components are proven through real use before their APIs become
  durable.
- `/style-guide` shows implemented states and recipes, not aspirational APIs.
- Automated checks catch architectural and styling drift early.

## Approach

Build one additional vertical slice around a real control-heavy experiment.
First harden the current wrappers and styling boundary. Then add shared field
anatomy and a child-composed `DemoInspector`, followed only by the controls the
selected experiment actually needs. Treat physical gesture and advanced
controls as later, evidence-led work.

The durable contract lives in
`agent-os/conventions/experiment-interfaces.md`.

## Scope

### In Scope

- Document component ownership, maturity, selection, responsive behaviour,
  accessibility and promotion rules.
- Reconcile current Base UI wrappers with the configured shadcn conventions.
- Separate UI primitive styles from demo recipe styles.
- Add reusable field anatomy and a composable inspector recipe.
- Add the minimum input primitives required by one approved live adopter.
- Expand the style guide into a state and recipe workbench.
- Add structural, behaviour, accessibility and visual regression checks.

### Out of Scope

- Redesigning Interaction Anatomy or Nutrition Labels.
- Rewriting the site-wide Astro button pattern as React.
- A schema-driven control renderer, generic dashboard or plugin system.
- Data visualization primitives, code editors, timelines or drag canvases
  without a specific experiment need.
- Diagnostics shown by default.
- User-selectable compact/comfortable density modes.
- Storybook or a new documentation dependency.
- A motion or spring library before a real gesture needs it.
- Content or imagery changes.

## Files

Documentation in this planning pass:

- `agent-os/conventions/experiment-interfaces.md`
- `agent-os/conventions/architecture.md`
- `agent-os/system-map.md`
- `agent-os/plans/experiment-interface-system.md`

Likely implementation files after scope approval:

- `src/components/ui/button.tsx`
- `src/components/ui/segmented-control.tsx`
- `src/components/ui/slider.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/field.tsx`
- approved input primitives in `src/components/ui/`
- `src/components/demo/DemoInspector.tsx`
- optional approved recipes in `src/components/demo/`
- split primitive and demo recipe styles under `src/styles/`
- `src/components/demo/DemoPrimitivesSpecimen.tsx`
- `src/pages/style-guide.astro`
- `scripts/check-conventions.mjs`
- focused component behaviour tests and visual-matrix configuration

## DESIGN AUDIT RESULTS

### Overall Assessment

The current demo system is visually coherent and unusually disciplined for a
small portfolio: semantic tokens, Base UI wrappers and a clear domain-state
boundary are already in place. The main weakness is not appearance; it is
coverage and governance. The guided panel is being asked to represent the
whole system even though control-heavy experiments need a different recipe,
several wrappers are unproven, and the style guide does not expose their state
matrices.

### Phase 1 — Critical

#### 1. Establish the contract and maturity model

- **Issue:** Existing architecture describes the folder boundary but not how
  components are selected, promoted or customized.
- **Why it matters:** New experiments can silently turn candidate APIs and
  one-off CSS into permanent conventions.
- **Direction:** Adopt the experiment interface convention, label existing
  wrappers Candidate or Supported, and require a live adopter for promotion.
- **Acceptance:** The system map, architecture convention, style guide and
  component catalog agree on what is shipped and supported.

#### 2. Harden the current primitive boundary

- **Issue:** Experiment CSS currently restyles a shared secondary button, icon
  sizing is broader than the configured `data-icon` contract, and tooltip CSS
  owns an arbitrary overlay z-index.
- **Why it matters:** Shared visuals become unpredictable and overlay/icon
  behaviour drifts from the configured component system.
- **Direction:** Replace the button override with an approved shared variant
  or a domain-local control; align icons to `data-icon`; let Base UI own overlay
  stacking unless a documented site layer requires otherwise.
- **Acceptance:** Experiments use `className` for layout only and do not target
  shared `.ui-*` internals.

#### 3. Separate primitive styles from recipe styles

- **Issue:** `demo-controls.css` mixes low-level control states with guided
  panel composition in one large file.
- **Why it matters:** Expansion will increase collision risk and make ownership
  harder to review.
- **Direction:** Split files by the system layers while preserving selectors
  and rendered output during the move.
- **Acceptance:** UI primitives and demo recipes have clear, documented style
  ownership with no visual regression.

#### 4. Add field anatomy before more form controls

- **Issue:** The system has behaviour primitives but no shared relationship for
  labels, descriptions, units, validation or grouped fields.
- **Why it matters:** Control panels fail through inconsistent anatomy more
  often than through missing widget types.
- **Direction:** Add `Field`, `FieldGroup`, `FieldLabel`,
  `FieldDescription` and `FieldMessage`, then prove required, invalid,
  read-only and disabled states.
- **Acceptance:** Every form-like candidate composes through the shared anatomy
  and exposes correct accessible relationships.

#### 5. Add a control-panel recipe, not another guided-panel variant

- **Issue:** `DemoPanel` correctly optimizes for step-by-step explanation, not
  persistent experiment controls.
- **Why it matters:** Overloading it would make both patterns less legible and
  create conditional-prop APIs.
- **Direction:** Build a child-composed `DemoInspector` with header, grouped
  controls, optional advanced disclosure and optional footer.
- **Acceptance:** One real experiment adopts it without moving domain state
  into the shared recipe.

#### 6. Turn the style guide into a state workbench

- **Issue:** The current demo section shows the guided panel but not primitive
  variants, focus, selected, disabled, invalid or narrow-layout behaviour.
- **Why it matters:** Regressions remain hidden until a live experiment exposes
  them.
- **Direction:** Add maturity-labelled primitive, field-anatomy and recipe
  specimens. Keep planned APIs out until implemented.
- **Acceptance:** Every Supported component has a live adopter, complete
  applicable state specimen and documented usage boundary.

#### 7. Add structural guards

- **Issue:** Current checks protect tokens and hit targets but not direct Base
  UI imports or experiment overrides of shared component internals.
- **Why it matters:** The architecture can regress without a build failure.
- **Direction:** Add scoped checks for import ownership, shared-class styling,
  icon contracts and specimen/test coverage.
- **Acceptance:** Deliberate fixture violations fail with actionable messages;
  correct domain-native controls remain allowed.

### Phase 2 — Refinement

#### 1. Prove the minimum control set in one live experiment

- Select a real control-heavy experiment before implementation.
- Add only the inputs it needs, likely from `Input`, `NumberField`,
  `Checkbox`, `RadioGroup`, `Select` and `Collapsible`.
- Use the configured shadcn CLI as a reference, review generated diffs, and
  adapt wrappers to local tokens and controlled state.
- Keep new components Candidate until the maturity rule is met.

#### 2. Add focused behaviour and accessibility tests

- Test keyboard models, names/descriptions, disabled/invalid states, controlled
  updates and pointer activation for every Supported component.
- Test inspector reading order, reset behaviour and advanced disclosure.
- Prefer the smallest test dependency that can exercise browser semantics;
  approve any new dependency before adding it.

#### 3. Add optional recipes only when the adopter needs them

- Add `DemoToolbar` for immediate stage actions.
- Add `DemoOutput` for named measurements or results.
- Add `DemoDiagnostics` only behind explicit disclosure.
- Keep each recipe child-composed and independent of experiment data models.

#### 4. Refine responsive control anatomy

- Verify compact visual density on fine pointers and effective 48×48px targets
  on coarse pointers.
- Test 320px width, 200% zoom, long labels and keyboard focus visibility.
- Let content determine the inspector breakpoint; avoid nested scroll panels.

### Phase 3 — Polish

#### 1. Add physical motion only to proven direct manipulation

- If a real experiment introduces dragging, snapping or velocity, implement
  one-to-one tracking, interruptible continuation and reduced-motion fallbacks.
- Add a spring dependency only if CSS cannot express the required interaction.

#### 2. Expand the visual regression matrix

- Cover every Supported primitive and both recipes in light/dark, relevant
  page palettes, desktop/narrow layouts and fine/coarse pointer modes.
- Include reduced motion, increased contrast and reduced transparency where
  supported.
- Finish with a real coarse-pointer device pass for the adopted experiment.

#### 3. Consider advanced controls only with evidence

- Colour fields, range pairs, timelines, drag canvases and code-oriented
  controls remain domain-local until repeated use justifies promotion.
- Review Candidate components periodically; promote, revise or remove them.

### Design System Updates Required

- Adopt component maturity metadata in documentation.
- Add field anatomy and validation state tokens only where existing semantic
  roles cannot express them.
- Add a composable inspector recipe next to the guided panel recipe.
- Split primitive styles from demo recipe styles.
- Align shared icons, overlays and customization with the configured Base UI
  and shadcn conventions.
- Expand `/style-guide` and automation to cover implemented state matrices.

### Implementation Notes

- The project uses shadcn's Base UI base, not Radix. Follow Base UI composition
  APIs such as `render`; do not introduce Radix `asChild` patterns.
- Single-thumb sliders use a scalar value. Base UI toggle groups use array
  values even for a single selected item; local wrappers may adapt this to a
  clear consumer API.
- Keep focus and accessible semantics inside primitives, but keep experiment
  state controlled by the experiment.
- Avoid broad raw-control lint rules. Simulated devices and authored experiment
  objects may correctly use native controls.
- Preserve the current visual result while moving CSS; separation is an
  architecture change, not a redesign.
- No source implementation begins until this plan's Scope is approved and a
  real Phase 2 adopter is named.

## Steps

1. Approve this Scope and select the first control-heavy experiment adopter.
2. Complete Phase 1 in a dedicated branch with before/after visual captures.
3. Review the field anatomy, inspector composition and state workbench in the
   browser before adding more primitives.
4. Implement only the adopter's minimum Phase 2 control set and behaviour
   tests.
5. Run convention checks, focused tests, production build and the supported
   visual matrix.
6. Promote components only when the maturity criteria and live-use evidence
   are met.
7. Reassess Phase 3 after the adopter reveals actual gesture or advanced
   control needs.

## Review

Before merge, confirm:

- the implementation matches the approved Scope;
- current experiments are visually and behaviourally unchanged unless an
  explicit improvement was approved;
- the inspector API is compositional rather than schema-driven;
- domain state remains in the adopter;
- primitive states, accessible relationships and coarse-pointer targets pass;
- the style guide documents only implemented behaviour;
- convention checks, tests and `pnpm build` pass;
- the final visual matrix includes a real coarse-pointer device.

## Learnings

After implementation, capture a learning note if the first inspector adopter
changes the component-selection rules, maturity threshold, responsive model or
state boundary. Update this convention directly when the rule is durable
across future experiments.

