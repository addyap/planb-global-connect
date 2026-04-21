import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import heroVilla from "@/assets/hero-villa.jpg";

export const Hero = () => {
  const { t } = useTranslation();
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;
  return (
    <section id="home" className="relative bg-hero text-primary-foreground pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
           style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--accent)) 0 2px, transparent 2px 14px)" }} />
      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <span className="inline-block font-display text-xs md:text-sm tracking-[0.25em] text-accent uppercase mb-6">
              {t("hero.eyebrow")}
            </span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] font-bold mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10 leading-relaxed">
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
              <Button asChild size="lg" variant="outline" className="border-accent/60 bg-transparent text-accent hover:bg-accent hover:text-accent-foreground">
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1 h-4 w-4" /> {t("cta.whatsapp")}
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
              {/* Decorative gold frame offset */}
              <div className="absolute -inset-3 border border-accent/40 rounded-sm translate-x-3 translate-y-3 pointer-events-none" />
              <div className="absolute -inset-3 bg-accent/10 rounded-sm -translate-x-2 -translate-y-2 pointer-events-none" />
              <div className="relative h-full w-full overflow-hidden rounded-sm shadow-gold ring-1 ring-accent/30">
                <img
                  src={heroVilla}
                  alt={t("hero.imageAlt", { defaultValue: "Luxury Mediterranean villa project on the French Riviera" })}
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 via-primary/10 to-transparent mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/40" />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-4 py-3 rounded-sm shadow-gold hidden sm:block">
                <div className="font-display text-2xl font-bold leading-none">30+</div>
                <div className="text-[10px] tracking-[0.2em] uppercase mt-1">{t("hero.badgeYears", { defaultValue: "Years experience" })}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
