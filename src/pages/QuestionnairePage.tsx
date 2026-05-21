import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Questionnaire } from "@/components/sections/Questionnaire";

const SITE = "https://www.planb-concept.com";

const QuestionnairePage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: t("nav.questionnaire"),
          item: `${SITE}/questionnaire`,
        },
      ],
    }),
    [t]
  );

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SEO
        title={`${t("nav.questionnaire")} — Project Brief | Plan B Concept`}
        description={t("questionnaire.intro")}
        path="/questionnaire"
        jsonLd={jsonLd}
      />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>
      <Header />
      <main id="main" className="pt-28 md:pt-36">
        <Questionnaire />
      </main>
      <Footer />
    </div>
  );
};

export default QuestionnairePage;
