"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionTokens } from "@/lib/motion";

type OdometerProps = {
  /** e.g. "70+", "1,000+", "80%" */
  value: string;
  className?: string;
};

export default function Odometer({ value, className = "" }: OdometerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const chars = value.split("");

  useGSAP(
    () => {
      if (!ref.current) return;

      const tracks = gsap.utils.toArray<HTMLElement>(
        ref.current.querySelectorAll("[data-odometer-track]")
      );
      const targetYPercent = (_i: number, target: Element) =>
        -Number((target as HTMLElement).dataset.digit) * 10;

      const mm = gsap.matchMedia();

      mm.add({ all: true, reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (reduceMotion) {
          gsap.set(tracks, { yPercent: targetYPercent });
          return;
        }

        gsap.set(tracks, { yPercent: 0 });
        gsap.to(tracks, {
          yPercent: targetYPercent,
          duration: motionTokens.duration.slow,
          ease: motionTokens.ease.out,
          stagger: { each: motionTokens.stagger, from: "end" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] }
  );

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      {/* The real value, for screen readers and copy/paste. Without it, selecting
          the number copied every digit of every track ("0123456789…"). */}
      <span className="sr-only">{value}</span>
      {/* Every char (digit or symbol) is the same 1em-tall, leading-none box,
          top-aligned. Digits are overflow-hidden inline-blocks, which align by
          their bottom edge, not the text baseline, so baseline alignment left
          "+", "%" and "," sitting lower than the numbers. */}
      <span aria-hidden="true" className="inline-flex select-none items-start">
        {chars.map((char, i) =>
          /\d/.test(char) ? (
            <span
              key={i}
              className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline"
            >
              <span
                data-odometer-track
                data-digit={char}
                className="absolute left-0 top-0 flex flex-col"
              >
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n} className="block h-[1em] leading-none">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className="inline-block h-[1em] leading-none">
              {char}
            </span>
          )
        )}
      </span>
    </span>
  );
}
