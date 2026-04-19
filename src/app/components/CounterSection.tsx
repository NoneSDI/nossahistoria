import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useInView } from "./useInView";
import { useSite, useThemeAccent } from "./site/SiteContext";
import { daysSince } from "../../lib/slug";

const units = [
  { key: "days", label: "Dias" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
] as const;

export function CounterSection() {
  const data = useSite();
  const accent = useThemeAccent();
  const [time, setTime] = useState(() => daysSince(data.startDate));
  const { ref, isInView } = useInView(0.2);

  useEffect(() => {
    const id = setInterval(() => setTime(daysSince(data.startDate)), 1000);
    return () => clearInterval(id);
  }, [data.startDate]);

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p
            className="uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: accent.accent + "aa" }}
          >
            Cada segundo importa
          </p>
          <h2
            className="text-white"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Tempo Juntos
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {units.map((u, i) => (
            <motion.div
              key={u.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, type: "spring" }}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <div
                className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                <motion.span
                  key={time[u.key]}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {time[u.key]}
                </motion.span>
              </div>
              <div
                className="uppercase tracking-widest mt-2"
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.75rem", color: accent.accent + "66" }}
              >
                {u.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
