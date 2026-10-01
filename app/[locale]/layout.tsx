import { Geist, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import Header from "@/components/ui/Header";
import CtaReveal from "@/components/ui/CtaReveal";
import Footer from "@/components/ui/Footer";
import { LenisProvider } from "@/lib/lenis";
import PageTransitions from "@/components/motion/PageTransitions";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
    variable: "--font-instrument-serif",
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
});

const sfProRounded = localFont({
    src: "../../font/FontsFree-Net-SF-Pro-Rounded-Bold.ttf",
    variable: "--font-sf-pro-rounded",
    weight: "700",
    display: "swap",
});

export function generateStaticParams() {
    return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string}>
}) {
    const { locale } = await params;

    if (!hasLocale(locales, locale)) {
        notFound();
    }

    return (
        <html lang={ locale } className={`${geistSans.variable} ${instrumentSerif.variable} ${sfProRounded.variable}`}>
            <body>
                <NextIntlClientProvider>
                    <PageTransitions />
                    <LenisProvider>
                        <Header />
                        <main className="relative z-20 rounded-b-[20px] bg-bg pt-20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] md:rounded-b-[32px]">
                            {children}
                        </main>
                        <CtaReveal />
                        <Footer />
                    </LenisProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}