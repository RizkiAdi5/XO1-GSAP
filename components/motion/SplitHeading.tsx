"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, motionTokens } from "@/lib/motion";

type SplitHeadingProps = {
  as?: "h2" | "h3" | "p";
  children: string;
  className?: string;
};

/**
 * Do NOT use on the hero H1 — splitting/animating the LCP element delays
 * paint (PRD rule: hero heading must be visible at first paint).
 */
export default function SplitHeading({
  as: Tag = "h2",
  children,
  className = "",
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          all: true,
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean;
          };

          if (reduceMotion) return;

          const split = SplitText.create(ref.current, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 100,
                duration: motionTokens.duration.base,
                ease: motionTokens.ease.out,
                stagger: motionTokens.stagger,
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 85%",
                  once: true,
                },
              }),
          });

          return () => split.revert();
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className}>
      {children}
    </Tag>
  );
}
