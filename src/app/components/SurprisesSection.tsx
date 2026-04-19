import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Gift, Sparkles } from "lucide-react";
import { useInView } from "./useInView";
import confetti from "canvas-confetti";
import { useThemeAccent } from "./site/SiteContext";

const surprises = [
  {
    icon: Heart,
    label: "Clique aqui ❤️",
    message: "Você é o melhor presente que a vida me deu.",
  },
  {
    icon: Gift,
    label: "Uma mensagem pra você",
    message: "Cada segundo ao seu lado vale mais do que uma eternidade sem você.",
  },
  {
    icon: Sparkles,
    label: "Mais uma surpresa ✨",
    message: "Se o amor fosse uma constelação, cada estrela teria o seu nome.",
  },
];

export function SurprisesSection() {
  const { ref, isInView } = useInView(0.2);
  const accent = useThemeAccent();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const reveal = (i: number) => {
    if (revealed[i]) return;
    setRevealed((p) => ({ ...p, [i]: true }));
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: [accent.accent, "#d4a574", "#a855f7", "#fbbf24"],
    });
  };

  return (
    <section className="relative py-24 md:py-32 bg-[#080808]" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p
            className="uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: accent.accent + "aa" }}
          >
            Surpresas escondidas
          </p>
          <h2
            className="text-white"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Momentos Especiais
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {surprises.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => reveal(i)}
                  className="w-full bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-white/20 transition-colors min-h-[200px] flex flex-col items-center justify-center"
                >
                  <AnimatePresence mode="wait">
                    {!revealed[i] ? (
                      <motion.div key="btn" exit={{ scale: 0, opacity: 0 }} className="flex flex-col items-center">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: accent.accent }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white/80" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem" }}>
                          {s.label}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="msg"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        style={{
                          fontFamily: "Great Vibes, cursive",
                          fontSize: "1.4rem",
                          lineHeight: 1.6,
                          color: accent.accent + "ee",
                        }}
                      >
                        {s.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
