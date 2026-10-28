import { useTranslation } from "react-i18next";

/** Four-step "how it works" strip: answers "what happens if I get in touch?" right before the project CTA. */
export const Process = () => {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as { t: string; d: string }[];
  return (
    <section id="process" aria-labelledby="process-title" className="py-20 md:py-24 bg-muted/40">
      <div className="container">
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="font-display text-xs tracking-[0.25em] text-secondary uppercase mb-3 block">
            {t("process.eyebrow")}
          </span>
          <h2 id="process-title" className="font-display text-3xl md:text-5xl font-bold text-primary leading-tight">
            {t("process.title")}
          </h2>
        </div>

        <div className="relative">
          {/* Connector line behind the numbers (desktop only) */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-accent/60 via-accent/40 to-transparent md:block" />
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((step, i) => (
              <li key={i} className="relative flex gap-5 md:block">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-accent md:mb-6">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-primary mb-2">{step.t}</h3>
                  <p className="text-foreground/75 leading-relaxed">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
