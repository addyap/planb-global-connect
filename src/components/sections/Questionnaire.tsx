import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type QuestionnaireValues = {
  fullName: string;
  email: string;
  phone: string;
  projectLocation: string;
  projectType: string;
  propertyStatus: string;
  budget: string;
  timeline: string;
  services: string[];
  siteVisit: string;
  brief: string;
};

const fieldClassName =
  "mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const Questionnaire = () => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().trim().min(2, t("questionnaire.validation.name")).max(100),
        email: z.string().trim().email(t("questionnaire.validation.email")).max(255),
        phone: z.string().trim().min(6, t("questionnaire.validation.phone")).max(30),
        projectLocation: z.string().trim().min(2, t("questionnaire.validation.location")).max(120),
        projectType: z.string().trim().min(1, t("questionnaire.validation.projectType")),
        propertyStatus: z.string().trim().min(1, t("questionnaire.validation.propertyStatus")),
        budget: z.string().trim().min(1, t("questionnaire.validation.budget")),
        timeline: z.string().trim().min(1, t("questionnaire.validation.timeline")),
        services: z.array(z.string()).min(1, t("questionnaire.validation.services")),
        siteVisit: z.string().trim().min(1, t("questionnaire.validation.siteVisit")),
        brief: z.string().trim().min(20, t("questionnaire.validation.brief")).max(2000),
      }),
    [t],
  );

  const serviceOptions = t("questionnaire.serviceOptions", { returnObjects: true }) as string[];
  const projectTypeOptions = t("questionnaire.projectTypeOptions", { returnObjects: true }) as string[];
  const propertyStatusOptions = t("questionnaire.propertyStatusOptions", { returnObjects: true }) as string[];
  const budgetOptions = t("questionnaire.budgetOptions", { returnObjects: true }) as string[];
  const timelineOptions = t("questionnaire.timelineOptions", { returnObjects: true }) as string[];
  const siteVisitOptions = t("questionnaire.siteVisitOptions", { returnObjects: true }) as string[];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuestionnaireValues>({
    resolver: zodResolver(schema),
    defaultValues: { services: [] },
  });

  const onSubmit = async (values: QuestionnaireValues) => {
    const lines = [
      `${t("questionnaire.fields.fullName")}: ${values.fullName}`,
      `${t("questionnaire.fields.email")}: ${values.email}`,
      `${t("questionnaire.fields.phone")}: ${values.phone}`,
      `${t("questionnaire.fields.projectLocation")}: ${values.projectLocation}`,
      `${t("questionnaire.fields.projectType")}: ${values.projectType}`,
      `${t("questionnaire.fields.propertyStatus")}: ${values.propertyStatus}`,
      `${t("questionnaire.fields.budget")}: ${values.budget}`,
      `${t("questionnaire.fields.timeline")}: ${values.timeline}`,
      `${t("questionnaire.fields.services")}: ${values.services.join(", ")}`,
      `${t("questionnaire.fields.siteVisit")}: ${values.siteVisit}`,
      "",
      `${t("questionnaire.fields.brief")}:`,
      values.brief,
    ];

    const { error } = await supabase.from("form_submissions").insert({
      form_type: "questionnaire",
      name: values.fullName,
      email: values.email,
      phone: values.phone,
      message: values.brief,
      payload: values as unknown as Record<string, unknown>,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });

    if (error) {
      toast.error(t("questionnaire.error", { defaultValue: "Could not submit. Opening your email app as a fallback." }));
      const subject = encodeURIComponent(t("questionnaire.emailSubject"));
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
      return;
    }

    toast.success(t("questionnaire.success"));
  };

  const errorFor = (message?: string) =>
    message ? <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p> : null;

  return (
    <section id="questionnaire" className="py-20 md:py-28">
      <div className="container grid gap-10 lg:grid-cols-[1.1fr_1.4fr] lg:items-start">
        <div className="max-w-xl">
          <span className="mb-3 block font-display text-xs uppercase tracking-[0.25em] text-secondary">
            {t("questionnaire.title")}
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight text-primary md:text-5xl">
            {t("questionnaire.heading")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/80">{t("questionnaire.intro")}</p>

          <div className="mt-8 space-y-4">
            {(t("questionnaire.highlights", { returnObjects: true }) as string[]).map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <p className="text-sm leading-6 text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-6 shadow-elegant md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">{t("questionnaire.fields.fullName")}</Label>
              <Input id="fullName" className="mt-1.5" {...register("fullName")} />
              {errorFor(errors.fullName?.message)}
            </div>
            <div>
              <Label htmlFor="email">{t("questionnaire.fields.email")}</Label>
              <Input id="email" type="email" className="mt-1.5" {...register("email")} />
              {errorFor(errors.email?.message)}
            </div>
            <div>
              <Label htmlFor="phone">{t("questionnaire.fields.phone")}</Label>
              <Input id="phone" type="tel" className="mt-1.5" {...register("phone")} />
              {errorFor(errors.phone?.message)}
            </div>
            <div>
              <Label htmlFor="projectLocation">{t("questionnaire.fields.projectLocation")}</Label>
              <Input id="projectLocation" className="mt-1.5" {...register("projectLocation")} />
              {errorFor(errors.projectLocation?.message)}
            </div>
            <div>
              <Label htmlFor="projectType">{t("questionnaire.fields.projectType")}</Label>
              <select id="projectType" className={fieldClassName} defaultValue="" {...register("projectType")}>
                <option value="" disabled>
                  {t("questionnaire.placeholders.select")}
                </option>
                {projectTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errorFor(errors.projectType?.message)}
            </div>
            <div>
              <Label htmlFor="propertyStatus">{t("questionnaire.fields.propertyStatus")}</Label>
              <select id="propertyStatus" className={fieldClassName} defaultValue="" {...register("propertyStatus")}>
                <option value="" disabled>
                  {t("questionnaire.placeholders.select")}
                </option>
                {propertyStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errorFor(errors.propertyStatus?.message)}
            </div>
            <div>
              <Label htmlFor="budget">{t("questionnaire.fields.budget")}</Label>
              <select id="budget" className={fieldClassName} defaultValue="" {...register("budget")}>
                <option value="" disabled>
                  {t("questionnaire.placeholders.select")}
                </option>
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errorFor(errors.budget?.message)}
            </div>
            <div>
              <Label htmlFor="timeline">{t("questionnaire.fields.timeline")}</Label>
              <select id="timeline" className={fieldClassName} defaultValue="" {...register("timeline")}>
                <option value="" disabled>
                  {t("questionnaire.placeholders.select")}
                </option>
                {timelineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errorFor(errors.timeline?.message)}
            </div>
          </div>

          <div className="mt-6">
            <Label>{t("questionnaire.fields.services")}</Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {serviceOptions.map((option) => (
                <label key={option} className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground/90 transition-colors hover:border-primary">
                  <input
                    type="checkbox"
                    value={option}
                    className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    {...register("services")}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errorFor(errors.services?.message)}
          </div>

          <div className="mt-6">
            <Label>{t("questionnaire.fields.siteVisit")}</Label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {siteVisitOptions.map((option) => (
                <label key={option} className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground/90 transition-colors hover:border-primary">
                  <input type="radio" value={option} className="h-4 w-4 border-input text-primary focus:ring-ring" {...register("siteVisit")} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errorFor(errors.siteVisit?.message)}
          </div>

          <div className="mt-6">
            <Label htmlFor="brief">{t("questionnaire.fields.brief")}</Label>
            <Textarea
              id="brief"
              rows={6}
              className="mt-1.5"
              placeholder={t("questionnaire.placeholders.brief")}
              {...register("brief")}
            />
            {errorFor(errors.brief?.message)}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{t("questionnaire.note")}</p>
            <Button type="submit" size="lg" disabled={isSubmitting} className={cn("w-full sm:w-auto", "bg-primary text-primary-foreground hover:bg-primary/90")}>
              <Send className="h-4 w-4" />
              <span>{t("questionnaire.submit")}</span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};