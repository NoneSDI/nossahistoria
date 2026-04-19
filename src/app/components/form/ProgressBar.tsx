import { motion } from "motion/react";

export function ProgressBar({ current, total, labels }: { current: number; total: number; labels?: string[] }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-white/40 mb-2" style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}>
        <span>ETAPA {current + 1} DE {total}</span>
        {labels && <span>{labels[current]?.toUpperCase()}</span>}
      </div>
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
