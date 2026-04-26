import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Hero } from "@/components/sections/Hero";
import { HomeSummary } from "@/components/sections/HomeSummary";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Questionnaire } from "@/components/sections/Questionnaire";
import { Area } from "@/components/sections/Area";
import { Contact } from "@/components/sections/Contact";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
    document.title = `Plan B Concept — ${t("hero.title")}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("hero.subtitle"));
  }, [i18n.resolvedLanguage, t]);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header />
      <main>
        <Hero />
        <HomeSummary />
        <About />
        <Services />
        <Area />
        <Questionnaire />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
