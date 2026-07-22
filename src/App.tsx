import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";

// Keep the homepage synchronous so the LCP route has zero extra waterfall.
// All other routes are code-split: react-hook-form + zod ship only with the questionnaire chunk.
const QuestionnairePage = lazy(() => import("./pages/QuestionnairePage.tsx"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales.tsx"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite.tsx"));
const CGU = lazy(() => import("./pages/CGU.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div
      className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin"
      role="status"
      aria-label="Loading"
    />
  </div>
);

const App = () => (
  <TooltipProvider>
    <Sonner />
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/cgu" element={<CGU />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
