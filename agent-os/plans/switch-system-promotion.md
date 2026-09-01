# Switch System Promotion

## Status

Complete

## Context

The Switch Lab selected one solid-rail direction after comparing six neutral,
boxy treatments. The final measurements are a 42×20 track, a 22×16 thumb, a
2px resting inset, and 16px of travel. The shared production Switch still uses
the former 32×20 round treatment, while the selected implementation remains in
temporary lab files.

## Desired Outcome

- The existing Base UI-backed `Switch` becomes the single permanent interface.
- The selected square, neutral geometry and full interaction-state treatment
  live in the central control stylesheet and semantic geometry tokens.
- A normal Style Guide section documents the supported primitive with checked,
  unchecked, disabled, labelled, and described examples.
- Focused browser coverage protects behavior, geometry, theme clarity, and
  narrow-layout stability.
- All temporary Switch Lab code and generated handoff artifacts are removed.

## Scope

In:

- Promote the selected 42×20 solid rail and 22×16 thumb.
- Keep the existing `Switch` name and Base UI behavior seam.
- Preserve position plus visible On/Off text as redundant state cues in the
  permanent specimen.
- Cover pointer, keyboard, disabled, RTL, light/dark, reduced-motion,
  coarse-pointer, forced-colour, and increased-contrast states.
- Add one clean Style Guide section beside Actions, Tables, and Tabs.
- Add focused browser behavior and geometry tests and run them in pull-request
  checks.
- Remove the temporary lab route, lab component/style, experimental wrapper,
  and Figma Make export.
- Update design-system conventions, system map, and the completed exploration
  record.

Out:

- Adding visual variants, size props, icons, inner marks, or accent colours.
- Changing the header theme toggle or unrelated form controls.
- Adding a production adopter solely to prove usage.
- Merging or deploying the branch.

## Files To Modify

- `src/components/ui/switch.tsx`
- `src/styles/global.css`
- `src/styles/ui-controls.css`
- `src/components/SwitchSpecimen.tsx`
- `src/components/switch-specimen.css`
- `src/pages/style-guide.astro`
- `src/data/style-guide.ts`
- `tests/switch.spec.ts`
- `package.json`
- `.github/workflows/checks.yml`
- `scripts/check-conventions.mjs`
- `agent-os/conventions/styling.md`
- `agent-os/conventions/experiment-interfaces.md`
- `agent-os/system-map.md`
- `agent-os/plans/switch-design-exploration.md`

## Temporary Files To Remove

- `src/pages/lab/switches.astro`
- `src/components/lab/switches/SwitchLab.tsx`
- `src/components/lab/switches/switch-lab.css`
- `src/components/ui/experimental-switch.tsx`
- Generated Figma Make Switch Lab handoff directory.

## Steps

- [x] Replace the old production geometry and styling with the selected
  direction.
- [x] Add the permanent Style Guide specimen.
- [x] Add focused behavior, geometry, theme, and responsive tests.
- [x] Add convention checks for the supported Switch contract.
- [x] Remove all temporary lab and handoff artifacts.
- [x] Run type, convention, browser, build, diff, and visual checks.
- [x] Record final review and learnings.

## Review

- Design: the selected 42×20 rail and 22×16 thumb remain clear in checked,
  unchecked, disabled, light, dark, and narrow layouts. Both resting positions
  keep the specified 2px inset and the component stays square and neutral.
- Content: the permanent specimen explains immediate boolean settings through
  three realistic rows without retaining lab comparison language.
- Architecture: one Base UI-backed `Switch` owns behavior while central tokens
  and control styles own geometry and states. The specimen only composes the
  supported primitive and `Field` anatomy.
- Verification: TypeScript, convention checks, the production build, four
  Switch browser tests, seven Tabs regression tests, diff checks, and visual
  reviews at desktop and 320px all pass.

## Learnings

The compact 42×20 rail needs explicit width, height, inset, and travel tokens;
deriving travel from percentages made exact resting edges harder to protect.
RTL also needs a mirrored signed translation because the flex start edge
changes with document direction. A coarse-pointer hit area must remain a real
pointer target even though the visible component stays 20px high. Focused
browser geometry tests now protect those details without turning the Style
Guide specimen into test-only markup.
