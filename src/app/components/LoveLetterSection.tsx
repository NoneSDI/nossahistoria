import { motion } from "motion/react";
import { useInView } from "./useInView";
import { useSite, useThemeAccent } from "./site/SiteContext";

export function LoveLetterSection() {
  const { ref, isInView } = useInView(0.1);
  const data = useSite();
  const accent = useThemeAccent();
  const paragraphs = (data.story || "").split("\n").filter((p) => p.trim());

  if (paragraphs.length === 0) return null;

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a]" ref={ref}>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-2xl mx-auto px-6 relative">
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
            Do meu coração para o seu
          </p>
          <h2
            className="text-white"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Nossa História
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
        >
          {paragraphs.map((p, i) => {
            const isGreeting = i === 0 && p.length < 40;
            const isLoveYou = /eu te amo|te amo/i.test(p);
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                className="text-white/70 mb-4 last:mb-0"
                style={{
                  fontFamily: isGreeting || isLoveYou ? "Great Vibes, cursive" : "Lora, serif",
                  fontSize: isGreeting ? "1.8rem" : isLoveYou ? "1.6rem" : "1rem",
                  lineHeight: 1.9,
                  color: isGreeting
                    ? accent.accent + "cc"
                    : isLoveYou
                    ? accent.accent + "dd"
                    : undefined,
                }}
              >
                {p}
              </motion.p>
            );
          })}

          {data.signature && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 2.5 }}
              className="text-amber-200/60 mt-8 text-right"
              style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.5rem" }}
            >
              — {data.signature}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
