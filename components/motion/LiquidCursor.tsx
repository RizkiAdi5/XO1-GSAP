"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionTokens } from "@/lib/motion";

// Tuning knobs for the shape of the trail (timing still comes from motionTokens).
// Big → medium → small; each one chases the one ahead (the big one chases the pointer).
const DROPS = [
  { size: 36, follow: 0.45 },
  { size: 20, follow: 0.28 },
  { size: 11, follow: 0.2 },
]; // follow 0–1: share of the gap closed per 60fps frame — lower = lazier
const STRETCH_PER_PX = 0.02; // stretch per px of gap to the one ahead
const MAX_STRETCH = 0.35;
const HOVER_SCALE = 1.7; // big drop over links/buttons
const SCROLL_DRAG = 0.6; // share of each scroll step the drops get carried with the page
const MAX_SCROLL_DRAG = 80; // px cap per scroll event so a fast fling doesn't fling the drops off-screen
const ZOOM = 1.4; // magnification at the drop's center (1 = none)
const EDGE_BEND = 0.35; // extra pull toward the rim — the curved-glass edge of a water drop

const INTERACTIVE = "a, button, [role='button'], label, select";

/**
 * Liquid cursor: three see-through water drops (big, medium, small) that
 * follow the pointer in a chain, stretching a little as they move and
 * pooling back together when it stops. Scrolling drags them with the page
 * for a moment, so they trail vertically too. The drops are lenses, not paint:
 * an SVG displacement filter used as backdrop-filter magnifies whatever is
 * under them, like looking through a drop of water.
 * Lens works in Chromium only; Safari/Firefox ignore backdrop-filter url()
 * and show a clear drop (rim + highlight) without the zoom.
 * Only on precise pointers without reduced motion. Hidden over data-cursor="hide".
 */
export default function LiquidCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dropRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lensMapRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const root = rootRef.current!;
      const drops = dropRefs.current.filter((d): d is HTMLDivElement => d !== null);

      // Lens displacement map. feDisplacementMap samples each pixel from
      // (x + scale·(R−0.5), y + scale·(G−0.5)); pulling samples toward the
      // center (R/G below 0.5 right/below of center) shows the backdrop larger.
      const map = document.createElement("canvas");
      const n = (map.width = map.height = 64);
      const ctx = map.getContext("2d")!;
      const img = ctx.createImageData(n, n);
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const nx = ((x + 0.5) / n) * 2 - 1; // −1…1 across the drop
          const ny = ((y + 0.5) / n) * 2 - 1;
          const r2 = Math.min(nx * nx + ny * ny, 1);
          const pull = 0.5 * (1 - 1 / ZOOM) * (1 + EDGE_BEND * r2);
          const i = (y * n + x) * 4;
          img.data[i] = 128 - nx * pull * 255;
          img.data[i + 1] = 128 - ny * pull * 255;
          img.data[i + 2] = 128;
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      const url = map.toDataURL();
      lensMapRef.current!.querySelectorAll("feImage").forEach((fe) => fe.setAttribute("href", url));

      const pointer = { x: -100, y: -100 };
      const pos = drops.map(() => ({ x: -100, y: -100 }));
      let visible = false;

      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        if (!visible) {
          visible = true;
          // First move: start the whole chain on the pointer, not in the corner.
          pos.forEach((p) => Object.assign(p, pointer));
          gsap.to(root, { autoAlpha: 1, duration: motionTokens.duration.fast });
        }
      };

      const tick = () => {
        // deltaRatio keeps the follow speed the same on 60Hz and 120Hz screens.
        const ratio = gsap.ticker.deltaRatio(60);
        pos.forEach((p, i) => {
          const lead = i === 0 ? pointer : pos[i - 1];
          const k = 1 - Math.pow(1 - DROPS[i].follow, ratio);
          const dx = lead.x - p.x;
          const dy = lead.y - p.y;
          p.x += dx * k;
          p.y += dy * k;
          const stretch = Math.min(Math.hypot(dx, dy) * STRETCH_PER_PX, MAX_STRETCH);
          gsap.set(drops[i], {
            x: p.x,
            y: p.y,
            rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
            scaleX: 1 + stretch,
            scaleY: 1 - stretch * 0.4,
          });
        });
      };
      gsap.ticker.add(tick);

      const updateHover = (el: Element | null) => {
        if (!el) return;
        // Project cards have their own "View" pill: hide the cursor so they don't stack.
        // Open <dialog>s render in the browser's top layer, above this cursor, so hide it there too.
        const hide = el.closest("[data-cursor='hide'], dialog[open]");
        const active = !hide && el.closest(INTERACTIVE);
        gsap.to(root, { autoAlpha: hide ? 0 : 1, duration: motionTokens.duration.fast });
        gsap.to(drops[0].firstElementChild, {
          scale: active ? HOVER_SCALE : 1,
          duration: motionTokens.duration.fast,
          ease: motionTokens.ease.out,
        });
      };

      const onOver = (e: PointerEvent) => updateHover(e.target as Element);

      // Scroll (wheel/trackpad/Lenis) moves the page but not the pointer, so no
      // pointer events fire. Two fixes here:
      // 1. Carry the drops a little with the page, then let the chain pull them
      //    back to the pointer: they stretch and trail vertically like liquid.
      // 2. Re-check what's under the (still) pointer, so hover grow/hide stays right.
      let lastScrollY = window.scrollY;
      const onScroll = () => {
        const delta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        if (!visible) return;
        const drag = gsap.utils.clamp(-MAX_SCROLL_DRAG, MAX_SCROLL_DRAG, delta * SCROLL_DRAG);
        pos.forEach((p) => (p.y -= drag));
        updateHover(document.elementFromPoint(pointer.x, pointer.y));
      };

      const onLeaveWindow = () => {
        visible = false;
        gsap.to(root, { autoAlpha: 0, duration: motionTokens.duration.fast });
      };

      document.documentElement.classList.add("has-liquid-cursor");
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerover", onOver);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeaveWindow);

      return () => {
        document.documentElement.classList.remove("has-liquid-cursor");
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        window.removeEventListener("scroll", onScroll);
        document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
        gsap.ticker.remove(tick);
      };
    });

    return () => mm.revert();
  });

  return (
    // Each wrapper is 0×0 at the drop's position so scale/rotation pivot on its center.
    <>
    {/* One lens filter per drop size: feDisplacementMap's scale is in px. */}
    <svg ref={lensMapRef} aria-hidden="true" className="absolute h-0 w-0">
      {DROPS.map(({ size }, i) => (
        <filter key={i} id={`lens-${i}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage x="0" y="0" width={size} height={size} preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={size} xChannelSelector="R" yChannelSelector="G" />
          {/* feDisplacementMap samples nearest-pixel, so zoomed edges go jagged; a tiny blur smooths them. */}
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      ))}
    </svg>
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] invisible opacity-0"
    >
      {DROPS.map(({ size }, i) => (
        <div
          key={i}
          ref={(el) => {
            dropRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 h-0 w-0"
        >
          {/* Water drop: lens body (zoomed backdrop), bright rim + top-left
              highlight, faint cobalt shadow for depth. */}
          <div
            className="absolute rounded-full border border-white/80 bg-white/5 shadow-[inset_-2px_-3px_6px_rgba(47,69,255,0.18),inset_2px_3px_5px_rgba(255,255,255,0.9),0_3px_10px_rgba(47,69,255,0.22)]"
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
              backdropFilter: `url(#lens-${i}) saturate(1.3)`,
            }}
          />
        </div>
      ))}
    </div>
    </>
  );
}
