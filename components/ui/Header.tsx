"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import MenuOverlay from "./MenuOverlay";
import LangSwitch from "./LangSwitch";
import BookCallDialog from "./BookCallDialog";
import RollText from "@/components/motion/RollText";
import { ChatIcon } from "./icons";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  // Set on first open and never reset: Calendly loads once, reopening is instant.
  const [callLoaded, setCallLoaded] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/work`, label: t("nav.work") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <Link
          href={`/${locale}`}
          className="glass rounded-full px-5 py-3 font-semibold text-ink"
        >
          Rizki Adi
        </Link>

        <div className="flex items-center gap-2">
          <div className="glass hidden items-center rounded-full px-4 py-3 sm:flex">
            <LangSwitch />
          </div>

          <Link
            href={`/${locale}/contact`}
            className="glass hidden items-center gap-2 rounded-full py-3 pl-5 pr-3 text-ink sm:flex"
          >
            <RollText>{t("header.letsTalk")}</RollText>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10">
              <ChatIcon className="h-3.5 w-3.5" />
            </span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className="glass-dark flex items-center gap-2 rounded-full px-5 py-3 text-surface"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <RollText>{menuOpen ? t("menu.close") : t("menu.open")}</RollText>
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-surface/20 text-xs"
            >
              ···
            </span>
          </button>
        </div>
      </div>

      <MenuOverlay
        open={menuOpen}
        onClose={closeMenu}
        navLinks={navLinks}
        triggerRef={menuButtonRef}
        onBookCall={() => {
          setMenuOpen(false);
          // Park focus on the Menu button first: the dialog returns focus to
          // whatever was focused when it opened, and the menu is about to hide.
          menuButtonRef.current?.focus();
          setCallLoaded(true);
          setCallOpen(true);
        }}
      />

      <BookCallDialog open={callOpen} load={callLoaded} onClose={() => setCallOpen(false)} />
    </header>
  );
}
