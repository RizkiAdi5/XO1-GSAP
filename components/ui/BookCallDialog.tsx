"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { gsap, motionTokens } from "@/lib/motion";
import { useLenis } from "@/lib/lenis";
import CalendlyEmbed from "./CalendlyEmbed";

const CALENDLY_URL =
  "https://calendly.com/riiizkiadiii/discovery-call?hide_gdpr_banner=1&hide_event_type_details=1&primary_color=2f45ff";

/**
 * "Book a call" modal with the Calendly scheduler inside.
 * Native <dialog> + showModal(): focus moves in, Tab stays inside, the page
 * behind is inert, and focus returns to the trigger on close, all for free.
 * The open/close animation is ours (GSAP), so close never happens instantly:
 * every close path (Esc, backdrop, × button) asks the parent to set
 * open=false, and the dialog only really closes after the exit tween.
 *
 * `load` stays true after the first open, so the Calendly iframe is created
 * once and reopening is instant (instead of loading on every page view).
 */
export default function BookCallDialog({
  open,
  load,
  onClose,
}: {
  open: boolean;
  load: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const dialog = dialogRef.current!;
      const overlay = overlayRef.current!;
      const panel = panelRef.current!;
      const box = boxRef.current!;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const parts = panel.querySelectorAll("[data-reveal]");

      if (open && !dialog.open) {
        dialog.showModal();
        lenis?.stop();
        gsap
          .timeline({ defaults: { ease: motionTokens.ease.out } })
          .fromTo(
            overlay,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: motionTokens.duration.base },
          )
          // Wrapper (incl. the corner ×) rises and scales as one piece...
          .fromTo(
            panel,
            reduce ? { autoAlpha: 0 } : { autoAlpha: 0, y: 80, scale: 0.94 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: reduce ? 0.2 : motionTokens.duration.slow,
            },
            "<0.05",
          )
          // ...while only the white box "blooms" open via clip-path. The clip is
          // on the box, not the wrapper, so it never cuts off the × that sits
          // half outside the corner.
          .fromTo(
            box,
            { clipPath: reduce ? "inset(0% 0% 0% 0% round 32px)" : "inset(12% 6% 0% 6% round 48px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 32px)",
              duration: reduce ? 0 : motionTokens.duration.slow,
            },
            "<",
          )
          .fromTo(
            parts,
            { autoAlpha: 0, y: reduce ? 0 : motionTokens.distance },
            {
              autoAlpha: 1,
              y: 0,
              duration: motionTokens.duration.base,
              stagger: motionTokens.stagger,
            },
            "<0.25",
          );
      } else if (!open && dialog.open) {
        // Exit is quicker than entrance (PRD motion rule).
        gsap
          .timeline({
            defaults: {
              ease: motionTokens.ease.inOut,
              duration: motionTokens.duration.fast,
            },
            onComplete: () => {
              dialog.close();
              lenis?.start();
            },
          })
          .to(
            panel,
            reduce ? { autoAlpha: 0 } : { autoAlpha: 0, y: 40, scale: 0.97 },
          )
          .to(overlay, { autoAlpha: 0 }, "<0.1");
      }
    },
    { dependencies: [open, lenis], revertOnUpdate: false },
  );

  return (
    <dialog
      ref={dialogRef}
      // Esc fires "cancel": stop the instant close and run the exit animation instead.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="book-call-title"
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent"
    >
      <div
        ref={overlayRef}
        onClick={onClose}
        className="invisible absolute inset-0 bg-ink/40 backdrop-blur-md"
      />

      <div className="pointer-events-none relative flex h-full items-end justify-center p-2 md:items-center md:p-8">
        {/* Desktop: info column left, calendar right, so the panel is exactly as
            tall as the calendar (700px). A title row on top pushed it past the
            screen and made it scroll. Mobile / short screens: scrolls as fallback. */}
        {/* panelRef = animated wrapper; the × sits on its top-right corner,
            half outside, so it can't live inside the scrolling/rounded box. */}
        <div
          ref={panelRef}
          className="pointer-events-auto invisible relative w-full max-w-5xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("menu.close")}
            className="absolute -right-2 -top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-xl text-surface shadow-lg transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:rotate-90 md:-right-4 md:-top-4"
          >
            ×
          </button>
          <div
            data-lenis-prevent
            className="grid max-h-[92svh] grid-cols-1 overflow-y-auto rounded-[32px] bg-surface md:grid-cols-[280px_minmax(0,1fr)]"
          >
            <div className="p-6 md:border-r md:border-line md:p-8">
              <h2
                id="book-call-title"
                data-reveal
                className="text-2xl text-ink md:text-4xl"
              >
                {t("contact.call.title")}
              </h2>
              <p data-reveal className="mt-3 text-sm text-muted md:text-base">
                {t("contact.call.intro")}
              </p>
              <ul
                data-reveal
                className="mt-6 flex flex-wrap gap-2 text-sm text-ink"
              >
                <li className="rounded-full bg-bg px-3 py-1.5">
                  {t("contact.call.duration")}
                </li>
                <li className="rounded-full bg-bg px-3 py-1.5">Google Meet</li>
              </ul>
            </div>

            <div data-reveal className="border-t border-line md:border-t-0">
              {load && <CalendlyEmbed url={CALENDLY_URL} />}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
