"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { SOCIALS, VideoIcon } from "./icons";
import RollText from "@/components/motion/RollText";

type NavLink = { href: string; label: string };

export default function MenuOverlay({
  open,
  onClose,
  navLinks,
  triggerRef,
  onBookCall,
}: {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  triggerRef: RefObject<HTMLButtonElement | null>;
  onBookCall: () => void;
}) {
  const t = useTranslations();
  const cardRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Focus first link on open, close on Escape or click outside (but not
  // on the trigger button — its own onClick already toggles, so treating
  // it as "outside" too double-fires and undoes the close).
  useEffect(() => {
    if (!open) return;
    cardRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        cardRef.current &&
        !cardRef.current.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose, triggerRef]);

  // Close on route change.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    if (openRef.current) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Each card animates independently (own transform/delay) so they read
  // as two distinct sections entering one after another, not one rigid
  // block. Nav card leads; contact card follows ~120ms later on open, and
  // both close together (no delay) for a snappier close.
  // Home's href is just `/${locale}` (one segment) — only exact-match it,
  // otherwise it'd stay "active" on every page. Other links prefix-match
  // their own sub-routes too (e.g. /work stays active on /work/[slug]).
  const isActive = (href: string) => {
    if (pathname === href) return true;
    const segments = href.split("/").filter(Boolean);
    return segments.length > 1 && pathname.startsWith(`${href}/`);
  };

  const cardStyle = (delayMs: number): React.CSSProperties => ({
    transform: open
      ? "translateX(0) rotate(0deg)"
      : "translateX(8rem) rotate(10deg)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transformOrigin: "top right",
    transitionProperty: "transform, opacity",
    transitionDuration: "0.7s",
    transitionDelay: open ? `${delayMs}ms` : "0ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  return (
    <div
      ref={cardRef}
      aria-hidden={!open}
      className="pointer-events-none fixed right-6 top-24 z-50 w-[calc(100%-3rem)] max-w-md md:right-12"
    >
      <nav
        className="flex flex-col gap-2 rounded-[28px] bg-surface p-8 shadow-lg motion-reduce:transition-opacity"
        style={cardStyle(0)}
      >
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between rounded-ui px-3 py-1 text-4xl leading-tight transition-colors hover:bg-bg ${
                active ? "text-accent" : "text-ink"
              }`}
            >
              <span>{link.label}</span>
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full bg-accent transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <div
        className="mt-4 rounded-[28px] bg-ink p-8 text-surface motion-reduce:transition-opacity"
        style={cardStyle(120)}
      >
        <p className="text-xs uppercase tracking-wide text-surface/50">
          {t("menu.startProject")}
        </p>
        <a
          href="mailto:riiizkiadiii@gmail.com"
          tabIndex={open ? 0 : -1}
          className="mt-2 block break-all text-xl hover:text-surface/80 md:text-2xl"
        >
          riiizkiadiii@gmail.com
        </a>
        <a
          href="https://wa.me/6289670468240"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={open ? 0 : -1}
          className="mt-1 block text-sm text-surface/50 hover:text-surface/80"
        >
          WhatsApp +62 896-7046-8240
        </a>

        {/* Opens the same booking dialog as before (BookCallDialog, owned by Header). */}
        <button
          type="button"
          onClick={onBookCall}
          tabIndex={open ? 0 : -1}
          className="mt-6 flex w-full items-center justify-between rounded-full bg-surface py-2 pl-6 pr-2 text-sm uppercase text-ink"
        >
          <RollText>{t("contact.call.title")}</RollText>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg">
            <VideoIcon className="h-5 w-5" />
          </span>
        </button>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-surface/50">{t("contact.channels.timezone")}</p>
          <div className="flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/10 hover:bg-surface/20"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
