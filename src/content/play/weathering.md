---
title: Weathering
description: A procedural rain study. Pick the terrain and the weather, then watch water run off the ledges, fall through the gaps, and pool wherever it can.
role: Experiment
year: "2026"
skills:
  - Creative coding
  - Simulation
  - WebGL
thumbnail: /images/play/weathering/gale.jpg
# Shown beside the homepage Play list while this row is pointed at. All three
# are this case study's own screenshots, resized to the frame they render in
# (550w, ~20KB) rather than served at 1600w.
previews:
  - /images/play/weathering/previews/preview-1.jpg
  - /images/play/weathering/previews/preview-2.jpg
  - /images/play/weathering/previews/preview-3.jpg
liveUrl: https://anujprajapatiii.github.io/procedural-rain-sandbox/
# Measures its container with a ResizeObserver and re-lays out, so it renders
# correctly on first paint inside an iframe (the EmbedFrame requirement).
embedUrl: https://anujprajapatiii.github.io/procedural-rain-sandbox/
# It reflows to a single column on a phone and drops its heavier blur pass on
# small screens, so the embed runs at every width rather than turning into a
# link. See EmbedFrame for what that costs and how the tap guard works.
embedOnPhone: true
sortOrder: 0
draft: false
---

Rain is the only input. Everything else in the scene is just something for it
to land on.

Every layout is built from a **seed**, so the same word rebuilds the same
ruins, and a new one builds somewhere you have not been.

## Same terrain, different weather

Nothing changes between these two images except the weather.

Light rain falls close to straight down. Water only gathers where a surface is
flat enough and wide enough to hold it, so the scene reads mostly dry:

![The ruins under light rain, with water collecting on two flat ledges](/images/play/weathering/light-rain.jpg)

A gale drives the same rain sideways at full intensity. Ledges that stayed dry
are catching it now, and the pools have spread to the floor:

![The same ruins in a gale, rain driven sideways and water spreading across the floor](/images/play/weathering/gale.jpg)

Same geometry, completely different weather system. Watching which surfaces
stay dry is the whole point of the toy.

## Where the rain does not reach

**Deep caves** puts a roof over most of the scene, so rain only gets in where
the roof is broken. What falls through arrives as separate columns, and
everything under solid rock stays dry indefinitely:

![The deep caves layout, with rain falling through three gaps in the roof](/images/play/weathering/deep-caves.jpg)

That dry ground is a rain shadow, and it comes out of the collision grid rather
than being drawn in. Move the wind hard enough and the shadows move with it.

## The controls

**Terrain.** Open ruins, deep caves, vertical shafts, and a logic-driven
generated wilds. **Randomize layout** reseeds the whole composition: shelters,
shafts, ledges, drainage gaps and catchments.

**Weather.** Jump to light rain, a storm, or a gale, or set rainfall, wind and
time separately.

**Seed.** Type one in and regenerate to get the same terrain back.

**Debug grid** draws the collision grid and live statistics over the scene,
which is the fastest way to see why water went where it went.

## Under the hood

Built with PixiJS and React 19.

Rain lives in reusable typed arrays rather than component state, so a frame
costs no allocations and React never re-renders for a raindrop.

One coarse `Uint8Array` grid does both the generation and the collision, which
makes "is this cell solid?" constant time no matter how complicated the scene
looks.

Water is a bounded pair of `Float32Array` buffers. Each step swaps them instead
of allocating a new one, and the terrain draws as horizontal runs rather than
thousands of separate objects.

The blur is the part worth stealing. Rather than blurring the terrain and the
rain separately, the whole scene is captured into one reusable downsampled
texture and put through two Gaussian passes, so everything blurs together and
sits in the same air. Small screens drop the second pass.

None of this is fluid dynamics. It is a stylised cellular model aimed at four
things reading correctly: rain shadows, runoff, falling streams, and pools that
do not last forever.
