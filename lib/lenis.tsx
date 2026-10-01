"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "./motion";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const tickerRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const instance = new Lenis({
      autoRaf: false,
    });

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    tickerRef.current = onTick;
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
      }
      instance.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
