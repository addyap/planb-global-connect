import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, ChevronDown } from "lucide-react";

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("cta.changeLanguage")}
        // Deliberately quieter than the gold WhatsApp button: the CTA should be the one thing that pops.
        className="flex min-h-10 items-center gap-1.5 rounded-full border border-accent/50 bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Globe className="h-4 w-4" />
        <span>{current.label}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem] p-1">
        {LANGUAGES.map((lng) => {
          const active = i18n.resolvedLanguage === lng.code;
          return (
            <DropdownMenuItem
              key={lng.code}
              onClick={() => i18n.changeLanguage(lng.code)}
              className={`flex items-center gap-3 cursor-pointer rounded-sm py-2 ${active ? "bg-accent/15" : ""}`}
            >
              <span className="w-9 text-[11px] font-bold uppercase tracking-wider text-accent">{lng.label}</span>
              <span className="flex-1 text-sm">{lng.name}</span>
              {active && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
