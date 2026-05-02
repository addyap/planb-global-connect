import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

import { Hero } from "@/components/sections/Hero";
import { HomeSummary } from "@/components/sections/HomeSummary";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
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
      <SEO
        title={`${t("hero.title")} | Plan B Concept`}
        description={t("hero.subtitle")}
        path="/"
      />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <HomeSummary />
        <About />
        <Services />
        <Area />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
