/** "smooth" unless the visitor has asked their system to reduce motion. */
export const scrollBehavior = (): ScrollBehavior =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

export const scrollToSection = (id: string) => {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
};
