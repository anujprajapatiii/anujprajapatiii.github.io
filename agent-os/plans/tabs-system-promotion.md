# Tabs System Promotion

## Status

Complete

## Context

The temporary Tabs Lab proved one shared Base UI Tabs primitive across line,
contained, vertical, and overflow contexts. At the start of this work, the
primitive was Candidate because its keyboard and state contract was only
browser-reviewed, not protected by a repeatable behaviour suite. The formal
Line and Contained additions now live in the design system without a production
adopter; the temporary public lab was retired before release.

Tabs qualify for the existing behaviourally-complex promotion exception: the
durable style-guide fixture plus automated browser coverage is enough to move
the primitive to Supported without weakening the wider maturity rule.

Official shadcn guidance keeps one composable Tabs family and exposes line as
a list variant. Base UI supplies the state, ARIA relationships, controlled and
uncontrolled operation, orientation, activation modes, focus looping, and
panel lifecycle. The local module should deepen that seam rather than create
separate `LineTabs` and `ContainerTabs` implementations.

## Desired Outcome

- One Supported `Tabs` module exposes two formal visual variants: `line` and
  `contained`.
- The interface is small, typed, direction-aware, and explicit about sizing,
  activation, SSR defaults, disabled behaviour, and panel mounting.
- A durable style-guide specimen documents both variants and exercises their
  supported states without depending on a production adopter.
- Real-browser tests protect semantics, keyboard and pointer behaviour,
  controlled and uncontrolled state, dynamic collections, RTL, and responsive
  overflow. Shared convention checks protect the visual variant contract.
- Pull-request checks run the Tabs behaviour suite so Supported status remains
  evidence-backed.

## Design Framing

- **Human:** a future maintainer choosing a peer-view control without having to
  rediscover its interaction or layout limits.
- **Task:** choose Line or Contained, supply stable values and panels, and rely
  on one verified behaviour contract.
- **Feel:** quiet, exact, structural, and native to the portfolio system.
- **Domain:** peer views, continuity, focus, selection, panel context,
  orientation, overflow, and collection change.
- **Colour world:** paper canvas, inset neutral, raised neutral, graphite text,
  quiet rules, and neutral selection contrast.
- **Signature:** Line tabs join the active view to its panel with an edge rule;
  Contained tabs use a bounded surface and selected fill with no underline.
- **Rejecting:** separate variant implementations, pill styling, colour-only
  state, wrapped tab rows, and a large configuration surface.

## Approach

Keep `src/components/ui/tabs.tsx` as the single external seam. Preserve Base
UI's state and composition props, keep the verified Enter compatibility guard,
and stabilize only the local decisions callers must know:

- `variant="line" | "contained"` on `TabsList`;
- `layout="content" | "equal"` as an optional sizing override, with a
  variant-aware default (`line` → content, `contained` → equal);
- `dir="ltr" | "rtl"` on `Tabs`, wired to both HTML direction and Base UI's
  direction provider;
- stable string values plus exactly one controlled `value` or uncontrolled
  `defaultValue`, with nullable uncontrolled fallback callbacks;
- string-only `className` values at the wrapper seam, matching the existing
  layout-only customization rule.

Render the animated indicator only for Line tabs. Contained tabs use the
selected trigger surface, with an additional non-colour cue for increased or
forced contrast. Keep compact visual density on fine pointers and meet the
shared 48px effective target contract on coarse pointers.

Use one Playwright dependency for real-browser coverage. The internal style
guide specimen will be the stable test fixture and will include two independent
sets plus controlled collection changes, long labels, disabled state, and an
overflow stress case. This avoids shipping a separate test-only route or adding
Storybook.

## Scope

In:

- Formal Supported status for the existing Line and Contained variants.
- A stable, documented Tabs interface with variant-aware sizing defaults,
  explicit direction support, line-only indicator work, and string-only layout
  classes.
- Selected, hover, active, focus-visible, disabled, increased-contrast,
  forced-colour, reduced-motion, and coarse-pointer treatment using existing
  semantic tokens.
- A live style-guide specimen for both variants, including controlled dynamic
  collection and long-label stress cases.
- Real-browser behaviour and scalability tests for semantics, pointer and
  keyboard input, controlled/uncontrolled state, disabled and missing-item
  fallback, panel mounting, multiple instances, live direction changes, RTL,
  overflow, and responsive layouts.
- Pull-request test automation plus narrow convention guards tying Supported
  status to the formal specimen and behaviour suite.
- Documentation updates in the existing style and experiment-interface
  conventions.

Out:

- Separate `LineTabs` or `ContainerTabs` modules.
- Router-backed, URL-persistent, closable, reorderable, nested, icon-only, or
  asynchronous tabs.
- A third visual variant, new design tokens, a density selector, or custom
  experiment recolouring.
- Migrating unrelated pages or inventing a production adopter.
- Storybook, a general component-test framework, or visual snapshot baselines.

## Files To Modify

- `src/components/ui/tabs.tsx`: stabilize the Tabs interface and keep variant
  implementation details behind the shared seam.
- `src/styles/ui-controls.css`: harden formal states, input modes, indicator
  ownership, and scalability without new tokens.
- `src/components/TabsSpecimen.tsx`: add the durable Supported specimen and
  browser-test fixture.
- `src/components/tabs-specimen.css`: frame only the specimen and stress cases;
  shared Tabs styling stays centralized.
- `src/pages/style-guide.astro`: document Line and Contained tabs as Supported
  and render the live specimen.
- `tests/tabs.spec.ts`: cover the public interface through real browser input
  and DOM semantics.
- `playwright.config.ts`: run the focused Chromium suite against the local
  Astro site at deterministic desktop and narrow viewports.
- `package.json`, `pnpm-lock.yaml`: add the focused test command and Playwright
  development dependency.
- `.github/workflows/checks.yml`: install Chromium and run the behaviour suite
  before the production build.
- `scripts/check-conventions.mjs`: guard the two formal variants, centralized
  style ownership, Supported specimen, and test presence.
- `agent-os/conventions/experiment-interfaces.md`: record the stable variant,
  behaviour, sizing, and maturity contract.
- `agent-os/conventions/styling.md`: record the durable square, neutral visual
  treatment and label/overflow guidance.
- `agent-os/system-map.md`: record the Supported Tabs subsystem and CI suite.
- `agent-os/plans/tabs-system-promotion.md`: capture verification and learnings.

## Steps

- [x] Stabilize the shared Tabs interface and remove hidden work from
  Contained tabs.
- [x] Complete contrast, forced-colour, coarse-pointer, direction, and
  overflow states.
- [x] Add the formal style-guide specimen and scalability harness.
- [x] Add Playwright coverage for the interaction, collection, accessibility,
  and responsive matrix.
- [x] Add pull-request and convention guards, proving new static guards catch
  a temporary violation before keeping them.
- [x] Verify the permanent style-guide fixture at desktop and 320px widths,
  including LTR/RTL, long-label overflow, and console health.
- [x] Run `pnpm check`, the Tabs browser suite, `pnpm exec tsc --noEmit`,
  `pnpm build`, and `git diff --check`.
- [x] Promote Tabs to Supported only after every required check passes, then
  record the final evidence and any deliberately unsupported cases.

## Review

- Design: Line retains one neutral edge rule and active indicator. Contained
  uses a neutral bounded surface and selected fill with no underline. Lists
  and triggers remain square across themes and palettes; contrast modes add a
  non-colour selected cue without masking keyboard focus.
- Content: The style guide now presents Tabs as Supported with controlled Line
  collection changes, uncontrolled Contained fallback, long-label overflow,
  disabled state, and live direction switching. The temporary lab was removed;
  this specimen is now the durable source of documentation and test evidence.
- Architecture: One Base UI-backed module owns semantics and both appearances.
  Its typed seam requires stable string IDs and one explicit selection mode,
  renders indicator work only for Line, and remeasures that indicator after a
  live direction change without remounting or losing state.
- Verification: Independent review approved with no findings. `pnpm check`,
  `pnpm exec tsc --noEmit`, `pnpm build` (13 pages), `git diff --check`, and all
  7 focused Chromium tests pass. Browser coverage exercises the permanent
  style-guide specimen at desktop and 320px, with no console problems or page
  overflow.

## Learnings

- Variant-specific work should be conditional in the component tree, not
  merely hidden in CSS; Contained now creates no Indicator at all.
- Base UI exposes physical indicator offsets. A physical anchor plus a
  post-layout direction latch handles LTR, RTL, and live direction changes
  without resetting controlled, uncontrolled, or panel-local state.
- Reduced-motion overrides must match the specificity of orientation-specific
  transition rules or the animation survives the media query.
- Uncontrolled collections can report `null` when no enabled fallback exists;
  the public callback type must reflect that even when supported specimens
  preserve at least one enabled item.
- `client:visible` browser fixtures must be scrolled into view before hydration
  readiness assertions, especially in short or zoom-equivalent viewports.
