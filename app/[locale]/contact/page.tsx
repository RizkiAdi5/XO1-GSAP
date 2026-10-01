import { useTranslations } from "next-intl";
import ContactForm from "@/components/ui/ContactForm";

export default function ContactPage() {
  const t = useTranslations();

  return (
    <div className="px-4 py-16 md:px-12 lg:px-24 xl:px-40 2xl:px-56">
      <h1 className="text-4xl text-ink md:text-6xl">{t("contact.title")}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t("contact.intro")}</p>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside>
          <h2 className="text-lg text-ink">{t("contact.channels.title")}</h2>
          <ul className="mt-4 flex flex-col gap-2 text-muted">
            <li>
              <a href="mailto:riiizkiadiii@gmail.com" className="hover:text-accent">
                {t("contact.channels.email")}: riiizkiadiii@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/6289670468240"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                {t("contact.channels.whatsapp")}
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {t("contact.channels.linkedin")}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted">{t("contact.channels.timezone")}</p>
        </aside>
      </div>
    </div>
  );
}
