import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Heart, Eye } from "lucide-react";
import type { LoveData, Theme } from "../../lib/types";
import { Field, TextInput, TextArea } from "../components/form/FormField";
import { ProgressBar } from "../components/form/ProgressBar";
import { PhotoUpload } from "../components/form/PhotoUpload";
import { ThemePicker } from "../components/form/ThemePicker";
import { PreviewMini } from "../components/form/PreviewMini";
import { saveLocalDraft, loadLocalDraft } from "../../lib/draftStorage";
import { submitDraft } from "../../lib/api";

const STEPS = ["Casal", "Fotos", "História", "Música", "Tema", "Revisão"];

const defaultData: LoveData = {
  person1: "",
  person2: "",
  startDate: "",
  story: "",
  photos: [],
  musicUrl: "",
  theme: "rose",
  specialTitle: "",
  specialDate: "",
  signature: "",
};

export function CreatePage() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<LoveData>(defaultData);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const saved = loadLocalDraft();
    if (saved) setData((d) => ({ ...d, ...saved }));
  }, []);

  useEffect(() => {
    saveLocalDraft(data);
  }, [data]);

  const update = <K extends keyof LoveData>(key: K, val: LoveData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const canNext = (() => {
    if (step === 0) return data.person1.trim() && data.person2.trim() && data.startDate;
    if (step === 1) return data.photos.length >= 1;
    if (step === 2) return data.story.trim().length >= 30;
    return true;
  })();

  const goNext = () => {
    setError(null);
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };
  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Digite um e-mail válido para receber o link do site.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitDraft(data, email);
      nav(`/checkout/${result.draftId}`);
    } catch (e: any) {
      setError(e?.message || "Algo deu errado. Tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
          <span style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.4rem" }}>
            nossohistoria
          </span>
        </Link>
        <button
          onClick={() => setPreviewOpen(true)}
          className="lg:hidden flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <Eye className="w-4 h-4" /> Ver preview
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          <ProgressBar current={step} total={STEPS.length} labels={STEPS} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {step === 0 && (
                <>
                  <StepHeader title="Vamos começar pelo básico" subtitle="Quem são os protagonistas dessa história?" />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Seu nome">
                      <TextInput
                        value={data.person1}
                        onChange={(e) => update("person1", e.target.value)}
                        placeholder="Guilherme"
                      />
                    </Field>
                    <Field label="Nome da pessoa amada">
                      <TextInput
                        value={data.person2}
                        onChange={(e) => update("person2", e.target.value)}
                        placeholder="Brenda"
                      />
                    </Field>
                  </div>
                  <Field label="Quando começou a história de vocês?" hint="Essa data alimenta o contador de tempo juntos.">
                    <TextInput
                      type="date"
                      value={data.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  </Field>
                  <Field label="Data especial (opcional)" hint='Ex: "17 de abril de 2026" — aparece no topo do site'>
                    <TextInput
                      value={data.specialDate || ""}
                      onChange={(e) => update("specialDate", e.target.value)}
                      placeholder="17 de abril de 2026"
                    />
                  </Field>
                  <Field label="Título especial (opcional)" hint='Ex: "Feliz aniversário, meu amor"'>
                    <TextInput
                      value={data.specialTitle || ""}
                      onChange={(e) => update("specialTitle", e.target.value)}
                      placeholder="Feliz aniversário, meu amor"
                    />
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <StepHeader title="Fotos de vocês" subtitle="Adicione até 9 fotos. A primeira vira capa." />
                  <PhotoUpload photos={data.photos} onChange={(p) => update("photos", p)} />
                </>
              )}

              {step === 2 && (
                <>
                  <StepHeader title="Conte a história de vocês" subtitle="Como se conheceram? O que vocês viveram? Escreva o que seu coração pedir." />
                  <Field label="Nossa história" hint={`${data.story.length} caracteres · mínimo 30`}>
                    <TextArea
                      rows={14}
                      value={data.story}
                      onChange={(e) => update("story", e.target.value)}
                      placeholder="Escreva com calma... pule linhas para separar parágrafos.\n\nEx: 'Brenda, hoje é um dia especial...'"
                    />
                  </Field>
                  <Field label="Assinatura (opcional)" hint='Aparece no final da carta. Ex: "Guilherme"'>
                    <TextInput
                      value={data.signature || ""}
                      onChange={(e) => update("signature", e.target.value)}
                      placeholder={data.person1 || "Seu nome"}
                    />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <StepHeader title="Música de vocês" subtitle="Cole o link do YouTube ou o URL de um MP3. Pode deixar em branco também." />
                  <Field label="Link da música" hint="YouTube ou MP3 direto">
                    <TextInput
                      value={data.musicUrl || ""}
                      onChange={(e) => update("musicUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </Field>
                </>
              )}

              {step === 4 && (
                <>
                  <StepHeader title="Escolha o estilo" subtitle="A cor principal do site de vocês." />
                  <ThemePicker value={data.theme} onChange={(t: Theme) => update("theme", t)} />
                </>
              )}

              {step === 5 && (
                <>
                  <StepHeader title="Quase lá!" subtitle="Seu e-mail para receber o link do site após o pagamento." />
                  <Field label="Seu e-mail" hint="Enviamos o link e confirmação do pagamento para esse endereço.">
                    <TextInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </Field>
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-5">
                    <h4
                      className="text-rose-200 mb-2"
                      style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", letterSpacing: "0.1em" }}
                    >
                      RESUMO
                    </h4>
                    <ul className="text-sm text-white/70 space-y-1" style={{ fontFamily: "Lora, serif" }}>
                      <li>• Casal: <span className="text-white">{data.person1} e {data.person2}</span></li>
                      <li>• Fotos: <span className="text-white">{data.photos.length}</span></li>
                      <li>• História: <span className="text-white">{data.story.length} caracteres</span></li>
                      <li>• Música: <span className="text-white">{data.musicUrl ? "✓" : "—"}</span></li>
                      <li>• Tema: <span className="text-white">{data.theme}</span></li>
                    </ul>
                  </div>
                </>
              )}

              {error && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200 text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white/60 hover:text-white disabled:opacity-20 transition-colors"
              style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.1em" }}
            >
              <ArrowLeft className="w-4 h-4" /> VOLTAR
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                disabled={!canNext}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.1em" }}
              >
                CONTINUAR <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white disabled:opacity-30 hover:scale-105 transition-transform"
                style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.1em" }}
              >
                {submitting ? "ENVIANDO..." : "IR PARA PAGAMENTO"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <PreviewMini data={data} />
        </aside>
      </div>

      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-50 p-6 flex flex-col"
            onClick={() => setPreviewOpen(false)}
          >
            <div className="max-w-xs w-full mx-auto">
              <PreviewMini data={data} />
            </div>
            <button
              onClick={() => setPreviewOpen(false)}
              className="mt-4 mx-auto px-6 py-2 rounded-full border border-white/20 text-white/70"
            >
              Fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h2
        className="text-white mb-2"
        style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 4vw, 2.3rem)", lineHeight: 1.2 }}
      >
        {title}
      </h2>
      <p className="text-white/50" style={{ fontFamily: "Lora, serif" }}>
        {subtitle}
      </p>
    </div>
  );
}
