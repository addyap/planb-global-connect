import { useTranslation } from "react-i18next";
import logo from "@/assets/logo-plan-b.png";
import { CONTACT } from "@/lib/contact";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container grid md:grid-cols-3 gap-8 items-start">
        <div>
          <img src={logo} alt="Plan B Concept" className="h-16 w-auto mb-3" />
          <p className="text-sm text-primary-foreground/70 max-w-xs">{t("footer.tagline")}</p>
        </div>
        <div className="text-sm space-y-1.5 text-primary-foreground/80">
          <div className="font-display text-accent text-xs tracking-widest mb-2">{CONTACT.name}</div>
          <div>{CONTACT.phoneDisplay}</div>
          <div className="break-all">{CONTACT.email}</div>
        </div>
        <div className="text-sm text-primary-foreground/60 md:text-right">
          © {new Date().getFullYear()} Plan B Concept. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};
