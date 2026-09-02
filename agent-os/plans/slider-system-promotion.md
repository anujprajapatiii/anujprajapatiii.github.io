# Slider System Promotion

## Status

Complete

## Context

The Slider Lab selected Option A after comparing three compact continuous-value
controls. The shared production Slider still uses the former rounded accent
rail, while the selected square neutral fill-field treatment remains in
temporary lab files.

## Desired Outcome

- The existing Base UI-backed `Slider` becomes the single permanent interface.
- The selected quiet full-height fill, inline label and value, 44px field, and
  48×8px edge handle live in the central component and control stylesheet.
- A normal Style Guide section documents active, disabled, endpoint, theme,
  and narrow-layout behavior.
- Focused browser coverage protects smooth 0.1 stepping, keyboard behavior,
  endpoint mapping, geometry, theme clarity, and the global theme shortcut.
- The temporary Slider Lab and all rejected directions are removed.

## Approach

Keep `src/components/ui/slider.tsx` as the only external seam and deepen it
around the selected single-value use case. Base UI continues to own input
semantics, focus, pointer dragging, keyboard behavior, and form integration.
The local wrapper owns the visible label, rounded display value, description,
endpoints, fine-step default, and the brief settle transition used only for
track presses.

## Scope

In:

- Promote Option A as one square, neutral, horizontal, single-value Slider.
- Support controlled and uncontrolled values, custom ranges and steps, visible
  labels, optional descriptions, disabled state, and formatted live values.
- Preserve 0.1 default stepping with a 1-unit large step and exact 0%/100%
  endpoint mapping.
- Cover hover, active, focus-visible, disabled, light/dark, reduced-motion,
  coarse-pointer, increased-contrast, forced-colour, and narrow layouts.
- Add a durable Style Guide specimen and focused Playwright suite.
- Remove the lab route, lab component/style, experimental wrapper, segmented
  Option B, inset Option C, and lab-only test command.
- Update design-system conventions, system map, and the exploration record.

Out:

- Segmented, inset, vertical, range, multiple-thumb, icon, accent-colour, or
  size variants.
- Adding a production adopter solely to prove use.
- Changing Switch, Tabs, Buttons, or unrelated pages.
- Merging or deploying the branch.

## Files To Modify

- `src/components/ui/slider.tsx`: formal single-value component interface.
- `src/styles/ui-controls.css`: selected geometry, materials, and states.
- `src/components/SliderSpecimen.tsx`: permanent supported examples.
- `src/components/slider-specimen.css`: specimen-only composition.
- `src/pages/style-guide.astro`: normal Slider documentation section.
- `src/data/style-guide.ts`: Slider navigation and component summary.
- `tests/slider.spec.ts`: focused behavior, geometry, theme, and scale checks.
- `package.json`, `.github/workflows/checks.yml`: permanent Slider test command.
- `scripts/check-conventions.mjs`: supported-component and cleanup guards.
- `agent-os/conventions/styling.md`: durable visual contract.
- `agent-os/conventions/experiment-interfaces.md`: supported behavior contract.
- `agent-os/system-map.md`: supported primitive and test suite inventory.
- `agent-os/plans/slider-design-exploration.md`: final decision and cleanup.

## Temporary Files To Remove

- `src/pages/lab/sliders.astro`
- `src/components/lab/sliders/SliderLab.tsx`
- `src/components/lab/sliders/slider-lab.css`
- `src/components/ui/experimental-slider.tsx`
- `tests/slider-lab.spec.ts`

## Steps

- [x] Promote the selected component interface and central styles.
- [x] Add the permanent Style Guide specimen.
- [x] Convert lab coverage into focused supported-component tests.
- [x] Add convention and pull-request checks.
- [x] Remove all temporary Slider Lab code and rejected directions.
- [x] Run type, convention, browser, build, diff, and visual checks.
- [x] Record final review and learnings.

## Review

- Design: The selected neutral fill-field stays calm in both themes, the
  44px field and 48px handle keep their intended proportion, and 0%/100% map
  to the physical track edges without clipping the handle.
- Content: The permanent specimen uses short setting labels, supporting copy,
  live values, endpoints, and a disabled state rather than lab comparison
  language.
- Architecture: Base UI remains responsible for Slider behavior while the
  project wrapper owns one intentionally narrow horizontal, single-value
  interface. Shared styling and geometry live in the central control and token
  files; the Style Guide specimen only composes examples.
- Verification: `pnpm check`, `pnpm build`, `pnpm test:slider`,
  `pnpm test:switch`, `pnpm test:tabs`, and `git diff --check` pass. The
  permanent Style Guide specimen was reviewed at desktop and 320px widths in
  light, dark, disabled, focused, endpoint, and reduced-motion states.

## Learnings

- Center thumb alignment lets the fill reach the true track endpoints while
  the handle can extend beyond the shorter field.
- A 44px visible field can share a 48px layout footprint with its handle by
  reserving 2px above and below instead of making the surface feel chunky.
- Fine 0.1 stepping and a rounded display value can coexist: precision stays
  in the control state while the visible percentage remains easy to scan.
- Keeping the inline label and value in a non-intercepting layer preserves the
  full drag surface and avoids dead zones over the text.
