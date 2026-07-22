import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export const LegalPlaceholder = ({ children }: { children: string }) => (
  <span className="text-amber-800 font-medium italic">{children}</span>
);

type LegalPageLayoutProps = {
  seoTitle: string;
  seoDescription: string;
  path: string;
  heading: ReactNode;
  lastUpdated: string;
  children: ReactNode;
};

export const LegalPageLayout = ({ seoTitle, seoDescription, path, heading, lastUpdated, children }: LegalPageLayoutProps) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // These pages are French-only by design (a French legal requirement); visitors
  // browsing in any other language get a translated notice pointing them back home.
  const showFrenchOnlyNotice = i18n.resolvedLanguage !== "fr";

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SEO title={seoTitle} description={seoDescription} path={path} htmlLang="fr" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" className="pt-28 md:pt-36">
        <div className="container max-w-3xl mx-auto py-16 px-6">
          {showFrenchOnlyNotice && (
            <div className="mb-8 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground/90">
              {t("legal.frenchOnlyNotice")}{" "}
              <Link to="/" className="text-accent underline hover:no-underline">
                {t("nav.home")}
              </Link>
            </div>
          )}
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-4">{heading}</h1>
          <p className="text-sm text-muted-foreground mb-12">Dernière mise à jour : {lastUpdated}</p>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
