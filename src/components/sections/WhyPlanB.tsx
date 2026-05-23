import { useTranslation } from "react-i18next";
import { Languages, History, Shield } from "lucide-react";

export const WhyPlanB = () => {
  const { t } = useTranslation();
  const items = t("whyPlanB.items", { returnObjects: true }) as { t: string; d: string }[];
  const icons = [Languages, History, Shield];
  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mb-10 text-center leading-tight">
          {t("whyPlanB.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((w, i) => {
            const Icon = icons[i] ?? Shield;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-2xl border border-border bg-card hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-gold flex items-center justify-center mb-5 shadow-gold">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-2">{w.t}</h3>
                <p className="text-foreground/75 leading-relaxed">{w.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
