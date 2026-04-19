import { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
}

export function PhotoUpload({ photos, onChange, max = 9 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const current = [...photos];
    for (const file of Array.from(files)) {
      if (current.length >= max) break;
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 8 * 1024 * 1024) {
        alert(`${file.name} é maior que 8MB`);
        continue;
      }
      const dataUrl = await readAsDataURL(file);
      current.push(dataUrl);
    }
    onChange(current);
  };

  const remove = (i: number) => {
    const next = [...photos];
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-xl overflow-hidden bg-white/[0.04] border border-white/10"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center hover:bg-rose-500 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
            {i === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] uppercase tracking-widest">
                Capa
              </div>
            )}
          </motion.div>
        ))}

        {photos.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-rose-400/50 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-rose-300 transition-colors"
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Adicionar
            </span>
          </button>
        )}
      </div>

      <p className="text-white/30 text-xs mt-3 flex items-center gap-1.5">
        <ImageIcon className="w-3 h-3" />
        {photos.length}/{max} fotos · A primeira é a capa · Até 8MB cada
      </p>
    </div>
  );
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
