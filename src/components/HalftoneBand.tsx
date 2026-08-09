/*
  The halftone band under the work cards. Designed in Paper as a HalftoneDots
  node; this is that node translated, with two deliberate departures.

  COLOUR COMES FROM THE THEME, NOT THE DESIGN FILE. Paper exported
  colorFront "#2B2B2B" on a "#F2F1E8" ground — a warm cream that is not in
  this palette and would have stayed cream on the dark page. Both are read
  from the semantic tokens instead, so the band follows the theme like
  everything else and no hex is written at a call site.

  ANIMATION IS DRIVEN BY HAND. HalftoneDotsParams extends ShaderMotionParams,
  so `speed` type-checks — but the fragment shader declares `u_time` and never
  reads it. Passing speed would compile, ship, and animate nothing. The motion
  here is a slow Lissajous drift of the sampling offset, pushed straight into
  the mount's uniforms so React never re-renders.
*/
import { useEffect, useState } from "react";
import { HalftoneDots } from "@paper-design/shaders-react";
import type { PaperShaderElement } from "@paper-design/shaders";

/*
  Amplitude is in the shader's offset space, where 1 is a full image width.
  These are small on purpose: at 0.03 the field never travels far enough to
  pull a clamped edge into view, and the two periods do not share a factor, so
  the path takes ~45 minutes to repeat.
*/
const DRIFT_X = 0.03;
const DRIFT_Y = 0.02;
const PERIOD_X = 41; /* seconds */
const PERIOD_Y = 67;

type Palette = { front: string; back: string };

/*
  Read off <html>, not off the band itself: the tokens are declared on :root,
  and this has to run during the first render pass, before any ref is attached.
  getComputedStyle resolves the var() chain down to the hex the shader parses —
  it only accepts #hex, rgb() and hsl(), and logs an error for anything else.
*/
function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  return {
    front: styles.getPropertyValue("--text-primary").trim(),
    back: styles.getPropertyValue("--background-elevated").trim(),
  };
}

export default function HalftoneBand() {
  /*
    Lazily initialised rather than set in an effect. Astro prerenders this
    island to static HTML, where there is no document — hence the guard — but
    on the client the initialiser runs during render, so the first painted
    frame already carries the theme's colours instead of the library's cream
    defaults. An effect would run after paint and flash.
  */
  const [palette, setPalette] = useState<Palette | null>(() =>
    typeof document === "undefined" ? null : readPalette(),
  );
  const [element, setElement] = useState<PaperShaderElement | null>(null);

  /* Theme. ThemeToggle flips a class on <html>, so there is no event to
     listen for; the observer watches that one attribute. */
  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* Motion */
  useEffect(() => {
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let inViewport = true;
    let started = 0;

    /*
      The shader's own rAF stops at speed 0, so nothing else is watching
      visibility for us — this loop has to do it, or a band scrolled past
      keeps painting for the life of the page.
    */
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
    });
    observer.observe(element);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!inViewport || document.hidden) return;
      const elapsed = (now - started) / 1000;
      element.paperShaderMount?.setUniforms({
        u_offsetX: Math.sin((elapsed / PERIOD_X) * Math.PI * 2) * DRIFT_X,
        u_offsetY: Math.sin((elapsed / PERIOD_Y) * Math.PI * 2) * DRIFT_Y,
      });
    };

    const start = () => {
      if (raf) return;
      started = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      /* Park it at the composition the design was approved at. */
      element.paperShaderMount?.setUniforms({ u_offsetX: 0, u_offsetY: 0 });
    };

    const sync = () => (reduceMotion.matches ? stop() : start());

    sync();
    reduceMotion.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      reduceMotion.removeEventListener("change", sync);
    };
  }, [element]);

  return (
    <HalftoneDots
      ref={setElement}
      className="halftone-band"
      image="/images/home/halftone-source.webp"
      /*
        Omitted entirely until the palette is known, so the prerender falls
        through to the library's own defaults instead of erroring on a colour
        string the shader cannot parse.
      */
      {...(palette && { colorFront: palette.front, colorBack: palette.back })}
      /* Every value below is Paper's export, unchanged. */
      type="gooey"
      grid="hex"
      fit="cover"
      scale={1}
      size={0.5}
      radius={1.25}
      contrast={0.4}
      originalColors={false}
      inverted={false}
      grainSize={0.5}
      grainMixer={0.2}
      grainOverlay={0.2}
    />
  );
}
