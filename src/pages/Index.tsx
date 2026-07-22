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
import en from "@/i18n/locales/en";

const SITE = "https://www.planb-concept.com";

const Index = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
  }, [i18n.resolvedLanguage]);

  const jsonLd = useMemo(() => {
    const services: { slug: string; name: string; description: string }[] = [
      {
        slug: "owners-representative",
        name: "Owner's Representative",
        description:
          "Acting on the client's behalf throughout the project, managing architects, contractors and suppliers. Especially valuable for owners based outside France.",
      },
      {
        slug: "villa-renovation",
        name: "Villa Renovation Management",
        description:
          "End-to-end coordination of villa renovations on the Côte d'Azur, from initial scoping through to final handover. Permits, planning, trades and snagging — all handled.",
      },
      {
        slug: "new-build-pm",
        name: "New Build Project Management",
        description:
          "Managing new construction projects from ground-breaking to occupation, with liaison across architects, structural engineers and the full trade chain.",
      },
      {
        slug: "construction-advisory",
        name: "Construction Advisory",
        description:
          "Independent technical advice before commitment: feasibility studies, quote analysis, contractor selection and second opinions on existing plans.",
      },
      {
        slug: "site-monitoring-qc",
        name: "Site Monitoring & Quality Control",
        description:
          "Regular site visits with detailed photographic reports, ensuring work meets specification and schedule. Issues are flagged early before they become expensive.",
      },
      {
        slug: "bilingual-client-liaison",
        name: "Bilingual Client Liaison",
        description:
          "Bridging the gap between English-speaking owners and French trades: translation of technical documents, contract review and on-site interpretation during critical meetings.",
      },
    ];

    const serviceNodes = services.map((s) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE}/#service-${s.slug}`,
      name: s.name,
      serviceType: s.name,
      provider: { "@id": `${SITE}/#organization` },
      areaServed: [
        { "@type": "AdministrativeArea", "name": "Var (83), France" },
        { "@type": "AdministrativeArea", "name": "Alpes-Maritimes (06), France" },
      ],
      description: s.description,
    }));

    return [
      ...serviceNodes,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: "en",
        // FAQ JSON-LD is always English (inLanguage: "en" above) so it's sourced from
        // en.ts directly rather than the active locale — keeps this in sync with the
        // canonical copy without depending on which language the visitor is viewing.
        mainEntity: en.faq.items.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ];
  }, []);


  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SEO
        title="Project Management Côte d'Azur | Plan B Concept"
        description="30+ years of on-the-ground experience. Fully bilingual English & French. Trusted guidance from first sketch to final handover."
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
