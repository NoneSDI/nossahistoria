import type { LoveData } from "../../../lib/types";
import { THEMES } from "../../../lib/types";
import { daysSince } from "../../../lib/slug";
import { Heart, Music } from "lucide-react";

export function PreviewMini({ data }: { data: LoveData }) {
  const accent = THEMES[data.theme] ?? THEMES.rose;
  const t = daysSince(data.startDate);
  const hero = data.photos[0];

  return (
    <div className="sticky top-6 rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
      <div className="relative aspect-[9/16] max-h-[75vh] overflow-hidden">
        {hero ? (
          <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${accent.accent}22, #000, ${accent.accent}11)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Heart
            className="w-8 h-8 mb-3"
            fill="currentColor"
            style={{ color: accent.accent }}
          />
          {(data.specialDate || data.startDate) && (
            <p
              className="uppercase tracking-[0.3em] mb-2 text-[10px]"
              style={{ color: accent.accent + "cc", fontFamily: "Cormorant Garamond, serif" }}
            >
              {data.specialDate || formatDate(data.startDate)}
            </p>
          )}
          {data.specialTitle && (
            <h3
              className="text-white mb-2"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", lineHeight: 1.2 }}
            >
              {data.specialTitle}
            </h3>
          )}
          <p
            className="bg-clip-text text-transparent"
            style={{
              fontFamily: "Great Vibes, cursive",
              fontSize: "2.75rem",
              backgroundImage: `linear-gradient(to right, ${accent.accent}, #fde68a, ${accent.accent})`,
            }}
          >
            {data.person2 || "..."}
          </p>
          {data.person1 && (
            <p className="text-white/60 mt-2 text-sm" style={{ fontFamily: "Lora, serif" }}>
              com {data.person1}
            </p>
          )}

          {data.startDate && (
            <div className="mt-8 grid grid-cols-4 gap-2 w-full max-w-xs">
              {[
                { v: t.days, l: "Dias" },
                { v: t.hours, l: "Hrs" },
                { v: t.minutes, l: "Min" },
                { v: t.seconds, l: "Seg" },
              ].map((u) => (
                <div key={u.l} className="bg-white/5 backdrop-blur-sm rounded-lg py-1.5 text-center">
                  <div className="text-white text-base" style={{ fontFamily: "Playfair Display, serif" }}>
                    {u.v}
                  </div>
                  <div className="text-white/40 text-[8px] uppercase tracking-widest">{u.l}</div>
                </div>
              ))}
            </div>
          )}

          {data.musicUrl && (
            <div className="mt-6 flex items-center gap-2 text-white/60 text-xs">
              <Music className="w-3 h-3" style={{ color: accent.accent }} /> Com música
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
