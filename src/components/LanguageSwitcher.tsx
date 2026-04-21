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
  const { i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change language"
        className="flex items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{current.label}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-80" />
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
