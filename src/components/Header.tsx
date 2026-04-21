import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo-plan-b.png";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = ["home", "about", "services", "area", "contact"] as const;

export const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-primary/95 backdrop-blur-md shadow-elegant" : "bg-primary/70 backdrop-blur-sm"
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <button onClick={() => go("home")} className="flex items-center gap-2">
          <img src={logo} alt="Plan B Concept" className="h-10 md:h-12 w-auto" />
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

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
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
