import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { MessageCircle, Phone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";

type FormSuccessProps = {
  variant: "contact" | "questionnaire";
  name: string;
  email: string;
  onReset: () => void;
  className?: string;
};

/** Replaces a form once it has been sent: animated check, thank-you message and direct contact options. */
export const FormSuccess = ({ variant, name, email, onReset, className = "" }: FormSuccessProps) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;

  // Bring the panel into view and move focus to it, so keyboard and screen-reader users
  // land on the confirmation instead of where the (now removed) submit button was.
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    heading.closest("[data-form-success]")?.scrollIntoView?.({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reduceMotion]);

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay } };

  return (
    <div
      data-form-success
      role="status"
      className={`scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant ${className}`}
    >
      <div className="relative flex justify-center overflow-hidden bg-hero px-6 pb-10 pt-12">
        {/* Decorative rings echoing the gold circle */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="absolute h-56 w-56 rounded-full border border-accent/10" />
          <div className="absolute h-40 w-40 rounded-full border border-accent/20" />
        </div>
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 96 96"
          className="relative h-24 w-24 drop-shadow-[0_10px_30px_hsl(45_78%_58%/0.35)]"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <defs>
            <linearGradient id="form-success-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(45 85% 65%)" />
              <stop offset="100%" stopColor="hsl(38 70% 45%)" />
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r="44" fill="url(#form-success-gold)" />
          <motion.path
            d="M30 49.5 L43 62 L67 36"
            fill="none"
            stroke="hsl(0 55% 10%)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          />
        </motion.svg>
      </div>

      <div className="px-6 pb-8 pt-8 text-center md:px-10 md:pb-10">
        <motion.div {...fade(0.2)}>
          <span className="mb-3 block font-display text-xs uppercase tracking-[0.25em] text-secondary">
            {t(variant === "questionnaire" ? "formSuccess.eyebrowQuestionnaire" : "formSuccess.eyebrowContact")}
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl font-bold leading-tight text-primary outline-none md:text-3xl"
          >
            {name.trim() ? t("formSuccess.title", { name: name.trim() }) : t("formSuccess.titleNoName")}
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-foreground/80">
            {t(variant === "questionnaire" ? "formSuccess.bodyQuestionnaire" : "formSuccess.bodyContact")}
          </p>
        </motion.div>

        {email && (
          <motion.div {...fade(0.35)} className="mx-auto mt-6 max-w-md rounded-xl bg-muted px-5 py-4 text-sm text-foreground/80">
            <p>
              <Trans
                i18nKey="formSuccess.emailNote"
                values={{ email }}
                components={{ bold: <strong className="font-semibold text-primary [overflow-wrap:anywhere]" /> }}
              />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("formSuccess.spamNote")}</p>
          </motion.div>
        )}

        <motion.div {...fade(0.5)} className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">{t("formSuccess.urgent")}</p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={`tel:${CONTACT.phoneIntl}`}>
                <Phone className="h-4 w-4" />
                {t("formSuccess.call")} · {CONTACT.phoneDisplay}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                {t("contact.whatsappLabel")}
              </a>
            </Button>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("formSuccess.sendAnother")}
          </button>
        </motion.div>
      </div>
    </div>
  );
};
