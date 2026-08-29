# Mobile Responsive Type Scale

## Status

Complete

## Context

The shared type scale currently renders at 40 / 36 / 20 / 14px on a 320px
viewport. Display and title are too close in size, fixed 36px page and section
titles consume disproportionate mobile space, and the 20px shared heading is
heavier than it needs to be beside the established 14px body role.

## Desired Outcome

Mobile typography reads comfortably at 36 / 28 / 18 / 14px while expanding
fluidly to the existing 64 / 36 / 20 / 14px desktop hierarchy. Semantic roles,
line heights, font weights, tracking, and the 14px body floor remain unchanged.

## Approach

Change the three larger shared type tokens to fluid `clamp()` expressions.
Each expression starts at the approved 320px value and reaches the existing
desktop maximum without a page-specific breakpoint. Because every call site
already consumes semantic type roles, the change flows through the portfolio
without component overrides.

## Scope

In:

- Display: 36px mobile to the existing 64px desktop maximum.
- Title: 28px mobile to the existing 36px desktop maximum.
- Heading: 18px mobile to the existing 20px desktop maximum.
- Update the style-guide reference and active typography convention.
- Verify representative public routes at 320, 390, 768, 1024, and 1440px.

Out:

- Changing the 14px body role or reading leading.
- Changing font weights, tracking, font files, or role assignments.
- Adding a new type role, breakpoint, or page-specific override.
- Changing spacing to compensate for the new type scale.

## Files To Modify

- `src/styles/global.css`: fluid values for the three larger type tokens.
- `src/data/style-guide.ts`: accurate mobile-to-desktop reference labels.
- `agent-os/conventions/styling.md`: durable responsive-scale guidance.
- `agent-os/plans/mobile-responsive-type-scale.md`: implementation record.

## Steps

- [x] Audit computed typography and wrapping across representative mobile
      routes.
- [x] Approve the 36 / 28 / 18 / 14px mobile hierarchy.
- [x] Implement the three fluid shared tokens.
- [x] Update the style guide and active convention.
- [x] Verify responsive computed values, overflow, conventions, and build.

## Review

- Design: Larger roles become calmer on narrow screens while keeping the
  established desktop hierarchy and Apparat assignments.
- Content: Existing authored copy and semantic heading structure are unchanged.
- Architecture: One shared token change flows everywhere; no call-site CSS.
- Verification: Browser measurements at 320/390/768/1024/1440px, representative
  route screenshots, `pnpm check`, `pnpm build`, and `git diff --check` passed.
  Computed roles resolve to 36 / 28 / 18 / 14px at 320px and retain
  64 / 36 / 20 / 14px at 1440px. No tested route overflows horizontally in
  either appearance.

## Learnings

The active typography convention now records the responsive hierarchy. No
separate learning note is needed; testing revealed no new fluid-type or
wrapping failure mode.
