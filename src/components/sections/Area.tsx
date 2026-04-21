import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Plane, Anchor } from "lucide-react";

export const Area = () => {
  const { t } = useTranslation();
  const depts = t("area.depts", { returnObjects: true }) as { code: string; name: string }[];

  // Cities along the Riviera coast (positioned along the coastline path)
  const cities = [
    { name: "Toulon", x: 195, y: 360 },
    { name: "Saint-Tropez", x: 270, y: 345 },
    { name: "Cannes", x: 345, y: 320 },
    { name: "Antibes", x: 375, y: 305 },
    { name: "Nice", x: 415, y: 280, primary: true },
    { name: "Monaco", x: 470, y: 250, pin: true },
  ];

  return (
    <section id="area" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-3xl pointer-events-none" />

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

        {/* Circular minimalist map — inspired by reference */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square w-full max-w-lg mx-auto"
        >
          {/* Outer card */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-foreground/[0.04] to-transparent border border-accent/20 backdrop-blur-sm p-6">
            <svg viewBox="0 0 600 600" className="w-full h-full" aria-label="French Riviera map">
              <defs>
                <radialGradient id="seaCircle" cx="55%" cy="55%" r="55%">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.28" />
                  <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
                </radialGradient>
                <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feOffset dy="3" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer ring */}
              <circle cx="300" cy="300" r="278" fill="none" stroke="hsl(var(--accent))" strokeOpacity="0.55" strokeWidth="1.5" />

              {/* Clipping circle for the inner content */}
              <clipPath id="mapClip">
                <circle cx="300" cy="300" r="276" />
              </clipPath>

              <g clipPath="url(#mapClip)">
                {/* Soft sea disc */}
                <circle cx="330" cy="340" r="240" fill="url(#seaCircle)" />

                {/* Stylized coastline — land on top-left, sea on bottom-right */}
                <path
                  d="M 0 600 L 0 280 Q 60 270 110 285 Q 160 300 200 320 Q 240 335 280 330 Q 320 322 360 305 Q 400 285 440 260 Q 475 238 505 215 Q 540 188 570 158 Q 590 138 600 118 L 600 0 L 0 0 L 0 280 Z"
                  fill="hsl(var(--primary-foreground))"
                  fillOpacity="0.03"
                />
                <path
                  d="M 0 280 Q 60 270 110 285 Q 160 300 200 320 Q 240 335 280 330 Q 320 322 360 305 Q 400 285 440 260 Q 475 238 505 215 Q 540 188 570 158 Q 590 138 600 118"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />

                {/* Sea label */}
                <text
                  x="380"
                  y="475"
                  fill="hsl(var(--accent))"
                  fillOpacity="0.6"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontSize="22"
                  textAnchor="middle"
                >
                  Mer
                </text>
                <text
                  x="380"
                  y="502"
                  fill="hsl(var(--accent))"
                  fillOpacity="0.6"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontSize="22"
                  textAnchor="middle"
                >
                  Méditerranée
                </text>

                {/* Cities — text labels on land side */}
                {cities.map((c) => {
                  if (c.pin) return null;
                  return (
                    <g key={c.name}>
                      <circle cx={c.x} cy={c.y} r={c.primary ? 4 : 3} fill="hsl(var(--accent))" />
                      <text
                        x={c.x - 10}
                        y={c.y + 4}
                        fill="hsl(var(--primary-foreground))"
                        fontFamily="Inter, sans-serif"
                        fontSize={c.primary ? "20" : "17"}
                        fontWeight={c.primary ? "700" : "600"}
                        textAnchor="end"
                      >
                        {c.name}
                      </text>
                    </g>
                  );
                })}

                {/* Monaco — featured pin */}
                {(() => {
                  const m = cities.find((c) => c.pin)!;
                  return (
                    <g filter="url(#pinShadow)">
                      <text
                        x={m.x}
                        y={m.y + 38}
                        fill="hsl(var(--primary-foreground))"
                        fontFamily="Inter, sans-serif"
                        fontSize="22"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {m.name}
                      </text>
                      {/* Pin shape */}
                      <path
                        d={`M ${m.x} ${m.y - 38} 
                            C ${m.x - 16} ${m.y - 38}, ${m.x - 16} ${m.y - 14}, ${m.x} ${m.y + 4}
                            C ${m.x + 16} ${m.y - 14}, ${m.x + 16} ${m.y - 38}, ${m.x} ${m.y - 38} Z`}
                        fill="hsl(var(--accent))"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <circle cx={m.x} cy={m.y - 24} r="8" fill="hsl(var(--primary))" />
                      <text
                        x={m.x}
                        y={m.y - 20}
                        fill="hsl(var(--accent))"
                        fontFamily="Inter, sans-serif"
                        fontSize="10"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        ★
                      </text>
                      {/* Pulse */}
                      <circle cx={m.x} cy={m.y - 24} r="10" fill="none" stroke="hsl(var(--accent))" strokeOpacity="0.6">
                        <animate attributeName="r" values="10;22;10" dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  );
                })()}

                {/* Department labels — discreet */}
                <text x="120" y="180" fill="hsl(var(--accent))" fillOpacity="0.45" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" letterSpacing="3">VAR · 83</text>
                <text x="370" y="155" fill="hsl(var(--accent))" fillOpacity="0.55" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" letterSpacing="2">ALPES-MARITIMES · 06</text>
              </g>
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
