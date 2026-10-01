"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Wires internal <a> clicks (including every next/link) through the
 * browser's native View Transitions API. No React ViewTransition component
 * involved — that export isn't available in the installed React build
 * (see notes/motion-components.md). document.startViewTransition() is a
 * separate browser API and works regardless.
 *
 * ponytail: relies on router.push() flushing before the browser's next
 * paint opportunity, which holds for prefetched routes (Next.js prefetches
 * visible <Link>s by default) but isn't spec-guaranteed. Un-prefetched /
 * slow routes just navigate without the transition — no breakage, only a
 * missed animation.
 */
export default function PageTransitions() {
  const router = useRouter();

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      e.preventDefault();
      document.startViewTransition(() => {
        router.push(url.pathname + url.search + url.hash);
      });
    };

    // Capture phase: must run BEFORE next/link's own bubble-phase click
    // handler. Link checks `e.defaultPrevented` and skips its own
    // navigation if it's already true — capture lets us preventDefault()
    // first and take over navigation ourselves, inside the view
    // transition. On bubble phase (the default), Link's handler had
    // already run and navigated by the time we got here.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [router]);

  return null;
}
