"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LangSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "id" : "en";
  const rest = pathname.replace(`/${locale}`, "");
  const href = `/${otherLocale}${rest}`;

  return (
    <Link
      href={href}
      className="text-sm uppercase text-muted transition-colors hover:text-accent"
    >
      {otherLocale}
    </Link>
  );
}
