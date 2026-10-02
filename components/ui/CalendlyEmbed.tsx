"use client";

import Script from "next/script";
import { useRef } from "react";

type CalendlyWindow = Window & {
  Calendly?: {
    initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
  };
};

/**
 * Calendly inline booking widget.
 * Not Calendly's copy-paste snippet as-is: that script only scans the page for
 * .calendly-inline-widget once, when it first loads. After a client-side
 * navigation (leave /contact, come back) the script is already loaded and the
 * box stays empty. next/script's onReady runs on every mount, so we init
 * the widget into our own div each time.
 */
export default function CalendlyEmbed({
  url,
  className = "",
}: {
  url: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Calendly's own CSS: styles the loading spinner shown while the iframe loads.
          React 19 hoists a <link precedence> into <head> once, however many embeds mount. */}
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" precedence="default" />
      {/* data-cursor="hide": the iframe has its own native cursor, and pointer
          events stop reaching our page inside it, so the liquid cursor would
          freeze at the edge. */}
      <div ref={ref} data-cursor="hide" className={`relative h-[700px] min-w-[320px] ${className}`} />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onReady={() => {
          const el = ref.current;
          const calendly = (window as CalendlyWindow).Calendly;
          if (!el || !calendly || el.childElementCount > 0) return;
          // Fixed height on purpose, not Calendly's `resize: true`: resize grows the
          // widget to the full list of time slots (~2000px) once a date is picked.
          // At 700px the date view fits exactly and the slot list scrolls inside
          // Calendly's own column, which is how Calendly is designed to work.
          calendly.initInlineWidget({ url, parentElement: el });
        }}
      />
    </>
  );
}
