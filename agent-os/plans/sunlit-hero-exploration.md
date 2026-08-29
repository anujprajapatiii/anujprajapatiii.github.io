# Sunlit Hero Exploration

## Status

Completed

## Design Question

How can the homepage borrow `sunlit`'s dappled-window-light composition while
remaining neutral, bounded to the hero, and light enough for a portfolio that
already has its own theme and surface system?

## Source Reading

- Primary reference: `anujprajapatiii/sunlit` at commit
  `44fd77f82bc8d9fb7be78ac2066b1e09edc75e77`.
- The reference combines perspective-transformed shutters, foliage, reflected
  glow, and progressively masked backdrop blur.
- Its live SVG turbulence/displacement and full-page scene were deliberately
  excluded because they would add continuous paint work outside the hero.
- The source foliage bitmap is temporary by Anuj's direction. Replacing it
  with an original or appropriately licensed asset is recorded in the parking
  lot so that the exception remains visible.

## Selected Direction

The homepage uses a full-hero decorative light field behind the title and
shared neutral media placeholder, and below the navigation. This preserves the
reference's spatial atmosphere without reducing contrast on the foreground
content.

The final composition keeps:

- 23 CSS shutters and two vertical bars in the source-inspired perspective.
- One static foliage texture with a slow transform-only billow.
- A subtle independent sway on the blinds.
- Two progressively masked backdrop-blur passes: 6px and 48px on desktop,
  with the broad pass reduced to 24px on narrow viewports.
- Two semantic-token glow planes and a small static grain tile.
- The existing light/dark theme control, with the dark lighting group reduced
  to 70% strength.

The final composition removes:

- The contained-image prototype.
- Live SVG turbulence and displacement.
- The rejected four-pass blur stack.
- The bottom feather/dither mask.
- Generated still-life imagery and the previous textured hero JPEGs.
- The temporary `/lab/sunlit-hero` route and lab-only component paths.
- The experimental slot-mask treatment.

## Performance Guardrails

- The effect is absolutely positioned, clipped, and paint-contained by the
  hero rather than fixed to the viewport.
- Only transforms animate; there is no requestAnimationFrame loop or animated
  filter.
- IntersectionObserver pauses the foliage and blind animations when the hero
  leaves the viewport.
- Document visibility also pauses the scene while the tab is hidden.
- `prefers-reduced-motion` renders the same composition as a static frame.
- `will-change` is present only while the scene is active.
- The implementation adds no dependency.

## Production Implementation

- `src/components/SunlitHeroScene.astro`: decorative markup, visibility
  lifecycle, and reduced-motion-aware activity state.
- `src/components/sunlit-hero-scene.css`: theme mapping, composition, blur,
  containment, and transform-only motion.
- `public/images/sunlit/`: the small static grain and foliage assets.
- `src/pages/index.astro`: homepage composition, foreground stacking, shared
  media placeholder, and homepage-only translucent navigation treatment.

## Accessibility and Resilience

- The complete scene is `aria-hidden` and does not accept pointer input.
- Required content remains normal semantic HTML above the effect.
- Increased-contrast and reduced-transparency preferences restore the opaque
  navigation surface and remove its backdrop filter.
- With JavaScript unavailable, the lighting remains visible but static.

## Cleanup Before Merge

- [x] Selected direction moved into the production homepage.
- [x] Rejected variants and slot treatment removed.
- [x] Temporary `/lab/` route removed.
- [x] Lab-only paths and unused hero assets removed.
- [x] No new dependency introduced.
- [x] Responsive and appearance states reviewed after production cleanup.
- [x] `pnpm check` passes.
- [x] `pnpm build` passes.

Final verification covered light and dark modes at 320, 768, 1024, and 1440px.
Hero and overlay widths match at every breakpoint, no horizontal overflow is
present, the rendered blur stack is 6px/48px on desktop, and both animations
report `paused` after the hero leaves the viewport. The production build emits
13 routes and no `/lab/` route.

## Decision

Selected: hero-bounded, behind-content Sunlit lighting with two blur passes,
static grain, and transform-only motion. This retains the character of the
reference while keeping the content crisp and the runtime bounded.
