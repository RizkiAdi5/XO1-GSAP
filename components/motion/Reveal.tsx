"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionTokens } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate direct children individually with a stagger, instead of the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
};

export default function Reveal({
  children,
  className = "",
  stagger = false,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const targets = stagger
        ? gsap.utils.toArray<HTMLElement>(ref.current.children)
        : ref.current;

      const mm = gsap.matchMedia();

      mm.add({ all: true, reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        // Set client-side only, after mount — server HTML renders children
        // fully visible so content isn't stuck hidden if JS fails to load.
        gsap.set(targets, {
          opacity: 0,
          y: reduceMotion ? 0 : motionTokens.distance,
        });

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: reduceMotion ? 0.2 : motionTokens.duration.base,
          ease: motionTokens.ease.out,
          delay,
          stagger: stagger ? motionTokens.stagger : 0,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [stagger, delay] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
