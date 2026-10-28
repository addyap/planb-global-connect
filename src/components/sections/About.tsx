import { useTranslation } from "react-i18next";
import founderPhoto from "@/assets/plan-b-founder.webp";

export const About = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-20 md:py-28 bg-muted/40">
      <div className="container grid md:grid-cols-5 gap-12 items-start">
        <div className="min-w-0 md:col-span-3">
          <span className="font-display text-xs tracking-[0.25em] text-secondary uppercase mb-3 block">
            {t("about.title")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            {t("about.lead")}
          </h2>
          {/* On phones the portrait sits here, breaking up the text; on desktop it's in the side column. */}
          <img
            src={founderPhoto}
            alt="Anthony Gratton, founder of Plan B Concept"
            loading="lazy"
            width={886}
            height={1107}
            decoding="async"
            className="md:hidden w-full aspect-[4/3] object-cover object-[center_8%] rounded-2xl shadow-elegant mb-6"
          />
          <p className="text-lg text-foreground/80 mb-4 leading-relaxed">{t("about.p1")}</p>
          <p className="text-lg text-foreground/80 mb-4 leading-relaxed">{t("about.p2")}</p>
          <p className="text-lg text-foreground/80 mb-4 leading-relaxed">{t("about.p3")}</p>
          <p className="text-lg text-foreground/80 leading-relaxed">{t("about.p4")}</p>
        </div>
        <figure className="hidden md:block md:col-span-2 md:sticky md:top-28 bg-primary text-primary-foreground rounded-2xl p-6 shadow-elegant">
          <img
            src={founderPhoto}
            alt="Anthony Gratton, founder of Plan B Concept"
            loading="lazy"
            width={886}
            height={1107}
            decoding="async"
            className="w-full aspect-[4/5] object-cover rounded-xl"
          />
          <figcaption className="mt-5 px-1">
            <div className="font-display text-lg text-accent">Anthony Gratton</div>
            <div className="mt-1 text-sm text-primary-foreground/75">{t("footer.tagline")}</div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
