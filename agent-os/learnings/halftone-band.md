# The halftone band

> **Removed 2026-08-15.** The band is gone from the homepage and its component,
> CSS and vendored image are deleted. Kept because the `u_time` finding below
> generalises to any future shader added to this package. The homepage hero
> shader was later removed in favour of the neutral media placeholder.

The shader surface under the homepage work cards. Designed in Paper as a
`HalftoneDots` node and brought over as `src/components/HalftoneBand.tsx` —
the site's **first React island** and its first WebGL dependency.

## `speed` type-checks and animates nothing

`HalftoneDotsParams extends ShaderMotionParams`, so `speed` and `frame` are
valid props and the compiler accepts them. The fragment shader declares
`uniform float u_time` and **never reads it**. Passing `speed` would build,
pass review, ship, and produce a static image — the failure mode this repo
keeps hitting: valid output that silently does nothing.

So the motion is driven by hand. A `requestAnimationFrame` loop pushes
`u_offsetX` / `u_offsetY` through `paperShaderMount.setUniforms()`, which
renders synchronously — no React re-render per frame. The path is a slow
Lissajous drift (amplitudes 0.03 / 0.02, periods 41s / 67s, no shared factor
so it takes ~45 minutes to repeat). The amplitudes are small enough that the
sampling window never pulls a clamped edge into view.

Check `u_time` in the shader source before trusting `speed` on any other
shader from this package.

## The loop owns its own visibility gating

`ShaderMount` stops its internal rAF entirely at `speed: 0`, and its
IntersectionObserver / tab-visibility pausing goes with it. A hand-driven
loop therefore has to watch visibility itself, or a band scrolled past keeps
painting for the life of the page. The loop checks its own
IntersectionObserver plus `document.hidden`, and `prefers-reduced-motion`
parks the offsets at zero — the composition the design was approved at.

## Colour is read from the tokens, not from the Paper export

Paper exported `colorFront: "#2B2B2B"` on a `#F2F1E8` ground. That cream is
not in this palette, and being a literal it would have stayed cream on the
dark page. Both values are read off `<html>` with `getComputedStyle` —
`--text-primary` and `--background-elevated` — which resolves the `var()`
chain to the hex the shader parses. It only accepts `#hex`, `rgb()` and
`hsl()`; `currentColor` and `transparent` log "Unsupported color format" and
fall back, which is how the first build failed.

Theme changes arrive through a `MutationObserver` on the `<html>` class,
because ThemeToggle flips a class and emits no event. The palette is a lazily
initialised `useState` guarded on `typeof document` — the initialiser runs
during the client's first render, so the first painted frame already carries
the theme. An effect would run after paint and flash cream.

## Placement

In Paper the node is the third child of the card grid. As a real grid child
it would drop into the next cell and take one column, so in `index.astro` it
is a **sibling of `<Grid>` inside the `<Stack>`**, where it spans the
container. It is `client:visible`: below the fold, and it costs a WebGL
context.

## Cost

~71KB gzipped JS, all of it deferred — `dist/index.html` loads no external
script, so React and the shader chunk are fetched only when the band scrolls
into view.

## Open

- `public/images/home/halftone-source.webp` is Paper's own demo asset
  (`app.paper.design/static/flowers.webp`), vendored so the homepage does not
  depend on Paper's CDN at runtime. Licensing is unverified — replace it with
  Anuj's own image. The source is unrecognisable at this crop, so any image
  with similar tonal range drops in.
- The border is not in the Paper file. It was added because every other media
  surface here carries one; see the `.halftone-band` comment in `global.css`.
