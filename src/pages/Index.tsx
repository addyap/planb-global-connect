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
    ];
  }, [t]);


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
