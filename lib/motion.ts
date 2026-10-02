import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  // PRD ease-inOut: cubic-bezier(.7, 0, .2, 1) — no exact built-in GSAP
  // named ease matches this curve, so it's registered here once and
  // referenced everywhere by name ("motionInOut") instead of approximating
  // with power2.inOut (different curve shape).
  CustomEase.create("motionInOut", "0.7, 0, 0.2, 1");
}

export const motionTokens = {
  duration: {
    fast: 0.35,
    base: 0.7,
    slow: 1.2,
  },
  ease: {
    // expo.out is GSAP's named ease equivalent to the PRD's
    // cubic-bezier(.16, 1, .3, 1) — confirmed by PRD itself.
    out: "expo.out",
    inOut: "motionInOut",
  },
  stagger: 0.06,
  // Slower stagger for a few large items (e.g. 4 cards) where 0.06s reads
  // as "all at once" — each card should visibly land one after another.
  staggerSlow: 0.15,
  distance: 24,
} as const;

export { gsap, ScrollTrigger, SplitText };
