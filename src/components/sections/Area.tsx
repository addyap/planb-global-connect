import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Plane, Anchor } from "lucide-react";

export const Area = () => {
  const { t } = useTranslation();
  const depts = t("area.depts", { returnObjects: true }) as { code: string; name: string }[];

  const cities = [
    { name: "Toulon", x: 130, y: 295, size: 4 },
    { name: "Hyères", x: 175, y: 305, size: 3 },
    { name: "Saint-Tropez", x: 230, y: 285, size: 4 },
    { name: "Cannes", x: 295, y: 265, size: 5 },
    { name: "Antibes", x: 320, y: 260, size: 4 },
    { name: "Nice", x: 355, y: 240, size: 6, primary: true },
    { name: "Monaco", x: 395, y: 220, size: 5 },
  ];

  return (
    <section id="area" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--accent)) 0 2px, transparent 2px 16px)" }}
      />

      <div className="container relative grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="font-display text-xs tracking-[0.3em] text-accent uppercase mb-3 block">
            {t("area.title")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 leading-tight">{t("area.title")}</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">{t("area.subtitle")}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {depts.map((d) => (
              <motion.div
                key={d.code}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-accent/15 to-transparent border border-accent/30 backdrop-blur-sm"
              >
                <div className="font-display text-4xl text-accent font-bold leading-none">{d.code}</div>
                <div className="font-display text-base mt-2 text-primary-foreground/90">{d.name}</div>
                <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-accent/10 blur-xl" />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/70 mb-4">
            <span className="inline-flex items-center gap-2"><Plane className="h-4 w-4 text-accent" /> Nice Côte d'Azur</span>
            <span className="inline-flex items-center gap-2"><Anchor className="h-4 w-4 text-accent" /> Saint-Tropez · Cannes</span>
          </div>
          <p className="text-sm text-primary-foreground/60 italic">{t("area.note")}</p>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[5/4] w-full max-w-xl mx-auto"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/10 via-transparent to-secondary/15 border border-accent/30 shadow-gold backdrop-blur-sm overflow-hidden">
            <svg viewBox="0 0 480 400" className="w-full h-full" aria-label="French Riviera map">
              <defs>
                <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.18" />
                </linearGradient>
                <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="landGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
                </linearGradient>
                <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                </radialGradient>
                <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Sea */}
              <rect x="0" y="0" width="480" height="400" fill="url(#seaGrad)" />

              {/* subtle wave grid */}
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d={`M 0 ${320 + i * 8} Q 120 ${315 + i * 8} 240 ${320 + i * 8} T 480 ${320 + i * 8}`}
                  stroke="hsl(var(--accent))"
                  strokeOpacity="0.06"
                  fill="none"
                />
              ))}

              {/* Var (83) — left landmass */}
              <path
                d="M 20 120 Q 60 90 130 100 Q 200 95 250 130 L 270 220 Q 250 280 220 295 L 180 305 Q 130 300 90 290 L 50 270 Q 25 220 20 180 Z"
                fill="url(#landGrad)"
                stroke="hsl(var(--accent))"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
              {/* Alpes-Maritimes (06) — right landmass */}
              <path
                d="M 250 130 Q 320 95 400 100 Q 450 110 470 150 L 460 220 Q 440 250 410 240 L 360 245 Q 320 260 290 270 L 270 220 Z"
                fill="url(#landGrad2)"
                stroke="hsl(var(--accent))"
                strokeWidth="1.5"
                strokeOpacity="0.85"
              />

              {/* Mountain ridges */}
              <path d="M 60 150 L 100 130 L 140 145 L 180 125 L 220 140" stroke="hsl(var(--accent))" strokeOpacity="0.3" fill="none" strokeWidth="1" />
              <path d="M 280 140 L 320 120 L 360 135 L 400 115 L 440 130" stroke="hsl(var(--accent))" strokeOpacity="0.4" fill="none" strokeWidth="1" />

              {/* Department codes */}
              <g filter="url(#goldGlow)">
                <text x="140" y="205" fill="hsl(var(--accent))" fontFamily="Orbitron" fontSize="44" fontWeight="800" textAnchor="middle" opacity="0.95">83</text>
                <text x="370" y="190" fill="hsl(var(--accent))" fontFamily="Orbitron" fontSize="44" fontWeight="800" textAnchor="middle" opacity="0.95">06</text>
              </g>
              <text x="140" y="228" fill="hsl(var(--primary-foreground))" fontFamily="Inter" fontSize="11" fontWeight="500" textAnchor="middle" opacity="0.7" letterSpacing="2">VAR</text>
              <text x="370" y="213" fill="hsl(var(--primary-foreground))" fontFamily="Inter" fontSize="11" fontWeight="500" textAnchor="middle" opacity="0.7" letterSpacing="1.5">ALPES-MARITIMES</text>

              {/* Cities */}
              {cities.map((c) => (
                <g key={c.name}>
                  <circle cx={c.x} cy={c.y} r="18" fill="url(#cityGlow)" />
                  <circle cx={c.x} cy={c.y} r={c.size + 2} fill="hsl(var(--primary))" />
                  <circle cx={c.x} cy={c.y} r={c.size} fill="hsl(var(--accent))">
                    {c.primary && (
                      <animate attributeName="r" values={`${c.size};${c.size + 3};${c.size}`} dur="2.5s" repeatCount="indefinite" />
                    )}
                  </circle>
                  <text
                    x={c.x}
                    y={c.y - c.size - 6}
                    fill="hsl(var(--primary-foreground))"
                    fontFamily="Inter"
                    fontSize={c.primary ? "12" : "10"}
                    fontWeight={c.primary ? "700" : "500"}
                    textAnchor="middle"
                    opacity={c.primary ? "1" : "0.85"}
                  >
                    {c.name}
                  </text>
                </g>
              ))}

              {/* Compass */}
              <g transform="translate(440, 350)" opacity="0.6">
                <circle r="18" fill="none" stroke="hsl(var(--accent))" strokeWidth="1" />
                <path d="M 0 -14 L 4 0 L 0 14 L -4 0 Z" fill="hsl(var(--accent))" />
                <text y="-22" fill="hsl(var(--accent))" fontSize="9" textAnchor="middle" fontFamily="Orbitron" fontWeight="700">N</text>
              </g>

              {/* Sea label */}
              <text x="60" y="380" fill="hsl(var(--accent))" fontFamily="Orbitron" fontSize="10" letterSpacing="4" opacity="0.5">MÉDITERRANÉE</text>
            </svg>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-accent font-display tracking-[0.3em] uppercase bg-primary/60 backdrop-blur px-3 py-1.5 rounded-full border border-accent/30">
            <MapPin className="h-3.5 w-3.5" /> Côte d'Azur
          </div>
        </motion.div>
      </div>
    </section>
  );
};
