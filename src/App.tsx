import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SEO } from "@/components/SEO";
import Index from "./pages/Index.tsx";
import QuestionnairePage from "./pages/QuestionnairePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// Client-side redirect routes: emit noindex so crawlers don't index the SPA shell
// served at /about, /services, /area, /contact before the Navigate fires.
const RedirectToHash = ({ hash }: { hash: string }) => (
  <>
    <SEO
      title="Plan B Concept — Côte d'Azur"
      description="Redirecting to Plan B Concept."
      path={`/${hash}`}
      noindex
    />
    <Navigate to={`/#${hash}`} replace />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<RedirectToHash hash="about" />} />
          <Route path="/services" element={<RedirectToHash hash="services" />} />
          <Route path="/area" element={<RedirectToHash hash="area" />} />
          <Route path="/contact" element={<RedirectToHash hash="contact" />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
