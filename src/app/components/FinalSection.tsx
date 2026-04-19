import { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useInView } from "./useInView";
import confetti from "canvas-confetti";
import { useSite, useThemeAccent } from "./site/SiteContext";

export function FinalSection() {
  const { ref, isInView } = useInView(0.2);
  const [clicked, setClicked] = useState(false);
  const data = useSite();
  const accent = useThemeAccent();

  const handleClick = () => {
    setClicked(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.7 },
      colors: [accent.accent, "#fbbf24", "#a855f7", "#ec4899", "#f97316"],
    });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-[#060606]"
    >
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]"
        style={{ backgroundColor: accent.accent + "0d" }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <p
            className="bg-clip-text text-transparent mb-8"
            style={{
              fontFamily: "Great Vibes, cursive",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              backgroundImage: `linear-gradient(to right, ${accent.accent}, #fde68a, ${accent.accent})`,
            }}
          >
            Eu te escolheria em todas as vidas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p
            className="text-white/50 mb-12"
            style={{ fontFamily: "Lora, serif", fontSize: "1.05rem", lineHeight: 1.8 }}
          >
            Que cada novo dia ao seu lado seja mais lindo que o anterior.
            <br />
            Hoje e sempre, meu amor.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1, type: "spring" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleClick}
          className="px-10 py-5 rounded-full text-white shadow-2xl cursor-pointer flex items-center gap-3 mx-auto"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.2rem",
            letterSpacing: "0.1em",
            backgroundImage: `linear-gradient(to right, ${accent.accent}, #ec4899)`,
            boxShadow: `0 20px 40px ${accent.accent}33`,
          }}
        >
          <Heart className="w-5 h-5" fill="currentColor" />
          Eu te amo
        </motion.button>

        {clicked && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
            style={{
              fontFamily: "Great Vibes, cursive",
              fontSize: "1.3rem",
              color: accent.accent + "cc",
            }}
          >
            Para sempre, {data.person2} ❤️
          </motion.p>
        )}
      </div>
    </section>
  );
}
