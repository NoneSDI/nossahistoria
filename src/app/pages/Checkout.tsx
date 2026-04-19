import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Heart, ArrowLeft, CreditCard, QrCode, Shield, Loader2 } from "lucide-react";
import { getDraft, createPayment } from "../../lib/api";
import type { Draft } from "../../lib/types";
import { PRICE_BRL, PRICE_OLD_BRL } from "../../lib/types";

export function CheckoutPage() {
  const { draftId } = useParams<{ draftId: string }>();
  const [sp] = useSearchParams();
  const failed = sp.get("failed") === "1";
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!draftId) return;
    getDraft(draftId)
      .then((d) => setDraft(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [draftId]);

  const startPayment = async () => {
    if (!draftId) return;
    setPaying(true);
    setError(null);
    try {
      const { init_point } = await createPayment(draftId);
      window.location.href = init_point;
    } catch (e: any) {
      setError(e?.message || "Erro ao iniciar pagamento");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white/60 mb-4">Rascunho não encontrado.</p>
          <Link to="/criar" className="text-rose-400 underline">
            Criar um novo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-6 max-w-7xl mx-auto">
        <Link to="/criar" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <Heart className="w-10 h-10 text-rose-400 mx-auto mb-4" fill="currentColor" />
            <h1
              className="text-white mb-3"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 2.8rem)" }}
            >
              Falta só o pagamento
            </h1>
            <p className="text-white/60" style={{ fontFamily: "Lora, serif" }}>
              Após confirmar, seu site é gerado automaticamente e você recebe o link.
            </p>
          </div>

          {failed && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 text-sm">
              Seu último pagamento não foi concluído. Você pode tentar novamente abaixo.
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p
                  className="text-rose-300/60 uppercase tracking-[0.3em] mb-1"
                  style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.75rem" }}
                >
                  Seu site
                </p>
                <h3
                  className="text-white"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem" }}
                >
                  {draft.person1} &amp; {draft.person2}
                </h3>
              </div>
              <div className="text-right">
                <p
                  className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem" }}
                >
                  R$ {PRICE_BRL.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-white/40 text-xs">pagamento único</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <QrCode className="w-4 h-4 text-rose-400" />
                <span className="text-white/80 text-sm" style={{ fontFamily: "Lora, serif" }}>PIX</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <CreditCard className="w-4 h-4 text-rose-400" />
                <span className="text-white/80 text-sm" style={{ fontFamily: "Lora, serif" }}>Cartão</span>
              </div>
            </div>

            <button
              onClick={startPayment}
              disabled={paying}
              className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", letterSpacing: "0.15em" }}
            >
              {paying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> REDIRECIONANDO...
                </>
              ) : (
                "PAGAR COM MERCADO PAGO"
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
              <Shield className="w-3 h-3" /> Pagamento processado pelo Mercado Pago
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-rose-200 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          <p className="text-center text-white/30 text-xs">
            Ao continuar você será levado para o ambiente seguro do Mercado Pago.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
