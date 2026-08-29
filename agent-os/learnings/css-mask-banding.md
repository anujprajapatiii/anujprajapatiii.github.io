# Dither wide alpha fades

A long CSS alpha mask can show horizontal bands even when it has only one
continuous gradient segment. The problem is quantization, not necessarily the
number of authored colour stops: several adjacent rows can resolve to the same
8-bit alpha value. Large, nearly flat dark surfaces make those plateaus easy to
see, and `mix-blend-mode` plus `backdrop-filter` can amplify them.

Changing stop percentages or adding intermediate stops changes the fade's
slope but does not remove quantization. A binary-alpha dither removes bands but
can introduce visible grain and repeated texture. For a wide atmospheric fade,
use a small static 8-bit alpha tile: calculate the ideal opacity, then
stochastically distribute pixels between its floor and ceiling alpha values.
Repeat it only across the inline axis and stretch it over the component's block
size. The variation stays within one alpha level, removing horizontal steps
without visible texture, an animated filter, or a runtime loop.

Verify the result in dark mode at the live transition boundary. A full-page
screenshot can misrepresent sticky and blended layers, so inspect a normal
viewport after scrolling to the seam.
