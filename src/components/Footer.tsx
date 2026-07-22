import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-plan-b.webp";
import { CONTACT } from "@/lib/contact";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary text-primary-foreground py-8 border-t border-accent/20">
      <div className="container grid md:grid-cols-3 gap-10 items-start">
        <div>
          <img
            src={logo}
            alt="Plan B Concept"
            width={400}
            height={400}
            loading="lazy"
            className="h-12 md:h-14 w-auto mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          />
          {/* /85 measured ≥4.5:1 against --primary (dark navy) — meets WCAG AA. */}
          <p className="text-sm text-primary-foreground/85 max-w-xs leading-relaxed">{t("footer.tagline")}</p>
        </div>
        <div className="text-sm space-y-2 text-primary-foreground/90">
          <div className="font-display text-accent text-xs tracking-[0.25em] uppercase mb-3">{CONTACT.name}</div>
          <a href={`tel:${CONTACT.phoneIntl}`} className="block hover:text-accent transition-colors">
            {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="block break-all hover:text-accent transition-colors">
            {CONTACT.email}
          </a>
        </div>
        <div className="text-sm text-primary-foreground/85 md:text-right">
          © {new Date().getFullYear()} Plan B Concept. {t("footer.rights")}
        </div>
      </div>
      <div className="container mt-3 pt-3 border-t border-accent/10 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/85 justify-center">
        <Link to="/mentions-legales" className="hover:text-accent transition-colors">Mentions légales</Link>
        <span className="text-primary-foreground/40" aria-hidden="true">|</span>
        <Link to="/politique-de-confidentialite" className="hover:text-accent transition-colors">Politique de confidentialité</Link>
        <span className="text-primary-foreground/40" aria-hidden="true">|</span>
        <Link to="/cgu" className="hover:text-accent transition-colors">CGU</Link>
      </div>
    </footer>
  );
};
