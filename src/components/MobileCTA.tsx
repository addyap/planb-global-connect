import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * Phones only: a bottom bar with the two direct lines, shown once the hero (and its buttons)
 * has scrolled away, and hidden again while the contact section or footer is on screen —
 * those already show the same options, and the bar would cover the footer links.
 */
export const MobileCTA = () => {
  const { t } = useTranslation();
  const [pastHero, setPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const hero = document.getElementById("home");
    const targets = [document.getElementById("contact"), document.querySelector("footer")].filter(Boolean) as Element[];
    const seen = new Set<Element>();

    const heroObs = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    const endObs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setContactVisible(seen.size > 0);
    });
    if (hero) heroObs.observe(hero);
    targets.forEach((el) => endObs.observe(el));
    return () => {
      heroObs.disconnect();
      endObs.disconnect();
    };
  }, []);

  const shown = pastHero && !contactVisible;

  return (
    <div
      aria-hidden={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-accent/20 bg-primary/95 px-4 pt-3 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none md:hidden",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        shown ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <div className="grid grid-cols-2 gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={shown ? undefined : -1}
          onClick={() => track("whatsapp_click", { from: "mobile_bar" })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent text-sm font-semibold text-accent-foreground"
        >
          <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
        </a>
        <a
          href={`tel:${CONTACT.phoneIntl}`}
          tabIndex={shown ? undefined : -1}
          onClick={() => track("phone_click", { from: "mobile_bar" })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-accent/60 text-sm font-semibold text-accent"
        >
          <Phone className="h-4 w-4" /> {t("contact.phoneLabel")}
        </a>
      </div>
    </div>
  );
};
