import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export const Hero = () => {
  const { t } = useTranslation();
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;
  return (
    <section id="home" className="relative bg-hero text-primary-foreground pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
           style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--accent)) 0 2px, transparent 2px 14px)" }} />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
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
      </div>
    </section>
  );
};
