"use client";

import Image from "next/image";
import footerIllustration from "@/public/images/footer-illustration.webp";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
import { gsap } from "@/lib/motion";
import RollText from "@/components/motion/RollText";
import WordRotator from "@/components/motion/WordRotator";

const INSET_PX = "px-[max(1rem,calc((100%-1440px)/2+1rem))] md:px-[max(2rem,calc((100%-1440px)/2+2rem))]";

/**
 * Pinned reveal (Section B): sits directly under <main> (Section A) from
 * the start, dimmed. `wrapRef` is a plain normal-flow div sized `200vh`
 * with `-mt-[100vh]` — that negative margin pulls it up so it starts
 * exactly behind <main>'s last screen, and the 200vh height gives the
 * sticky child inside it exactly 100vh of scroll room to stay pinned.
 *
 * Critically, `wrapRef` — NOT the sticky <section> inside it — is what
 * ScrollTrigger watches. Earlier attempts at this exact effect used the
 * sticky element itself as the trigger, which GSAP/ScrollTrigger reads
 * unreliably (see notes/footer-reveal.md, several failed rounds). A plain
 * div with a real, static, deterministic height has no such problem.
 */
export default function CtaReveal() {
  const t = useTranslations();
  const locale = useLocale();
  const wrapRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!wrapRef.current) return;

      const mm = gsap.matchMedia();

      mm.add({ all: true, reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
          },
        });

        tl.fromTo(dimRef.current, { opacity: 0.45 }, { opacity: 0, ease: "none" }, 0);
        tl.fromTo(
          titleRef.current,
          { filter: "blur(8px)", opacity: 0.5 },
          { filter: "blur(0px)", opacity: 1, ease: "none" },
          0
        );
        tl.fromTo(
          imageRef.current,
          { scale: 0.9, y: 60, filter: "blur(8px)" },
          { scale: 1, y: 0, filter: "blur(0px)", ease: "none" },
          0
        );

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  const words = t.raw("footer.ctaWords") as string[];

  return (
    <div ref={wrapRef} className="relative z-10 -mt-[100vh] h-[200vh]">
      <section className="sticky top-0 flex h-screen items-center overflow-hidden bg-[#F4F3EF]">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={footerIllustration}
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>

        <div className={`relative w-full ${INSET_PX}`}>
          <p ref={titleRef} className="max-w-3xl text-3xl leading-tight text-ink md:text-6xl">
            {t("footer.ctaPrefix")} <WordRotator words={words} className="text-accent" />
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-8 inline-flex w-fit items-center rounded-full bg-accent px-5 py-3 text-surface"
          >
            <RollText>{t("header.letsTalk")}</RollText>
          </Link>
        </div>

        <div ref={dimRef} className="pointer-events-none absolute inset-0 bg-black" />
      </section>
    </div>
  );
}
