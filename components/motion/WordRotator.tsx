"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionTokens } from "@/lib/motion";

type WordRotatorProps = {
  words: string[];
  /** Seconds each word stays visible before rotating to the next. */
  interval?: number;
  className?: string;
};

export default function WordRotator({
  words,
  interval = 2,
  className = "",
}: WordRotatorProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !trackRef.current) return;

      // Widths are measured lazily, not once at mount: at mount the web font
      // (e.g. Instrument Serif) may not be loaded yet, so the fallback font's
      // widths left wrong-sized gaps around the word. Re-set once fonts are
      // ready; the tweens read the width via function values when they run.
      const measure = (i: number) => wordRefs.current[i]?.offsetWidth ?? 0;
      const container = containerRef.current;
      gsap.set(container, { width: measure(0) });
      document.fonts.ready.then(() => gsap.set(container, { width: measure(0) }));

      const mm = gsap.matchMedia();

      mm.add({ all: true, reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) return;

        // No ScrollTrigger pause-when-offscreen here on purpose: this
        // component gets used inside `position: sticky` ancestors (e.g.
        // CtaBand), and ScrollTrigger reading scroll position through a
        // sticky ancestor has been unreliable all over this project (see
        // notes/footer-reveal.md) — it silently paused the timeline
        // forever instead of ever playing it. Runs continuously instead;
        // it's a lightweight timeline, the always-on cost is negligible.
        const tl = gsap.timeline({ repeat: -1 });
        timelineRef.current = tl;

        const step = (targetIndex: number) => {
          tl.to(containerRef.current, {
            width: () => measure(targetIndex),
            duration: 3,
            ease: motionTokens.ease.inOut,
          }).to(
            trackRef.current,
            {
              yPercent: -(targetIndex * 100) / words.length,
              duration: 3,
              ease: motionTokens.ease.inOut,
            },
            "<"
          );
        };

        tl.to({}, { duration: interval }); // hold on first word
        words.forEach((_, i) => {
          if (i === 0) return;
          step(i);
          tl.to({}, { duration: interval });
        });
        step(0); // loop back to first word

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    // Depend on the words' actual content (a stable string), not the
    // array reference — `words` often comes from `t.raw(...)` (next-intl),
    // which returns a NEW array on every render even when the content is
    // identical. With `words` itself as the dependency, every unrelated
    // re-render tore the whole timeline down and rebuilt it, cutting off
    // the interval hold before it ever completed — looked like the
    // rotation had no rhythm at all.
    { scope: containerRef, dependencies: [words.join("|"), interval] }
  );

  return (
    <span
      ref={containerRef}
      className={className}
      // Box height = the parent's line height (1lh), aligned to the top of the
      // line. An overflow:hidden inline-block aligns by its *bottom* edge, not the
      // text baseline, so the old fixed 1.3em + baseline alignment floated the
      // word above the rest of the sentence whenever the parent's leading wasn't
      // exactly 1.3. With 1lh + top, the word's baseline matches the sentence's.
      style={{
        position: "relative",
        display: "inline-block",
        height: "1lh",
        overflow: "hidden",
        verticalAlign: "top",
      }}
      aria-label={words.join(", ")}
      onMouseEnter={() => timelineRef.current?.pause()}
      onMouseLeave={() => timelineRef.current?.play()}
    >
      <span
        ref={trackRef}
        aria-live="off"
        // flex-start + max-content: without them every word stretches to the
        // widest one, so offsetWidth was the same for all and the box never
        // shrank for short words (leaving a gap before the following text).
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
      >
        {words.map((word, i) => (
          <span
            key={word}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            style={{
              display: "block",
              width: "max-content",
              height: "1lh",
              whiteSpace: "nowrap",
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
