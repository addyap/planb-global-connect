import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import heroBg from "@/assets/hero-riviera.jpg";

export const Hero = () => {
  const { t } = useTranslation();
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;
  return (
    <section
      id="home"
      className="relative text-primary-foreground min-h-[100svh] flex items-center pt-28 md:pt-32 pb-20 md:pb-28 overflow-hidden"
    >
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        loading="eager"
        decoding="async"
        // @ts-expect-error fetchpriority is a valid HTML attribute
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Layered overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--accent)) 0 2px, transparent 2px 14px)" }}
      />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="inline-block font-display text-xs md:text-sm tracking-[0.3em] text-accent uppercase mb-6">
            {t("hero.eyebrow")}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.02] font-bold mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mb-10 leading-relaxed drop-shadow-md">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-gold"
            >
              {t("cta.contact")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-accent/70 bg-background/10 backdrop-blur-sm text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 h-4 w-4" /> {t("cta.whatsapp")}
              </a>
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg border-t border-accent/30 pt-6">
            <div>
              <div className="font-display text-2xl md:text-3xl font-bold text-accent">30+</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mt-1">
                {t("hero.statYears", { defaultValue: "Years experience" })}
              </div>
            </div>
            <div>
              <div className="font-display text-2xl md:text-3xl font-bold text-accent">EN/FR</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mt-1">
                {t("hero.statBilingual", { defaultValue: "Bilingual" })}
              </div>
            </div>
            <div>
              <div className="font-display text-2xl md:text-3xl font-bold text-accent">06 / 83</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mt-1">
                {t("hero.statRegion", { defaultValue: "Côte d'Azur" })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
