import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Heart, Loader2 } from "lucide-react";
import { supabase, supabaseConfigured } from "../../../lib/supabase";
import { Field, TextInput } from "../../components/form/FormField";

export function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { data: admin } = await supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        if (admin) nav("/admin");
      }
    });
  }, [nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authErr) throw authErr;

      const { data: admin } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.session!.user.id)
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        throw new Error("Esta conta não é um administrador.");
      }

      nav("/admin");
    } catch (e: any) {
      setError(e?.message || "Erro ao entrar");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
          <span style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.5rem" }}>
            nossohistoria
          </span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h1
            className="text-white mb-2"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem" }}
          >
            Admin
          </h1>
          <p className="text-white/50 text-sm mb-6" style={{ fontFamily: "Lora, serif" }}>
            Entre com sua conta de administrador.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="E-mail">
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </Field>
            <Field label="Senha">
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            {error && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-rose-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ENTRAR"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Não é admin? <Link to="/" className="text-rose-400 hover:underline">Voltar ao site</Link>
        </p>
      </motion.div>
    </div>
  );
}
