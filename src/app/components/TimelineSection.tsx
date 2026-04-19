import { motion } from "motion/react";
import { Heart, MessageCircle, Sparkles, Calendar, Infinity } from "lucide-react";
import { useInView } from "./useInView";
import { useSite, useThemeAccent } from "./site/SiteContext";

function formatDateBR(iso: string) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function buildChapters(
  person1: string,
  person2: string,
  startDate: string,
  story: string,
  photos: string[]
) {
  const paragraphs = story.split("\n").filter((p) => p.trim().length > 20);
  const mid = paragraphs[Math.floor(paragraphs.length / 2)] || paragraphs[0] || "";
  const last = paragraphs[paragraphs.length - 1] || paragraphs[0] || "";
  const first = paragraphs[0] || "";

  return [
    {
      icon: MessageCircle,
      date: formatDateBR(startDate),
      badge: "O Início",
      title: `${person1} conheceu ${person2}`,
      text: first,
      image: photos[0],
    },
    {
      icon: Sparkles,
      date: "No meio do caminho",
      badge: "A Jornada",
      title: "Risos, abraços, cumplicidade",
      text: mid,
      image: photos[Math.min(photos.length - 1, 2)],
    },
    {
      icon: Infinity,
      date: "Hoje",
      badge: "Para Sempre",
      title: "E a história continua...",
      text: last,
      image: photos[photos.length - 1] || photos[0],
      highlight: true,
    },
  ].filter((c) => c.image && c.text);
}

function ChapterCard({ chapter, index, accent }: { chapter: any; index: number; accent: { accent: string } }) {
  const { ref, isInView } = useInView(0.15);
  const isLeft = index % 2 === 0;
  const Icon = chapter.icon;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group ${chapter.highlight ? "my-4" : ""}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
          chapter.highlight ? "border-white/15 bg-white/[0.04]" : "border-white/[0.06] bg-white/[0.02]"
        } hover:border-white/15 backdrop-blur-sm`}
      >
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <motion.img
            src={chapter.image}
            alt={chapter.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute top-4 left-4">
            <div
              className="px-3 py-1 rounded-full text-white flex items-center gap-1.5"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                backgroundColor: accent.accent,
              }}
            >
              <Icon className="w-3 h-3" />
              {chapter.badge}
            </div>
          </div>

          <div className="absolute bottom-4 left-5 right-5">
            <p
              className="text-white/50 uppercase tracking-widest mb-1"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.7rem" }}
            >
              {chapter.date}
            </p>
            <h3
              className="text-white"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", lineHeight: 1.3 }}
            >
              {chapter.title}
            </h3>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <p
            className="text-white/70"
            style={{ fontFamily: "Lora, serif", fontSize: "0.95rem", lineHeight: 1.8 }}
          >
            {chapter.text}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div ref={ref} className="relative mb-12 md:mb-20 last:mb-0">
      <div className="hidden md:grid md:grid-cols-[1fr_60px_1fr] items-start w-full">
        <div className={isLeft ? "" : "order-3"}>{isLeft ? cardContent : null}</div>
        <div className="flex flex-col items-center order-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-10 relative"
              style={{ backgroundColor: accent.accent }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <motion.div
            className="w-px h-8 bg-white/10 mt-2"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ transformOrigin: "top" }}
          />
        </div>
        <div className={isLeft ? "order-3" : ""}>{!isLeft ? cardContent : null}</div>
      </div>

      <div className="md:hidden flex gap-4 items-start w-full">
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg relative"
            style={{ backgroundColor: accent.accent }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          <div className="w-px flex-1 min-h-[20px] bg-white/10 mt-2" />
        </div>
        <div className="flex-1 pb-4">{cardContent}</div>
      </div>
    </div>
  );
}

export function TimelineSection() {
  const { ref, isInView } = useInView(0.05);
  const data = useSite();
  const accent = useThemeAccent();
  const chapters = buildChapters(data.person1, data.person2, data.startDate, data.story, data.photos);

  if (chapters.length === 0) return null;

  return (
    <section className="relative py-24 md:py-36 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p
            className="uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: accent.accent + "aa" }}
          >
            Cada capítulo da nossa história
          </p>
          <h2
            className="text-white mb-4"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Nossa Linha do Tempo
          </h2>
        </motion.div>

        <div className="hidden md:block absolute left-1/2 top-72 bottom-20 w-px">
          <motion.div
            className="w-full h-full"
            style={{ background: `linear-gradient(to bottom, transparent, ${accent.accent}33, transparent)` }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </div>

        {chapters.map((chapter, i) => (
          <ChapterCard key={i} chapter={chapter} index={i} accent={accent} />
        ))}
      </div>
    </section>
  );
}
