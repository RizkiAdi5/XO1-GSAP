"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import MenuOverlay from "./MenuOverlay";
import LangSwitch from "./LangSwitch";
import RollText from "@/components/motion/RollText";
import { ChatIcon } from "./icons";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="fixed inset-x-0 top-0 z-40 px-[max(1rem,calc((100%-1440px)/2+1rem))] py-4 md:px-[max(2rem,calc((100%-1440px)/2+2rem))]">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="rounded-full border border-white/40 bg-bg/50 px-5 py-3 font-semibold text-ink shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150"
        >
          Rizki Adi
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-white/40 bg-bg/50 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150 sm:flex">
            <LangSwitch />
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden items-center gap-2 rounded-full border border-white/40 bg-bg/50 py-3 pl-5 pr-3 text-ink shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150 sm:flex"
          >
            <RollText>{t("header.letsTalk")}</RollText>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10">
              <ChatIcon className="h-3.5 w-3.5" />
            </span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/70 px-5 py-3 text-surface shadow-lg shadow-black/10 backdrop-blur-xl backdrop-saturate-150"
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
      />
    </header>
  );
}
