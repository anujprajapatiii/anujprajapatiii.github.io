# Audit System Fixes

## Status

Implementation complete; physical-device QA pending

## Context

The comprehensive design and token audit of `origin/main` identified a small
set of implementation-ready consistency issues. Anuj approved eight specific
fixes and explicitly deferred portfolio content and imagery beyond wiring the
existing Nutrition Labels hero as its card thumbnail.

## Desired Outcome

The site has valid token references, correct card heading semantics, one clear
mobile Voxel action, comfortable site-furniture hit areas without a larger
header, a current design-sync bundle, no meaningful token literals or dead
component aliases, and automated checks that protect those contracts.

## Approach

Make surgical changes against the existing component and token architecture.
Reuse current semantic tokens, preserve the visual layout, generate the
design-sync color bundle from the canonical CSS source, and extend the existing
convention checker instead of adding another disconnected validation tool.

## Scope

In:

- Fix the two invalid CSS custom-property references.
- Add a configurable heading level to `ProjectCard` and use `h2` on listing
  pages while preserving `h3` where a section heading already exists.
- Reuse the existing Nutrition Labels day hero as its card thumbnail.
- Consolidate Voxel's duplicated mobile live-demo action.
- Expand shared navigation, footer, wordmark, and theme-toggle hit areas without
  changing the header's visual dimensions.
- Regenerate `ds-bundle` from the current color system and reconcile its docs.
- Replace remaining meaningful type, motion, and component-dimension literals;
  remove dead component aliases.
- Add undefined-token, bundle-parity, heading-level, hit-area, and rendered
  matrix checks.
- Re-run the 13-route × 4-width × 2-theme matrix in a browser context that
  reports a coarse primary pointer.

Out:

- Replacing or editing portfolio case-study content.
- Creating or regrading portfolio imagery.
- Redesigning layouts, palettes, typography, or interactions beyond the
  approved consistency fixes.
- Adding or updating shadcn registry components.

## Files To Modify

- `src/components/RainOverlay.astro`: correct the mist token reference.
- `src/styles/demo-controls.css`: correct the active token, replace literals,
  and remove dead aliases.
- `src/components/interaction-anatomy-lab.css`: replace literals and dead
  aliases.
- `src/components/ProjectCard.astro`: support an explicit heading level.
- `src/pages/work/index.astro`: use `h2` card headings.
- `src/pages/play/index.astro`: use `h2` card headings.
- `src/content/play/project-nutrition-labels.mdx`: wire existing hero as card
  thumbnail.
- `src/pages/play/[...slug].astro`: consolidate the mobile Voxel action.
- `src/styles/global.css` and shared layout components: add non-layout-changing
  interaction hit areas and component tokens where appropriate.
- `ds-bundle/**` and `.design-sync/NOTES.md`: regenerate and document the
  current color source of truth.
- `scripts/check-conventions.mjs`: extend automated validation.
- `agent-os/learnings/`: capture any durable validation or interaction pattern.

## Steps

- [x] Apply component, content-wiring, and semantic fixes.
- [x] Apply hit-area and token-literal cleanup.
- [x] Regenerate and reconcile the design-sync bundle.
- [x] Extend automated checks.
- [x] Run checks, build, interaction verification, and the full 104-state
      Mobile Safari simulator matrix across iPhone and iPad coarse-pointer
      profiles.
- [ ] Repeat the final matrix on connected physical hardware. The available
      iPhone was reported offline during this pass.
- [x] Review the final diff and capture durable guidance in the styling
      convention.

## Review

- Design: Header dimensions and established hierarchy must remain visually
  unchanged; mobile Voxel should expose one clear live-demo action.
- Content: Only add the approved Nutrition Labels thumbnail reference.
- Architecture: Existing Astro components, semantic tokens, and convention
  checker remain the source of truth; no new dependency or UI abstraction.
- Verification: `pnpm check`, `pnpm build`, browser interaction checks, and 104
  rendered route states with a coarse pointer.

## Learnings

The durable contracts belong in `agent-os/conventions/styling.md`: the design
bundle is generated from the canonical CSS source graph, compact site furniture
uses one layout-neutral 48px hit-target treatment, and `pnpm check` protects
undefined-token, literal, semantic-heading, hit-target, and bundle-parity
contracts. No separate learning note is needed because these are active rules,
not historical gotchas.
