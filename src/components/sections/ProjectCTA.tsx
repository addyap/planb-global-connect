import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";
import { track } from "@/lib/track";

/** Mid-page conversion point right after the services, so readers don't have to scroll to the end to act. */
export const ProjectCTA = () => {
  const { t } = useTranslation();
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;
  return (
    <section aria-labelledby="project-cta-title" className="bg-primary text-primary-foreground">
      <div className="container flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-2xl">
          <h2 id="project-cta-title" className="font-display text-2xl font-bold leading-tight text-accent md:text-3xl">
            {t("questionnaire.heading")}
          </h2>
          <p className="mt-3 leading-relaxed text-primary-foreground/85">{t("questionnaire.intro")}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-accent font-semibold text-accent-foreground shadow-gold hover:bg-accent/90">
            <Link to="/questionnaire">
              {t("questionnaire.title")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-accent/70 bg-transparent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { from: "mid_page" })}>
              <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
