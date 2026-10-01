"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ParallaxImage({ src, alt, className = "" }: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!frameRef.current || !imageRef.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          all: true,
          pointerFine: "(pointer: fine)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { pointerFine, reduceMotion } = context.conditions as {
            pointerFine: boolean;
            reduceMotion: boolean;
          };
          if (!pointerFine || reduceMotion) return;

          gsap.fromTo(
            imageRef.current,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: frameRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: frameRef }
  );

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      <div ref={imageRef} className="absolute inset-0 scale-[1.2]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
}
