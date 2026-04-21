import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

export const Area = () => {
  const { t } = useTranslation();
  const depts = t("area.depts", { returnObjects: true }) as { code: string; name: string }[];
  return (
    <section id="area" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--accent)) 0 2px, transparent 2px 16px)" }}
      />
      <div className="container relative grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="font-display text-xs tracking-[0.25em] text-accent uppercase mb-3 block">
            {t("area.title")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 leading-tight">{t("area.title")}</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">{t("area.subtitle")}</p>
          <div className="space-y-3">
            {depts.map((d) => (
              <div key={d.code} className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/5 border border-accent/20">
                <span className="font-display text-2xl text-accent font-bold">{d.code}</span>
                <span className="font-display text-lg">{d.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-primary-foreground/60 mt-6 italic">{t("area.note")}</p>
        </div>

        {/* Stylized map */}
        <div className="relative aspect-square max-w-md mx-auto md:mx-0 md:ml-auto">
          <svg viewBox="0 0 400 400" className="w-full h-full" aria-label="French Riviera map">
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="hsl(var(--secondary))" strokeWidth="3" />
              </pattern>
            </defs>
            {/* Mediterranean */}
            <rect x="0" y="260" width="400" height="140" fill="hsl(var(--accent) / 0.1)" />
            {/* Var */}
            <path
              d="M 50 140 L 200 110 L 230 200 L 210 280 L 80 270 Z"
              fill="url(#hatch)"
              stroke="hsl(var(--accent))"
              strokeWidth="2.5"
            />
            <text x="130" y="210" fill="hsl(var(--accent))" fontFamily="Orbitron" fontSize="22" fontWeight="700" textAnchor="middle">83</text>
            <text x="130" y="232" fill="hsl(var(--primary-foreground))" fontFamily="Inter" fontSize="12" textAnchor="middle">Var</text>
            {/* Alpes-Maritimes */}
            <path
              d="M 200 110 L 360 120 L 345 250 L 230 270 L 210 200 Z"
              fill="url(#hatch)"
              stroke="hsl(var(--accent))"
              strokeWidth="2.5"
            />
            <text x="290" y="195" fill="hsl(var(--accent))" fontFamily="Orbitron" fontSize="22" fontWeight="700" textAnchor="middle">06</text>
            <text x="290" y="217" fill="hsl(var(--primary-foreground))" fontFamily="Inter" fontSize="12" textAnchor="middle">Alpes-Maritimes</text>
            {/* Cities */}
            <circle cx="150" cy="255" r="5" fill="hsl(var(--accent))" />
            <text x="150" y="245" fill="hsl(var(--primary-foreground))" fontSize="10" textAnchor="middle">Toulon</text>
            <circle cx="260" cy="260" r="5" fill="hsl(var(--accent))" />
            <text x="260" y="250" fill="hsl(var(--primary-foreground))" fontSize="10" textAnchor="middle">Cannes</text>
            <circle cx="320" cy="245" r="6" fill="hsl(var(--accent))" />
            <text x="320" y="235" fill="hsl(var(--primary-foreground))" fontSize="10" textAnchor="middle">Nice</text>
            <circle cx="355" cy="225" r="5" fill="hsl(var(--accent))" />
            <text x="358" y="215" fill="hsl(var(--primary-foreground))" fontSize="10" textAnchor="start">Monaco</text>
          </svg>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-accent font-display tracking-widest">
            <MapPin className="h-4 w-4" /> CÔTE D'AZUR
          </div>
        </div>
      </div>
    </section>
  );
};
