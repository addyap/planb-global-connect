import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

import { Hero } from "@/components/sections/Hero";
import { HomeSummary } from "@/components/sections/HomeSummary";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Area } from "@/components/sections/Area";
import { Contact } from "@/components/sections/Contact";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/contact";

const SITE = "https://www.planb-concept.com";

const Index = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
  }, [i18n.resolvedLanguage]);

  const jsonLd = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${SITE}/#localbusiness`,
        name: "Plan B Concept",
        description: t("hero.subtitle"),
        url: `${SITE}/`,
        image: `${SITE}/og-image.png`,
        telephone: CONTACT.phoneIntl,
        email: CONTACT.email,
        priceRange: "€€€",
        areaServed: [
          { "@type": "AdministrativeArea", name: "Var (83)" },
          { "@type": "AdministrativeArea", name: "Alpes-Maritimes (06)" },
          { "@type": "Place", name: "Côte d'Azur / French Riviera" },
        ],
        address: {
          "@type": "PostalAddress",
          addressRegion: "Provence-Alpes-Côte d'Azur",
          addressCountry: "FR",
        },
        founder: {
          "@type": "Person",
          name: CONTACT.name,
          jobTitle: "Project Manager & Construction Advisor",
          sameAs: [CONTACT.linkedin],
          knowsLanguage: ["en", "fr"],
        },
        sameAs: [CONTACT.linkedin],
        knowsLanguage: ["en", "fr"],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Services",
        itemListElement: [
          "Project Management",
          "Construction Coordination",
          "Client Support & Guidance",
          "Site Monitoring",
          "Problem Solving",
        ].map((name, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name,
            provider: { "@id": `${SITE}/#localbusiness` },
            areaServed: "Côte d'Azur, France",
          },
        })),
      },
    ],
    [t]
  );

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SEO
        title={`${t("hero.title")} | Plan B Concept — Côte d'Azur`}
        description={t("hero.subtitle")}
        path="/"
        jsonLd={jsonLd}
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
