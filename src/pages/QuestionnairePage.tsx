import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Questionnaire } from "@/components/sections/Questionnaire";

const QuestionnairePage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SEO
        title={`${t("nav.questionnaire")} | Plan B Concept`}
        description={t("questionnaire.intro")}
        path="/questionnaire"
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
