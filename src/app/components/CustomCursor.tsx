import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("button, a, [role='button'], input, textarea, select, .cursor-pointer");
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  // Only show on non-touch devices
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;
  if (isTouchDevice) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border mix-blend-difference"
        animate={{
          x: pos.x - (hovering ? 24 : 18),
          y: pos.y - (hovering ? 24 : 18),
          width: hovering ? 48 : 36,
          height: hovering ? 48 : 36,
          borderColor: hovering ? "rgba(244,63,94,0.8)" : "rgba(255,255,255,0.5)",
          scale: clicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
      />
      {/* Inner heart dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        animate={{
          x: pos.x - 5,
          y: pos.y - 5,
          scale: clicking ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
      {/* Trail particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9998] w-1.5 h-1.5 rounded-full bg-rose-400/40"
          animate={{
            x: pos.x - 3,
            y: pos.y - 3,
          }}
          transition={{
            type: "spring",
            stiffness: 150 - i * 40,
            damping: 15 + i * 5,
            mass: 0.5 + i * 0.3,
          }}
        />
      ))}
    </>
  );
}
