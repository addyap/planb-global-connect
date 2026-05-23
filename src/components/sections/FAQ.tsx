import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ = () => {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true }) as { q: string; a: string }[];
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container max-w-3xl">
        <div className="mb-12 text-center">
          <span className="font-display text-xs tracking-[0.25em] text-secondary uppercase mb-3 block">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {t("faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("faq.subtitle")}</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-display text-base md:text-lg font-semibold text-primary hover:no-underline py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/75 leading-relaxed text-base pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
