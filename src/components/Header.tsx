import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo-plan-b.png";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";
import { Menu, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { key: string; path: string; sectionId?: string };

const navItems: NavItem[] = [
  { key: "home", path: "/", sectionId: "home" },
  { key: "about", path: "/#about", sectionId: "about" },
  { key: "services", path: "/#services", sectionId: "services" },
  { key: "questionnaire", path: "/questionnaire" },
  { key: "area", path: "/#area", sectionId: "area" },
  { key: "contact", path: "/#contact", sectionId: "contact" },
];

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
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

  // When landing on a section URL (e.g. /about) or a hash (/#about), scroll to that section.
  useEffect(() => {
    let id: string | undefined;
    if (location.hash) {
      id = location.hash.replace(/^#/, "");
    } else {
      const match = navItems.find((item) => item.path === location.pathname);
      if (match?.sectionId) id = match.sectionId;
    }
    if (!id) return;
    const targetId = id;
    requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (targetId === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [location.pathname, location.hash]);

  const handleNav = (item: NavItem) => {
    setOpen(false);
    // For section links, stay on / and scroll — avoids a redirect round-trip.
    if (item.sectionId) {
      if (location.pathname !== "/") {
        navigate(`/#${item.sectionId}`);
      } else {
        document.getElementById(item.sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (item.sectionId === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (item.path !== location.pathname) navigate(item.path);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
        scrolled ? "bg-primary/95 backdrop-blur-md shadow-elegant" : "bg-primary/70 backdrop-blur-sm"
      )}
    >
      <div className="container flex h-20 items-start justify-between md:h-24">
        <button onClick={() => handleNav(navItems[0])} className="group flex items-center gap-2" aria-label="Plan B Côte d'Azur — home">
          <img
            src={logo}
            alt="Plan B Côte d'Azur"
            width={200}
            height={200}
            className="h-16 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105 md:h-28"
          />
        </button>

        <nav className="hidden items-center gap-7 self-center md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item)}
              className="text-sm font-medium text-primary-foreground/90 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
            >
              {t(`nav.${item.key}`)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 self-center md:gap-5">
          {!["/mentions-legales", "/politique-de-confidentialite", "/cgu"].includes(location.pathname) && (
            <LanguageSwitcher />
          )}
          <Button
            asChild
            size="sm"
            className="hidden bg-accent text-accent-foreground shadow-gold hover:bg-accent/90 sm:inline-flex"
          >
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </Button>
          <button
            className="p-2 text-primary-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-accent/20 bg-primary md:hidden" aria-label="Mobile">
          <div className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item)}
                className="border-b border-accent/10 px-2 py-3 text-left text-primary-foreground hover:text-accent last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
              >
                {t(`nav.${item.key}`)}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
