# Homepage Rain Shader

## Status

Complete

## Context

The homepage now has authored day and night rock imagery in its hero. A quiet
rain layer can connect that image to the Monsoon Projects identity, but it must
remain atmosphere rather than become the subject of the page. The previous
hero shader was a standalone decorative object; this treatment should instead
belong to the image and adapt with it.

## Desired Outcome

The homepage hero shows sparse, natural rain over the rock image. Light and
dark mode crossfade between their authored backdrops while the rain changes
tone continuously, without flashing, restarting, blocking interaction, or
moving for people who prefer reduced motion.

## Approach

Build a small dependency-free WebGL canvas as an Astro component. A fragment
shader will create a few depth bands of fine, wind-slanted rain with restrained
density and opacity. The canvas will sit inside the hero image bounds, accept
no pointer input, and use the site's existing semantic text colour as its
theme-aware tint rather than introducing a parallel colour system.

Extend `ThemeImage` with an opt-in full-surface effect slot. Theme changes use
the site's existing 300ms root View Transition, which already crossfades every
surface as one composition; adding a second image-level transition would
create competing timelines. The shader reads its new semantic tint on the
same class change. Normal project imagery remains unchanged unless it
explicitly supplies an effect.

Design direction:

- Colour: existing semantic image and text colours only; no new primitives or
  hard-coded theme colours.
- Type: unchanged—the rain supports the hero thesis and does not compete with
  the display typography.
- Layout: the effect is clipped to the existing 16:10 media frame and never
  spills behind the hero copy.
- Signature: sparse rain passing over the textured rock in three quiet depth
  bands, with occasional brighter near-field threads rather than a uniform
  particle curtain.
- Motion: steady atmospheric drift, no splashes, lightning, parallax, cursor
  response, bounce, or attention-seeking bursts.

Approved refinement:

- Drops fall vertically and each streak fades toward its top.
- The shader strength is a single 50% control in both themes.
- Every visible drop owns an organic impact height in the lower third and
  resolves into a restrained elliptical ripple.
- Slowly drifting procedural mist occupies only the upper third.

## Scope

In:

- Dependency-free WebGL rain overlay for the homepage hero.
- The existing root-level crossfade between the day and night hero images.
- Smooth semantic tint change when the theme switches.
- Static rain frame for `prefers-reduced-motion: reduce`.
- Pause when the hero is offscreen or the document is hidden.
- ResizeObserver sizing with a capped device-pixel ratio.
- Graceful fallback to the unchanged image if WebGL is unavailable.
- A mobile-only hero-gap correction if the existing desktop gap forces the
  24-track grid beyond the viewport.
- Desktop and mobile visual review in both themes.

Out:

- Rain on project cards, case-study heroes, or the rest of the page.
- Pointer-reactive rain, audio, lightning, large water splashes, or weather
  controls.
- A new shader package, React island, colour primitive, or design token.
- Changes to homepage copy, grid structure, typography, or image assets.

## Files To Modify

- `src/components/RainOverlay.astro`: WebGL shader, lifecycle, theme response,
  reduced-motion behavior, and fallback.
- `src/components/ThemeImage.astro`: opt-in full-surface effect slot.
- `src/pages/index.astro`: compose the rain layer into the homepage hero.
- `src/styles/global.css`: keep the larger hero gap at the desktop split while
  using the system grid gap before that breakpoint.
- `agent-os/conventions/styling.md`: record the restraint, accessibility, and
  performance rules for ambient media effects.
- `agent-os/system-map.md`: record the new reusable hero-effect component.

## Steps

- [x] Add the clipped, non-interactive rain canvas and native shader.
- [x] Add semantic theme tinting, visibility pausing, resize handling, and a
  static reduced-motion state.
- [x] Add the full-surface effect slot and preserve the established root-level
  theme crossfade.
- [x] Compose the effect into the homepage hero only.
- [x] Run `pnpm check` and `pnpm build`.
- [x] Review light, dark, theme switching, reduced motion, mobile overflow,
  visual restraint, and browser console output.
- [x] Tune density, angle, speed, depth, and opacity from screenshots.
- [x] Record the durable ambient-effect convention and mark this plan complete.
- [x] Refine vertical fall, top-faded streaks, 50% shader strength, synchronized
  lower-third ripples, and subtle upper-third procedural mist.
- [x] Re-run visual, responsive, motion, console, convention, and build review.

## Review

- Design: The first pass read as a bright, uniform particle curtain. Browser
  review led to roughly a 75% density reduction, finer threads, and lower peak
  contrast. The refinement pass made every drop fall vertically, fade through
  its upper tail, and share an organic lower-third ground point with its own
  expanding ripple. Four-octave gradient-Perlin mist now drifts slowly through the
  upper third. Correct non-premultiplied compositing keeps the literal 50%
  shader opacity from turning these quiet marks into bright graphic lines.
- Content: No copy changes.
- Architecture: The effect is a dependency-free Astro component and adds
  approximately 3.1KB gzipped. `ThemeImage` exposes the full-surface effect slot
  without changing existing call sites. The site-level View Transition remains
  the sole theme-transition timeline.
- Verification: `pnpm check` and `pnpm build` pass. Browser review confirmed
  light and dark imagery, semantic tint changes, exact canvas/image bounds,
  vertical fall and ripple progression across sampled frames, no console
  errors, and no horizontal overflow at 390×844. The reduced-motion branch
  renders the approved static frame and never starts its animation loop; the
  normal loop is capped at 30fps and 1.5× device-pixel ratio.

## Learnings

Ambient shaders need to be tuned over the real image rather than a blank test
canvas: texture and local contrast make a mathematically sparse pattern read
far denser than expected. Responsive QA also caught that a desktop-only hero
gap had been applied across all 24 mobile grid tracks; the larger gap must begin
at the same breakpoint as the split it separates. Transparent WebGL effects
also need their canvas alpha contract to match their fragment output: treating
straight RGB as premultiplied made low-alpha weather marks appear almost fully
opaque.
