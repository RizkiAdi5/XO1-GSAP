import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MailIcon, WhatsAppIcon, LinkedInIcon, GitHubIcon } from "./icons";

const INSET_PX = "px-[max(1rem,calc((100%-1440px)/2+1rem))] md:px-[max(2rem,calc((100%-1440px)/2+2rem))]";

/**
 * Normal scroll, no pin. `-mt-8` pulls it up to overlap CtaReveal by that
 * amount, so the rounded top corner shows CtaReveal's color underneath
 * instead of the page background. Height is just its natural content
 * height — an earlier `min-h-[calc(100vh-70px)]` (to guarantee a peek of
 * CtaReveal above the footer at scroll-end) left a huge empty gap since
 * this footer's actual content is nowhere near a full screen tall.
 */
export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/work`, label: t("nav.work") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
  ];

  return (
    <footer
      className={`relative z-20 -mt-8 rounded-t-[20px] bg-ink py-12 text-surface md:rounded-t-[32px] ${INSET_PX}`}
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="font-rounded text-lg">Rizki Adi Prasetyo</p>
          <p className="mt-2 max-w-sm text-sm text-surface/60">{t("footer.tagline")}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-surface/40">
            {t("footer.navigate")}
          </p>
          <nav className="mt-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-surface/70 hover:text-surface">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6 border-t border-surface/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-surface/60">
          <span>{t("footer.copyright", { year })}</span>
          <span>{t("footer.location")}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:riiizkiadiii@gmail.com"
            aria-label={t("contact.channels.email")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface/20 text-surface/70 transition-colors hover:border-accent hover:text-accent"
          >
            <MailIcon className="h-5 w-5" />
          </a>
          <a
            href="https://wa.me/6289670468240"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("contact.channels.whatsapp")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface/20 text-surface/70 transition-colors hover:border-accent hover:text-accent"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("contact.channels.linkedin")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface/20 text-surface/70 transition-colors hover:border-accent hover:text-accent"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface/20 text-surface/70 transition-colors hover:border-accent hover:text-accent"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
