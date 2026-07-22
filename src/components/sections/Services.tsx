import { useTranslation } from "react-i18next";
import { HardHat, Users2, Compass, Eye, Lightbulb, Languages } from "lucide-react";

export const Services = () => {
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as { t: string; d: string; b: string }[];
  const icons = [Users2, HardHat, Compass, Lightbulb, Eye, Languages];
  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {t("services.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("services.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {items.map((s, i) => {
            const Icon = icons[i] ?? icons[0];
            const wide = false;
            return (
              <article
                key={i}
                className={`${wide ? "md:col-span-2" : ""} group relative p-7 md:p-8 rounded-2xl border border-border bg-card hover:border-accent/60 hover:shadow-elegant transition-all`}
              >
                <div className="flex items-start gap-5">
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-primary mb-2">{s.t}</h3>
                    <p className="text-foreground/75 leading-relaxed mb-3">{s.d}</p>
                    <p className="text-sm font-medium text-secondary">→ {s.b}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
