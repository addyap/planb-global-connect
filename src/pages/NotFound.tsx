import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    // 404 hit; logged via analytics elsewhere if needed.
  }, [location.pathname]);

  const sections: { href: string; key: "home" | "about" | "services" | "area" | "questionnaire" | "contact" }[] = [
    { href: "/", key: "home" },
    { href: "/#about", key: "about" },
    { href: "/#services", key: "services" },
    { href: "/#area", key: "area" },
    { href: "/questionnaire", key: "questionnaire" },
    { href: "/#contact", key: "contact" },
  ];

  return (
    <div className="min-h-screen bg-background font-body text-foreground flex flex-col">
      {/* Title/description kept English: this is the canonical indexed copy and the page is noindex anyway. */}
      <SEO
        title="Page not found (404) | Plan B Concept"
        description="The page you are looking for does not exist. Explore Plan B Concept project management services on the French Riviera."
        path={location.pathname}
        noindex
      />
      <Header />
      <main id="main" className="flex-1 pt-32 md:pt-40 pb-20">
        <div className="container max-w-2xl text-center">
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase mb-4">{t("notFound.eyebrow")}</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            {t("notFound.heading")}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            {t("notFound.body")}
          </p>
          <nav aria-label={t("notFound.sectionsLabel")} className="grid sm:grid-cols-2 gap-3 text-left">
            {sections.map(({ href, key }) => (
              <Link
                key={href}
                to={href}
                className="block rounded-xl border border-border bg-card p-4 hover:border-accent transition-colors"
              >
                <span className="font-medium text-primary">{t(`notFound.${key}`)}</span>
              </Link>
            ))}
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
