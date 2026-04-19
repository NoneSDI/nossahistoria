import { motion } from "motion/react";
import { useInView } from "./useInView";
import { useSite, useThemeAccent } from "./site/SiteContext";

export function GallerySection() {
  const { ref, isInView } = useInView(0.1);
  const data = useSite();
  const accent = useThemeAccent();
  const photos = data.photos.slice(0, 9);

  if (photos.length === 0) return null;

  return (
    <section className="relative py-24 md:py-32 bg-[#080808]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            className="uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: accent.accent + "aa" }}
            animate={isInView ? { opacity: [0, 1] } : {}}
            transition={{ duration: 1.2 }}
          >
            Momentos eternizados
          </motion.p>
          <h2
            className="text-white"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Nossa Galeria
          </h2>
          <motion.div
            className="w-16 h-px mx-auto mt-4"
            style={{ background: `linear-gradient(to right, transparent, ${accent.accent}, transparent)` }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotateY: 15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
            >
              <img
                src={src}
                alt={`${data.person1} e ${data.person2} ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  style={{ transform: "skewX(-15deg)" }}
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </div>
              <div
                className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ backgroundColor: accent.accent + "44" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
