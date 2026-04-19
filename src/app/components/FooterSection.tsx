import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useInView } from "./useInView";
import { useSite, useThemeAccent } from "./site/SiteContext";

function formatDateBR(iso: string) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

export function FooterSection() {
  const { ref, isInView } = useInView(0.3);
  const data = useSite();
  const accent = useThemeAccent();
  const signature = data.signature || data.person1;

  return (
    <footer ref={ref} className="py-16 bg-black border-t border-white/5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-6"
      >
        <Heart
          className="w-5 h-5 mx-auto mb-4"
          fill="currentColor"
          style={{ color: accent.accent + "66" }}
        />
        <p
          className="text-amber-200/50 mb-2"
          style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.5rem" }}
        >
          Com amor, {signature}
        </p>
        <p
          className="text-white/20"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", letterSpacing: "0.2em" }}
        >
          Desde {formatDateBR(data.startDate)}
        </p>
        <p
          className="text-white/10 mt-6"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.7rem", letterSpacing: "0.3em" }}
        >
          FEITO COM ♥ • nossohistoria.love
        </p>
      </motion.div>
    </footer>
  );
}
