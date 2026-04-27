import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Questionnaire } from "@/components/sections/Questionnaire";

const QuestionnairePage = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
    document.title = `Plan B Concept — ${t("nav.questionnaire")}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("questionnaire.intro"));
    window.scrollTo({ top: 0 });
  }, [i18n.resolvedLanguage, t]);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="pt-28 md:pt-36">
        <Questionnaire />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default QuestionnairePage;
