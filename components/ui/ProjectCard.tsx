"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionTokens } from "@/lib/motion";

type ProjectCardProps = {
  href: string;
  title: string;
  role: string;
  year: string;
  image: string;
  imageAlt: string;
};

export default function ProjectCard({
  href,
  title,
  role,
  year,
  image,
  imageAlt,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useGSAP(
    () => {
      if (!cardRef.current || !imageRef.current || !pillRef.current) return;

      const card = cardRef.current;
      const imageEl = imageRef.current;
      const pill = pillRef.current;

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

          if (reduceMotion) return;

          if (pointerFine) {
            quickX.current = gsap.quickTo(pill, "x", {
              duration: motionTokens.duration.fast,
              ease: motionTokens.ease.out,
            });
            quickY.current = gsap.quickTo(pill, "y", {
              duration: motionTokens.duration.fast,
              ease: motionTokens.ease.out,
            });
          }

          const onEnter = () => {
            gsap.to(imageEl, {
              scale: 1.04,
              duration: motionTokens.duration.base,
              ease: motionTokens.ease.out,
            });
            if (pointerFine)
              gsap.to(pill, { autoAlpha: 1, duration: motionTokens.duration.fast });
          };
          const onLeave = () => {
            gsap.to(imageEl, {
              scale: 1,
              duration: motionTokens.duration.base,
              ease: motionTokens.ease.out,
            });
            if (pointerFine)
              gsap.to(pill, { autoAlpha: 0, duration: motionTokens.duration.fast });
          };
          const onMove = (e: PointerEvent) => {
            if (!pointerFine) return;
            const rect = card.getBoundingClientRect();
            quickX.current?.(e.clientX - rect.left);
            quickY.current?.(e.clientY - rect.top);
          };

          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointerleave", onLeave);
          card.addEventListener("pointermove", onMove);

          return () => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointerleave", onLeave);
            card.removeEventListener("pointermove", onMove);
          };
        }
      );

      return () => mm.revert();
    },
    { scope: cardRef }
  );

  return (
    <Link
      ref={cardRef}
      href={href}
      className="group relative block overflow-hidden rounded-card border border-line"
    >
      <div ref={imageRef} className="relative aspect-[4/3] w-full">
        <Image src={image} alt={imageAlt} fill className="object-cover" />
      </div>

      <div
        ref={pillRef}
        className="pointer-events-none absolute left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent px-4 py-2 text-sm text-surface opacity-0 [@media(pointer:fine)]:flex"
      >
        View
      </div>

      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <h3 className="text-lg text-ink">{title}</h3>
          <p className="text-sm text-muted">{role}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{year}</span>
          <span className="text-ink [@media(pointer:fine)]:hidden">→</span>
        </div>
      </div>
    </Link>
  );
}
