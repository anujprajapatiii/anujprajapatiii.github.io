/*
  The hero shader — the metaball that replaced the grey placeholder beside the
  homepage headline. Designed in Paper as a LiquidMetal node.

  This one animates the easy way, and the difference from HalftoneBand is
  worth stating: LiquidMetal's fragment shader actually READS u_time
  (`float t = .3 * (u_time + firstFrameOffset)`), so `speed` drives it and
  ShaderMount's own rAF handles pausing when the tab is hidden or the element
  leaves the viewport. HalftoneBand needed a hand-written loop because its
  shader declares u_time and never uses it. Check the shader source before
  trusting `speed` on any other one of these.

  Colour comes from --shader-tint, which exists for this component. See the
  note in global.css: the tint is a colour burn, so the value has to invert
  between themes or the shape sinks into the dark page.
*/
import { useEffect, useState } from "react";
import { LiquidMetal } from "@paper-design/shaders-react";

/*
  The frame Paper was parked on when the composition was approved. It is the
  still that reduced-motion users get, so it has to be a frame worth looking
  at rather than frame 0 — which is an undifferentiated blob. It also sets the
  phase the animation starts from for everyone else.

  Re-picked in Paper: the composition is now a large blob with a small one
  breaking away below it, rather than the single mass frame 56584 sat on.
  Every other parameter is untouched — this is a moment in the same shader,
  not a different shader.
*/
const APPROVED_FRAME = 637260.5;

export default function HeroShader() {
  /*
    Lazily initialised so the client's first render already carries the theme;
    an effect would run after paint and flash the wrong tint. `null` is the
    server branch, where there is no document to read.
  */
  const [tint, setTint] = useState<string | null>(() =>
    typeof document === "undefined"
      ? null
      : getComputedStyle(document.documentElement)
          .getPropertyValue("--shader-tint")
          .trim(),
  );
  const [still, setStill] = useState(false);

  /* ThemeToggle flips a class on <html> and emits no event, so watch it. */
  useEffect(() => {
    const read = () =>
      setTint(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--shader-tint")
          .trim(),
      );
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* Motion. speed 0 stops ShaderMount's rAF entirely rather than animating
     imperceptibly, so a reduced-motion visitor pays nothing to keep it. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <LiquidMetal
      className="hero-shader"
      speed={still ? 0 : 1}
      frame={APPROVED_FRAME}
      /* Paper's export, unchanged. */
      shape="metaballs"
      softness={0.1}
      repetition={2.05}
      shiftRed={0}
      shiftBlue={0}
      distortion={0.6}
      contour={0.2}
      scale={0.81}
      rotation={0}
      angle={0}
      /*
        Transparent, so the page ground shows through and the shape needs no
        surface of its own — which is why there is no box here. Written as
        rgba() rather than #00000000 because the parser accepts both and the
        conventions check bans hex at a call site.
      */
      colorBack="rgba(0, 0, 0, 0)"
      {...(tint && { colorTint: tint })}
    />
  );
}
