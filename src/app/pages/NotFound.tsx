import { Link } from "react-router";
import { Heart } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center">
        <Heart className="w-12 h-12 text-rose-400 mx-auto mb-6" fill="currentColor" />
        <h1
          className="text-white mb-4"
          style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 6vw, 4rem)" }}
        >
          Página não encontrada
        </h1>
        <p className="text-white/60 mb-8" style={{ fontFamily: "Lora, serif" }}>
          Mas a nossa história ainda está sendo escrita...
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
          style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}
        >
          VOLTAR AO INÍCIO
        </Link>
      </div>
    </div>
  );
}
