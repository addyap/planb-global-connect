import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo-plan-b.png";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";
import { Menu, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = ["home", "about", "services", "area", "contact"] as const;

export const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (open || currentScrollY < 24) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
        scrolled ? "bg-primary/95 backdrop-blur-md shadow-elegant" : "bg-primary/70 backdrop-blur-sm"
      )}
    >
      <div className="container flex items-center justify-between h-20 md:h-28">
        <button onClick={() => go("home")} className="flex items-center gap-2 group" aria-label="Plan B Concept — home">
          <img
            src={logo}
            alt="Plan B Concept"
            className="h-16 md:h-24 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105"
          />
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => go(s)}
              className="text-sm font-medium text-primary-foreground/90 hover:text-accent transition-colors"
            >
              {t(`nav.${s}`)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <LanguageSwitcher />
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
          >
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </Button>
          <button
            className="md:hidden p-2 text-primary-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-primary border-t border-accent/20">
          <div className="container py-4 flex flex-col gap-1">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => go(s)}
                className="text-left px-2 py-3 text-primary-foreground hover:text-accent border-b border-accent/10 last:border-0"
              >
                {t(`nav.${s}`)}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
