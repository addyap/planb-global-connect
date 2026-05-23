import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // 404 hit; logged via analytics elsewhere if needed.
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background font-body text-foreground flex flex-col">
      <SEO
        title="Page not found (404) | Plan B Concept"
        description="The page you are looking for does not exist. Explore Plan B Concept project management services on the French Riviera."
        path={location.pathname}
        noindex
      />
      <Header />
      <main id="main" className="flex-1 pt-32 md:pt-40 pb-20">
        <div className="container max-w-2xl text-center">
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase mb-4">Error 404</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            This page could not be found
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            The link may be broken or the page may have moved. Below are the main sections of Plan B Concept — bilingual project management and construction advisory on the French Riviera.
          </p>
          <nav aria-label="Site sections" className="grid sm:grid-cols-2 gap-3 text-left">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Anthony Gratton" },
              { href: "/services", label: "What we do — services" },
              { href: "/area", label: "Areas covered — Var & Alpes-Maritimes" },
              { href: "/questionnaire", label: "Project questionnaire" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block rounded-xl border border-border bg-card p-4 hover:border-accent transition-colors"
              >
                <span className="font-medium text-primary">{l.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
