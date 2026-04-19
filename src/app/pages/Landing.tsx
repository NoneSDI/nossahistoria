import { Link } from "react-router";
import { motion } from "motion/react";
import { Heart, Sparkles, Clock, Image, Music, Palette, Check, ArrowRight } from "lucide-react";
import { PRICE_BRL, PRICE_OLD_BRL } from "../../lib/types";
import { DEMO_DATA } from "../../lib/demoData";

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function LandingPage() {
  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <Features />
      <DemoCard />
      <Pricing />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
          <span style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.6rem" }}>
            nossohistoria
          </span>
        </div>
        <Link
          to="/demo"
          className="text-white/60 hover:text-white text-sm transition-colors"
          style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}
        >
          VER EXEMPLO
        </Link>
      </nav>

      <div className="relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="mb-8 inline-block"
        >
          <Heart className="w-14 h-14 text-rose-400" fill="currentColor" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-rose-300/80 uppercase tracking-[0.4em] mb-6"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem" }}
        >
          Eternize o que vocês viveram
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-6"
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            lineHeight: 1.1,
          }}
        >
          Um site único para <br />
          <span
            className="bg-gradient-to-r from-rose-300 via-amber-200 to-rose-300 bg-clip-text text-transparent"
            style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.3em" }}
          >
            a pessoa que você ama
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-white/60 mb-12 max-w-2xl mx-auto"
          style={{ fontFamily: "Lora, serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7 }}
        >
          Crie em poucos minutos uma página romântica personalizada com as fotos, a história e a
          música de vocês. Receba um link exclusivo para surpreender quem você ama.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link
            to="/criar"
            className="px-10 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-2xl shadow-rose-500/30 hover:scale-105 transition-transform flex items-center gap-2"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.15rem", letterSpacing: "0.15em" }}
          >
            CRIAR MEU SITE
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/demo"
            className="px-8 py-4 rounded-full border border-white/20 text-white/80 hover:bg-white/5 transition-colors"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", letterSpacing: "0.15em" }}
          >
            VER DEMONSTRAÇÃO
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-white/40 mt-8 text-sm"
          style={{ fontFamily: "Lora, serif" }}
        >
          <span className="line-through text-white/25 mr-1">{formatBRL(PRICE_OLD_BRL)}</span>
          <span className="text-rose-300">{formatBRL(PRICE_BRL)} hoje</span> · PIX ou cartão · Acesso imediato
        </motion.p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Sparkles, title: "Crie", text: "Personalize com fotos, história e música dos dois." },
    { icon: Heart, title: "Pague", text: "PIX ou cartão em poucos cliques. Seguro e rápido." },
    { icon: Clock, title: "Receba", text: "Link exclusivo é gerado automaticamente e funciona pra sempre." },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p
            className="text-rose-300/60 uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem" }}
          >
            Simples assim
          </p>
          <h2
            className="text-white"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Como funciona
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className="absolute top-6 right-6 text-white/10"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "3rem" }}
                >
                  0{i + 1}
                </div>
                <h3
                  className="text-white mb-3"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem" }}
                >
                  {s.title}
                </h3>
                <p className="text-white/60" style={{ fontFamily: "Lora, serif", lineHeight: 1.7 }}>
                  {s.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Image, title: "Fotos em carrossel", text: "Galeria animada com todas as fotos de vocês." },
    { icon: Music, title: "Música tocando", text: "Coloque a música de vocês tocando ao abrir o site." },
    { icon: Clock, title: "Contador em tempo real", text: "Dias, horas, minutos, segundos juntos — ao vivo." },
    { icon: Palette, title: "5 temas lindos", text: "Rosa clássico, dourado, violeta, esmeralda, meia-noite." },
    { icon: Sparkles, title: "Animações suaves", text: "Partículas, transições, corações flutuando." },
    { icon: Heart, title: "Link único", text: "Uma URL personalizada só de vocês — para sempre." },
  ];

  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-rose-300/60 uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem" }}
          >
            Tudo incluso
          </p>
          <h2
            className="text-white"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            O que seu site terá
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-rose-500/30 transition-colors"
              >
                <Icon className="w-6 h-6 text-rose-400 mb-4" />
                <h3
                  className="text-white mb-2"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem" }}
                >
                  {f.title}
                </h3>
                <p className="text-white/50 text-sm" style={{ fontFamily: "Lora, serif", lineHeight: 1.6 }}>
                  {f.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DemoCard() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/10"
        >
          <div className="aspect-[16/10] relative">
            <img src={DEMO_DATA.photos[0]} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex items-end p-8 md:p-12">
            <div>
              <p
                className="text-rose-300/70 uppercase tracking-[0.3em] mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.75rem" }}
              >
                Exemplo real
              </p>
              <h3
                className="text-white mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}
              >
                Veja um site pronto
              </h3>
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-rose-100 transition-colors"
                style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}
              >
                ABRIR EXEMPLO <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Pricing() {
  const benefits = [
    "Link único e permanente",
    "Fotos ilimitadas",
    "Música personalizada (YouTube ou MP3)",
    "Contador de tempo em tempo real",
    "5 temas premium",
    "Animações e efeitos românticos",
    "Acesso imediato após o pagamento",
    "Sem mensalidade — pague uma vez, fique pra sempre",
  ];

  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <p
            className="text-rose-300/60 uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem" }}
          >
            Preço único
          </p>
          <h2
            className="text-white"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Um presente inesquecível
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-rose-500/30 bg-gradient-to-b from-rose-500/5 to-transparent p-8 md:p-12 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs uppercase tracking-widest mb-6">
              🎉 Promo de lançamento · 50% OFF
            </div>
            <div
              className="text-white/30 line-through mb-2"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem" }}
            >
              De R$ {PRICE_OLD_BRL.toFixed(2).replace(".", ",")}
            </div>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-white/60" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem" }}>
                R$
              </span>
              <span
                className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(3.5rem, 10vw, 5rem)" }}
              >
                {PRICE_BRL.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <p className="text-white/40 text-sm" style={{ fontFamily: "Lora, serif" }}>
              Pagamento único · acesso vitalício · sem mensalidade
            </p>
          </div>

          <ul className="space-y-3 mb-10">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-white/80" style={{ fontFamily: "Lora, serif" }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/criar"
            className="block w-full text-center py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:scale-[1.02] transition-transform shadow-lg shadow-rose-500/20"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", letterSpacing: "0.15em" }}
          >
            COMEÇAR AGORA
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p
          className="bg-gradient-to-r from-rose-300 via-amber-200 to-rose-300 bg-clip-text text-transparent mb-8"
          style={{ fontFamily: "Great Vibes, cursive", fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
        >
          Que tal começar hoje?
        </p>
        <Link
          to="/criar"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-2xl shadow-rose-500/30 hover:scale-105 transition-transform"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", letterSpacing: "0.15em" }}
        >
          <Heart className="w-5 h-5" fill="currentColor" /> CRIAR MEU SITE
        </Link>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="py-12 bg-black border-t border-white/5 text-center">
      <p
        className="text-white/30"
        style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", letterSpacing: "0.2em" }}
      >
        FEITO COM ♥ · NOSSOHISTORIA.LOVE
      </p>
    </footer>
  );
}
