import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, Mail, MessageCircle, Linkedin } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export const Contact = () => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("contact.whatsappPrefill"))}`;
  const mailtoSubject = "Plan B Concept — Project inquiry";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = `${fd.get("name")}\n${fd.get("email")}\n${fd.get("phone")}\n\n${fd.get("message")}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    toast.success(t("contact.sent"));
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
              <div className="h-10 w-10 rounded-lg bg-[#0A66C2] flex items-center justify-center"><Linkedin className="h-4 w-4 text-white" /></div>
              <div>
                <div className="text-xs text-muted-foreground">LinkedIn</div>
                <div className="font-medium text-foreground">Anthony Gratton</div>
              </div>
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
          <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
            {t("contact.send")}
          </Button>
          {sent && <p className="text-sm text-secondary">{t("contact.sent")}</p>}
        </form>
      </div>
    </section>
  );
};
