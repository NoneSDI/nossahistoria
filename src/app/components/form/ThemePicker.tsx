import { Check } from "lucide-react";
import type { Theme } from "../../../lib/types";
import { THEMES } from "../../../lib/types";

interface Props {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemePicker({ value, onChange }: Props) {
  const entries = Object.entries(THEMES) as [Theme, (typeof THEMES)[Theme]][];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {entries.map(([key, t]) => {
        const selected = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative rounded-xl p-4 border-2 transition-all ${
              selected ? "border-white scale-[1.02]" : "border-white/10 hover:border-white/30"
            }`}
            style={{ backgroundColor: t.accent + "22" }}
          >
            <div
              className={`w-full h-16 rounded-lg mb-2 bg-gradient-to-br ${t.gradient}`}
            />
            <p
              className="text-white text-xs text-center"
              style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.1em" }}
            >
              {t.label}
            </p>
            {selected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
