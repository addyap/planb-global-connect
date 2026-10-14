import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/contact";
// Served from /public with stable URLs so index.html can <link rel="preload" imagesrcset> them.
const heroBg = "/hero-riviera.webp";
const heroSrcSet = "/hero-riviera-800.webp 800w, /hero-riviera.webp 1600w";

export const Hero = () => {
  const { t } = useTranslation();
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;
  return (
    <section
      id="home"
      className="relative text-primary-foreground min-h-[88svh] flex items-center pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden"
    >
      {/* Background image */}
      <img
        src={heroBg}
        srcSet={heroSrcSet}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        width={1600}
        height={900}
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
        {/* Slide only, no fade: the headline is the LCP element and must paint at full opacity. */}
        <div className="max-w-4xl motion-safe:animate-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-700">
          <span className="inline-block font-display text-xs md:text-sm tracking-[0.3em] text-accent uppercase mb-5">
            {t("hero.eyebrow")}
          </span>
          <h1 className="font-display text-[1.75rem] min-[400px]:text-[2rem] sm:text-5xl md:text-6xl leading-[1.08] font-bold mb-5 hyphens-auto [overflow-wrap:anywhere] sm:[overflow-wrap:normal] text-balance drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {t("hero.title")}
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/90 max-w-2xl mb-8 leading-relaxed drop-shadow-md">
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
          <div className="mt-10 grid grid-cols-3 gap-3 md:gap-6 max-w-lg border-t border-accent/30 pt-6">
            <div>
              <div className="font-display text-lg sm:text-xl md:text-3xl font-bold text-accent whitespace-nowrap">30+</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mt-1">
                {t("hero.statYears")}
              </div>
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl md:text-3xl font-bold text-accent whitespace-nowrap">EN/FR</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mt-1">
                {t("hero.statBilingual")}
              </div>
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl md:text-3xl font-bold text-accent whitespace-nowrap">06 / 83</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mt-1">
                {t("hero.statRegion")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
