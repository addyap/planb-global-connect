import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { supabase } from "@/integrations/supabase/client";
import linkedInQr from "@/assets/anthony-gratton-linkedin-qr.jpg";

export const Contact = () => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;
  const mailtoSubject = "Plan B Concept — Project inquiry";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const message = String(fd.get("message") ?? "");

    const { error } = await supabase.from("form_submissions").insert([{
      form_type: "contact",
      name,
      email,
      phone,
      message,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    }]);

    setSubmitting(false);

    if (error) {
      toast.error(t("contact.error", { defaultValue: "Could not send your message. Please try again or email us directly." }));
      const body = `${name}\n${email}\n${phone}\n\n${message}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setSent(true);
    toast.success(t("contact.sent"));
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-muted/40">
      <div className="container grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <span className="font-display text-xs tracking-[0.25em] text-secondary uppercase mb-3 block">
            {t("contact.title")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mb-5 leading-tight">
            {t("cta.discuss")}
          </h2>

          <div className="space-y-3">
            <a href={`tel:${CONTACT.phoneIntl}`} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent transition-colors">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center"><Phone className="h-4 w-4 text-accent" /></div>
              <div>
                <div className="text-xs text-muted-foreground">{t("contact.phoneLabel")}</div>
                <div className="font-medium text-foreground">{CONTACT.phoneDisplay}</div>
              </div>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent transition-colors">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center"><Mail className="h-4 w-4 text-accent" /></div>
              <div>
                <div className="text-xs text-muted-foreground">{t("contact.emailLabel")}</div>
                <div className="font-medium text-foreground break-all">{CONTACT.email}</div>
              </div>
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent transition-colors">
              <div className="h-10 w-10 rounded-lg bg-[#25D366] flex items-center justify-center"><MessageCircle className="h-4 w-4 text-white" /></div>
              <div>
                <div className="text-xs text-muted-foreground">{t("contact.whatsappLabel")}</div>
                <div className="font-medium text-foreground">{CONTACT.phoneDisplay}</div>
              </div>
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent transition-colors">
              <div className="h-10 w-10 rounded-lg bg-[#0A66C2] flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">LinkedIn</div>
                <div className="font-medium text-foreground">Anthony Gratton</div>
              </div>
              <img
                src={linkedInQr}
                alt="LinkedIn QR code for Anthony Gratton"
                loading="lazy"
                className="ml-auto h-14 w-14 shrink-0 rounded-md border border-border bg-background p-1 object-contain"
              />
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 bg-card rounded-2xl p-6 md:p-8 border border-border shadow-elegant space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t("contact.name")}</Label>
              <Input id="name" name="name" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">{t("contact.email")}</Label>
              <Input id="email" name="email" type="email" required className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">{t("contact.phone")}</Label>
            <Input id="phone" name="phone" type="tel" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">{t("contact.message")}</Label>
            <Textarea id="message" name="message" required rows={5} className="mt-1.5" />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
            {submitting ? "…" : t("contact.send")}
          </Button>
          {sent && <p className="text-sm text-secondary">{t("contact.sent")}</p>}
        </form>
      </div>
    </section>
  );
};
