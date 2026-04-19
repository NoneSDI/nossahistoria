import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Play, Pause } from "lucide-react";
import { useSite, useThemeAccent } from "./site/SiteContext";

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {}
  return null;
}

export function MusicPlayer() {
  const data = useSite();
  const accent = useThemeAccent();
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrl = data.musicUrl;
  const ytId = musicUrl ? getYouTubeId(musicUrl) : null;

  useEffect(() => {
    if (!musicUrl || ytId) return;
    const handler = () => {
      if (audioRef.current && !playing) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
      window.removeEventListener("click", handler);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [musicUrl, ytId, playing]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!musicUrl) return null;

  return (
    <>
      {ytId ? (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&controls=0`}
          allow="autoplay"
          style={{ position: "fixed", width: 1, height: 1, border: 0, opacity: 0, pointerEvents: "none" }}
          title="music"
        />
      ) : (
        <audio ref={audioRef} loop preload="auto" src={musicUrl} />
      )}

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
      >
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 flex items-center gap-3"
            >
              {playing && !ytId && (
                <div className="flex items-end gap-0.5 h-4">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{ backgroundColor: accent.accent }}
                      animate={{ height: ["4px", "16px", "4px"] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
              <span className="text-white/60 whitespace-nowrap" style={{ fontFamily: "Lora, serif", fontSize: "0.8rem" }}>
                {ytId ? "Nossa música" : playing ? "Tocando..." : "Nossa música"}
              </span>
              {!ytId && (
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  style={{ backgroundColor: accent.accent + "33" }}
                >
                  {playing ? (
                    <Pause className="w-3.5 h-3.5" style={{ color: accent.accent }} />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: accent.accent }} />
                  )}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(!expanded)}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors cursor-pointer relative"
        >
          {(playing || ytId) && (
            <motion.div
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: accent.accent + "55" }}
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <Music className="w-5 h-5" style={{ color: accent.accent }} />
        </motion.button>
      </motion.div>
    </>
  );
}
