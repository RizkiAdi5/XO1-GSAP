"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

// Safety net: if the route never commits (error, same-path edge case), stop
// waiting so the browser doesn't abort the transition (Chrome gives up ~4s).
const COMMIT_TIMEOUT_MS = 2500;

/**
 * Wires internal <a> clicks (including every next/link) through the
 * browser's native View Transitions API. No React ViewTransition component
 * involved — that export isn't available in the installed React build
 * (see notes/motion-components.md). document.startViewTransition() is a
 * separate browser API and works regardless.
 *
 * The update callback returns a promise that resolves only once the new
 * route has actually committed to the DOM (pathname changed). Before, it just
 * called router.push() and returned, but push is async: the browser took the
 * "new page" snapshot while the DOM still held the OLD page, animated the old
 * page rising in, then the real page popped in after (the "splash").
 */
export default function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const resolveCommitRef = useRef<(() => void) | null>(null);

  // Layout effect = right after React commits the new route's DOM, before the
  // browser's next frame, so the "new" snapshot is the destination page.
  useLayoutEffect(() => {
    resolveCommitRef.current?.();
    resolveCommitRef.current = null;
  }, [pathname]);

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
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            resolveCommitRef.current = resolve;
            setTimeout(resolve, COMMIT_TIMEOUT_MS);
            router.push(url.pathname + url.search + url.hash);
          })
      );
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
