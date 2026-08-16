# Embedded tools

What was learned wiring a second live tool (Weathering) into a case study
through `EmbedFrame`. Applies to any future `embedUrl`.

## Size the frame from measurements, never from a ratio you like

An iframe that is shorter than its content does not crop it — the embedded
page gets **its own scrollbar inside the page**, which is the worst outcome
available. So the frame's height has to be at least what the embedded tool
actually asks for at that width.

The way to find out, without guessing: load the embedded page in a browser at
the exact widths the frame will be, with a **deliberately short viewport**, and
read `document.documentElement.scrollHeight`. A short viewport is the trick —
these tools tend to set `min-height: 100vh`, so a tall viewport stretches them
and the number just reads back the viewport.

For Weathering that produced two flat bands rather than a ratio:

| frame width | needs |
| --- | --- |
| up to 850px | up to 1011px |
| above 850px | up to 750px |

The step is structural: above its own stacking point the tool puts a
fixed-width control panel *beside* the canvas, and below it the panel drops
*underneath*. Both bands are near-constant in height, which is why
`aspect-ratio` is the wrong tool and an explicit height is the right one.

Keep bands coarse. It is tempting to add a third to reclaim the ~100px of
slack at tablet width, but each band couples this repo to another repo's
internal breakpoints. Two bands encode a structural fact; more would encode
cosmetic ones.

## The frame is not as wide as the screen

The frame is the page container minus its gutter — 48px narrower than the
viewport. That is the difference between a tool laying out comfortably and
clipping its own buttons, and it is why `.embed` is a **size container** and
the height bands are `@container` queries: a media query would be asking the
wrong element how wide it is.

At a 375px screen the framed tool got 327px, which is close enough to its
320px design floor that its four-across preset row clipped by ~10px. Hence
full-bleed below the phone breakpoint — worth breaking the site's shared
vertical edges for, in that one place, because the gutter was costing the tool
more than the alignment was buying the page.

Note `width: auto` in that rule. A box left at `width: 100%` keeps the
container's width and negative margins only slide it sideways.

## Canvas embeds eat touch scrolling

This is the real reason embeds were originally hidden on phones, and it is not
about width at all.

PixiJS (and any canvas tool that reads drags) sets `touch-action: none` on the
canvas. A swipe that starts anywhere on it scrolls **nothing** — the page reads
as frozen, and a visitor has no way to know why. Confirmed by reading the
computed style on the deployed tool; it comes from the library, not the
author's CSS, so assume it is there.

`.embed-guard` is the answer: a transparent layer over the frame that takes
the first touch and then removes itself. The page keeps scrolling until
someone asks for the tool, which is the same bargain an embedded map makes.

It is gated on `@media (hover: none)` rather than a width, because the trap
belongs to touch, not to small screens — a tablet has it too. A mouse never
meets the guard, so desktop embeds are live from the first frame.

## Checking an embed before shipping it

`EmbedFrame` already carries the first-paint rule: the tool must draw itself
inside an iframe rather than waiting for a resize event. Add to that:

1. Measure the height bands as above.
2. Read the canvas's computed `touch-action`.
3. Look at the narrowest real phone width, at the **frame** width rather than
   the viewport width.
