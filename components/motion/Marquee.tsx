"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/motion";
import { useLenis } from "@/lib/lenis";

type MarqueeProps = {
  items: ReactNode[];
  /** px per second at rest (before scroll-velocity boost) */
  speed?: number;
  className?: string;
};

export default function Marquee({ items, speed = 60, className = "" }: MarqueeProps) {
  const t = useTranslations();
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const manuallyPausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!trackRef.current) return;

      const mm = gsap.matchMedia();

      mm.add({ all: true, reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) return;

        const track = trackRef.current!;
        const width = track.scrollWidth / 2;
        const duration = width / speed;

        const tween = gsap.to(track, {
          xPercent: -50,
          duration,
          ease: "none",
          repeat: -1,
        });
        tweenRef.current = tween;

        const onVisibility = () => {
          if (document.hidden) tween.pause();
          else if (!manuallyPausedRef.current) tween.play();
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
          document.removeEventListener("visibilitychange", onVisibility);
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: trackRef, dependencies: [speed] }
  );

  // Scroll a bit faster while the page is scrolling fast (Lenis velocity).
  useGSAP(() => {
    if (!lenis) return;

    const onScroll = ({ velocity }: { velocity?: number }) => {
      const tween = tweenRef.current;
      if (!tween) return;
      const boost = 1 + Math.min(Math.abs(velocity ?? 0) * 0.05, 1.5);
      gsap.to(tween, { timeScale: boost, duration: 0.3, overwrite: true });
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  const toggle = () => {
    const tween = tweenRef.current;
    if (!tween) return;

    if (manuallyPausedRef.current) {
      tween.play();
    } else {
      tween.pause();
    }
    manuallyPausedRef.current = !manuallyPausedRef.current;
    setPaused(manuallyPausedRef.current);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className="flex w-max flex-nowrap motion-reduce:flex-wrap"
        onMouseEnter={() => tweenRef.current?.pause()}
        onMouseLeave={() => !manuallyPausedRef.current && tweenRef.current?.play()}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 whitespace-nowrap text-ink motion-reduce:mb-2">
            {item}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={toggle}
        className="absolute right-2 top-2 rounded-ui border border-line bg-surface px-2 py-1 text-xs text-ink motion-reduce:hidden"
      >
        {paused ? t("marquee.play") : t("marquee.pause")}
      </button>
    </div>
  );
}
