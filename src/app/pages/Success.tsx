import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { Heart, Copy, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { getDraft, getLatestPayment } from "../../lib/api";
import { clearLocalDraft } from "../../lib/draftStorage";
import type { Draft, Payment } from "../../lib/types";

export function SuccessPage() {
  const { draftId } = useParams<{ draftId: string }>();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (!draftId) return;
    let stopped = false;

    async function tick() {
      try {
        const [d, p] = await Promise.all([getDraft(draftId!), getLatestPayment(draftId!)]);
        if (stopped) return;
        setDraft(d);
        setPayment(p);
        if (d?.status === "paid" || d?.status === "published" || p?.status === "approved") {
          if (!celebrated) {
            setCelebrated(true);
            confetti({ particleCount: 180, spread: 110, origin: { y: 0.4 } });
            clearLocalDraft();
          }
        }
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar status");
      }
    }

    tick();
    const id = setInterval(tick, 3500);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [draftId, celebrated]);

  const siteUrl = draft?.slug
    ? `${window.location.origin}/love/${draft.slug}`
    : null;

  const copy = async () => {
    if (!siteUrl) return;
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paid =
    draft?.status === "paid" ||
    draft?.status === "published" ||
    payment?.status === "approved";

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {paid ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="inline-block mb-6"
              >
                <CheckCircle2 className="w-20 h-20 text-rose-400" strokeWidth={1.2} />
              </motion.div>
              <h1
                className="text-white mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 6vw, 3rem)" }}
              >
                Tudo pronto!
              </h1>
              <p className="text-white/60 mb-8" style={{ fontFamily: "Lora, serif", fontSize: "1.1rem" }}>
                Seu site romântico foi gerado com carinho. Aqui está o link exclusivo:
              </p>

              {siteUrl && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] p-4 mb-6 flex items-center gap-2">
                  <span
                    className="flex-1 truncate text-left text-rose-200 text-sm"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {siteUrl}
                  </span>
                  <button
                    onClick={copy}
                    className="shrink-0 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {draft?.slug && (
                  <Link
                    to={`/love/${draft.slug}`}
                    className="flex-1 px-6 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}
                  >
                    ABRIR MEU SITE <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  to="/"
                  className="px-6 py-4 rounded-full border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}
                >
                  VOLTAR
                </Link>
              </div>

              <p className="text-white/30 text-xs mt-10">
                Guardamos o link também no seu e-mail{draft?.email ? `: ${draft.email}` : ""}.
              </p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Heart className="w-14 h-14 text-rose-400" fill="currentColor" />
              </motion.div>
              <h1
                className="text-white mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}
              >
                Confirmando seu pagamento...
              </h1>
              <p className="text-white/60 mb-6" style={{ fontFamily: "Lora, serif" }}>
                Isso pode levar alguns segundos. Estamos verificando com o Mercado Pago.
              </p>
              <div className="inline-flex items-center gap-2 text-white/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> aguardando confirmação...
              </div>
              {payment?.status === "rejected" && (
                <div className="mt-8 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200 text-sm">
                  O pagamento foi recusado. <Link to={`/checkout/${draftId}`} className="underline">Tentar novamente</Link>.
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 text-sm">
              {error}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
