import { motion } from "motion/react";
import { Heart, ChevronDown } from "lucide-react";
import { useSite, useThemeAccent } from "./site/SiteContext";

interface Props {
  onStart?: () => void;
}

function formatDateBR(iso: string) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function yearsTogether(iso: string) {
  const start = new Date(iso + "T00:00:00").getTime();
  const years = (Date.now() - start) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years));
}

export function HeroSection({ onStart }: Props) {
  const data = useSite();
  const accent = useThemeAccent();
  const heroImg = data.photos[0];
  const displayDate = data.specialDate || formatDateBR(data.startDate);
  const title = data.specialTitle || `A nossa história, ${data.person2}`;
  const years = yearsTogether(data.startDate);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {heroImg ? (
          <motion.img
            src={heroImg}
            alt={`${data.person1} e ${data.person2}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-900/40 via-black to-purple-900/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            backgroundColor: accent.accent + "55",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          className="mb-8 relative"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-20 h-20 rounded-full blur-xl"
              style={{ backgroundColor: accent.accent + "33" }}
            />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart
              className="w-12 h-12 mx-auto relative"
              fill="currentColor"
              style={{ color: accent.accent }}
            />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.9rem", color: accent.accent + "cc" }}
        >
          {displayDate}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-white mb-4"
          style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1.2 }}
        >
          {title}{" "}
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block"
          >
            ❤️
          </motion.span>
        </motion.h1>

        {years > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-white/70 mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
          >
            {years === 1 ? "1 ano" : `${years} anos`} de uma história que merece ser celebrada,
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 1.2, type: "spring" }}
          className="relative"
        >
          <motion.span
            className="bg-clip-text text-transparent inline-block"
            style={{
              fontFamily: "Great Vibes, cursive",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              backgroundImage: `linear-gradient(to right, ${accent.accent}, #fde68a, ${accent.accent})`,
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            {data.person2}
          </motion.span>
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-amber-300/50"
              style={{
                top: `${-10 + (i % 2) * 60}%`,
                left: `${20 + i * 18}%`,
                fontSize: "0.7rem",
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              ✦
            </motion.span>
          ))}
        </motion.p>

        {onStart && (
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${accent.accent}55` }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="mt-10 px-8 py-4 rounded-full border backdrop-blur-sm transition-colors cursor-pointer relative overflow-hidden group"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.1rem",
              letterSpacing: "0.15em",
              borderColor: accent.accent + "66",
              color: "white",
              backgroundColor: accent.accent + "22",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <span className="relative">Começar nossa história</span>
          </motion.button>
        )}

        {onStart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 text-white/40" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
