import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  children,
  error,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span
        className="block text-white/80 mb-2"
        style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem", letterSpacing: "0.08em" }}
      >
        {label}
      </span>
      {children}
      {hint && !error && <span className="block text-white/30 text-xs mt-1.5">{hint}</span>}
      {error && <span className="block text-rose-400 text-xs mt-1.5">{error}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-rose-400/50 focus:bg-white/[0.06] transition-colors ${
        props.className || ""
      }`}
      style={{ fontFamily: "Lora, serif", ...props.style }}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-rose-400/50 focus:bg-white/[0.06] transition-colors resize-y ${
        props.className || ""
      }`}
      style={{ fontFamily: "Lora, serif", ...props.style }}
    />
  );
}
