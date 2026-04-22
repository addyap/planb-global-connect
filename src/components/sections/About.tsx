import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import founderPhoto from "@/assets/plan-b-founder.jpg";

export const About = () => {
  const { t } = useTranslation();
  const expertise = t("about.expertise", { returnObjects: true }) as string[];
  return (
    <section id="about" className="py-20 md:py-28 bg-muted/40">
      <div className="container grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-3">
          <span className="font-display text-xs tracking-[0.25em] text-secondary uppercase mb-3 block">
            {t("about.title")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            {t("about.lead")}
          </h2>
          <p className="text-lg text-foreground/80 mb-4 leading-relaxed">{t("about.p1")}</p>
          <p className="text-lg text-foreground/80 leading-relaxed">{t("about.p2")}</p>
        </div>
        <div className="md:col-span-2 bg-primary text-primary-foreground rounded-2xl p-8 shadow-elegant">
          <img
            src={founderPhoto}
            alt="Founder of Plan B Côte d’Azur – Project Management expert"
            loading="lazy"
            width={770}
            height={965}
            className="w-full aspect-[4/5] object-cover rounded-xl mb-6"
          />
          <h3 className="font-display text-accent text-lg mb-5">{t("about.expertiseTitle")}</h3>
          <ul className="space-y-3">
            {expertise.map((e, i) => (
              <li key={i} className="flex gap-3 items-start">
                <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <span className="text-primary-foreground/90">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
