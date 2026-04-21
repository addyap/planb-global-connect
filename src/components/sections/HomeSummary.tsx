import { useTranslation } from "react-i18next";
import { Briefcase, Users, MapPin, Shield } from "lucide-react";

export const HomeSummary = () => {
  const { t } = useTranslation();
  const why = t("home.why", { returnObjects: true }) as { t: string; d: string }[];
  const icons = [Users, MapPin, Shield, Briefcase];
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container grid md:grid-cols-2 gap-10 md:gap-16 mb-20">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">{t("home.whatTitle")}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t("home.whatText")}</p>
        </div>
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">{t("home.aboutTitle")}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t("home.aboutText")}</p>
        </div>
      </div>

      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-10 text-center">
          {t("home.whyTitle")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {why.map((w, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="group relative p-6 rounded-xl border border-border bg-card hover:shadow-elegant hover:-translate-y-1 transition-all">
                <div className="h-11 w-11 rounded-lg bg-gold flex items-center justify-center mb-4 shadow-gold">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-primary mb-2">{w.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
