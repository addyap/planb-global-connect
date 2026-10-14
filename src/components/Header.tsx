import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo-plan-b.webp";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";
import { track } from "@/lib/track";

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
    requestAnimationFrame(() => scrollToSection(targetId));
  }, [location.pathname, location.hash]);

  // Close the mobile menu with Escape (returning focus to the toggle) or a tap outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      document.querySelector<HTMLButtonElement>('[aria-controls="mobile-nav"]')?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!(e.target as Element).closest("header")) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Nav items are real links (crawlable, middle-click / copy-link work); plain left clicks
  // are handled here so section links scroll in place instead of reloading the page.
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setOpen(false);
    if (item.sectionId) {
      if (location.pathname !== "/") navigate(`/#${item.sectionId}`);
      else scrollToSection(item.sectionId);
      return;
    }
    if (item.path !== location.pathname) navigate(item.path);
  };

  const isCurrent = (item: NavItem) => !item.sectionId && item.path === location.pathname;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
        scrolled ? "bg-primary/95 backdrop-blur-md shadow-elegant" : "bg-primary/70 backdrop-blur-sm"
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        <a href="/" onClick={(e) => handleNav(e, navItems[0])} className="group flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Plan B Concept — home">
          <img
            src={logo}
            alt="Plan B Concept"
            width={400}
            height={400}
            className="h-10 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-transform motion-safe:group-hover:scale-105 md:h-12"
          />
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.path}
              onClick={(e) => handleNav(e, item)}
              aria-current={isCurrent(item) ? "page" : undefined}
              className="text-sm font-medium text-primary-foreground/90 transition-colors hover:text-accent aria-[current=page]:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          {!["/mentions-legales", "/politique-de-confidentialite", "/cgu"].includes(location.pathname) && (
            <LanguageSwitcher />
          )}
          <Button
            asChild
            size="sm"
            className="hidden bg-accent text-accent-foreground shadow-gold hover:bg-accent/90 sm:inline-flex"
          >
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp" onClick={() => track("whatsapp_click", { from: "header" })}>
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </Button>
          <button
            className="p-2 text-primary-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
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
              <a
                key={item.key}
                href={item.path}
                onClick={(e) => handleNav(e, item)}
                aria-current={isCurrent(item) ? "page" : undefined}
                className="border-b border-accent/10 px-2 py-3 text-left text-primary-foreground hover:text-accent aria-[current=page]:text-accent last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
            {/* On phones the header has no room for a CTA, so the menu carries both direct lines. */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { from: "menu" })}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="border-accent/60 bg-transparent text-accent hover:bg-accent hover:text-accent-foreground">
                <a href={`tel:${CONTACT.phoneIntl}`} onClick={() => track("phone_click", { from: "menu" })}>
                  <Phone className="h-4 w-4" /> {t("contact.phoneLabel")}
                </a>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
