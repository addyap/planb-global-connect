import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-plan-b.png";
import { CONTACT } from "@/lib/contact";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary text-primary-foreground py-16 border-t border-accent/20">
      <div className="container grid md:grid-cols-3 gap-10 items-start">
        <div>
          <img
            src={logo}
            alt="Plan B Concept"
            className="h-28 md:h-36 w-auto mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
          />
          <p className="text-sm text-primary-foreground/70 max-w-xs leading-relaxed">{t("footer.tagline")}</p>
        </div>
        <div className="text-sm space-y-2 text-primary-foreground/85">
          <div className="font-display text-accent text-xs tracking-[0.25em] uppercase mb-3">{CONTACT.name}</div>
          <a href={`tel:${CONTACT.phoneIntl}`} className="block hover:text-accent transition-colors">
            {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="block break-all hover:text-accent transition-colors">
            {CONTACT.email}
          </a>
        </div>
        <div className="text-sm text-primary-foreground/60 md:text-right">
          © {new Date().getFullYear()} Plan B Concept. {t("footer.rights")}
        </div>
      </div>
      <div className="container mt-10 pt-6 border-t border-accent/10 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/50 justify-center">
        <Link to="/mentions-legales" className="hover:text-accent transition-colors">Mentions légales</Link>
        <span className="text-primary-foreground/30">|</span>
        <Link to="/politique-de-confidentialite" className="hover:text-accent transition-colors">Politique de confidentialité</Link>
        <span className="text-primary-foreground/30">|</span>
        <Link to="/cgu" className="hover:text-accent transition-colors">CGU</Link>
      </div>
    </footer>
  );
};
