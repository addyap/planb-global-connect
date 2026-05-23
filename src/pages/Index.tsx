import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

import { Hero } from "@/components/sections/Hero";
import { HomeSummary } from "@/components/sections/HomeSummary";
import { About } from "@/components/sections/About";
import { WhyPlanB } from "@/components/sections/WhyPlanB";
import { Services } from "@/components/sections/Services";
import { FAQ } from "@/components/sections/FAQ";
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
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { q: "What does an owner's representative actually do?", a: "An owner's representative manages your construction or renovation project on your behalf, dealing with architects, contractors, and authorities so you don't have to. They protect your interests, monitor quality and schedule, and translate the technical and administrative complexity into clear updates you can act on." },
          { q: "Do I still need an architect if I hire Plan B Concept?", a: "Yes. An architect designs the project; Plan B Concept manages it. The two roles are complementary. We work alongside your architect (or help you select one) to make sure the design is delivered on the ground as intended." },
          { q: "How does this differ from a maître d'œuvre?", a: "A maître d'œuvre typically represents the design and execution of the works themselves. An owner's representative — maître d'ouvrage délégué — represents you, the client. The distinction matters when interests diverge." },
          { q: "Do you work outside Var and Alpes-Maritimes?", a: "Occasionally, for existing clients. The standard service area is the French Riviera from Saint-Tropez to Menton, including Monaco." },
          { q: "How are fees structured?", a: "Either a percentage of project value or a fixed monthly retainer, depending on project scale and duration. Quoted transparently after an initial conversation." },
          { q: "Can you take on a project that's already underway?", a: "Yes. Mid-project rescues are common — often when communication between client and contractors has broken down, or quality issues have emerged. An independent review can usually be arranged within a week." },
        ].map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
    [t]
  );

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SEO
        title="Project Management Côte d'Azur | Plan B Concept"
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
        <WhyPlanB />
        <Services />
        <FAQ />
        <Area />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
