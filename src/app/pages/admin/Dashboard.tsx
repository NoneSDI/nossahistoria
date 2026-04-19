import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Users, Heart, CircleDollarSign, Loader2 } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router";

interface Stats {
  total_drafts: number;
  paid_drafts: number;
  pending_drafts: number;
  revenue_brl: number;
  paid_payments: number;
  pending_payments: number;
}

function formatBRL(n: number) {
  return (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: r }] = await Promise.all([
        supabase.from("admin_stats").select("*").maybeSingle(),
        supabase
          .from("payments")
          .select("id, draft_id, status, amount, payer_email, created_at, drafts(person1, person2, slug)")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);
      setStats(s as Stats);
      setRecent((r as any[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl">
        <div className="mb-8">
          <h1
            className="text-white mb-1"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem" }}
          >
            Dashboard
          </h1>
          <p className="text-white/50 text-sm" style={{ fontFamily: "Lora, serif" }}>
            Visão geral dos sites e pagamentos.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                icon={<CircleDollarSign className="w-4 h-4" />}
                label="Receita total"
                value={formatBRL(stats?.revenue_brl || 0)}
                accent="emerald"
              />
              <StatCard
                icon={<Heart className="w-4 h-4" />}
                label="Sites pagos"
                value={String(stats?.paid_drafts || 0)}
                accent="rose"
              />
              <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Rascunhos"
                value={String(stats?.pending_drafts || 0)}
                accent="amber"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4" />}
                label="Pagamentos confirmados"
                value={String(stats?.paid_payments || 0)}
                accent="violet"
              />
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <h2
                  className="text-white"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem" }}
                >
                  Pagamentos recentes
                </h2>
                <Link to="/admin/payments" className="text-rose-300 text-sm hover:underline">
                  Ver todos →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-white/40 text-xs uppercase tracking-widest">
                    <tr>
                      <th className="px-5 py-3 font-normal">Casal</th>
                      <th className="px-5 py-3 font-normal">Status</th>
                      <th className="px-5 py-3 font-normal">Valor</th>
                      <th className="px-5 py-3 font-normal">E-mail</th>
                      <th className="px-5 py-3 font-normal">Quando</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-white/30">
                          Ainda não há pagamentos.
                        </td>
                      </tr>
                    ) : (
                      recent.map((p, i) => (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-t border-white/[0.04] hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-3 text-white/80">
                            {p.drafts?.person1} &amp; {p.drafts?.person2}
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="px-5 py-3 text-white/70">{formatBRL(p.amount)}</td>
                          <td className="px-5 py-3 text-white/50 truncate max-w-[180px]">
                            {p.payer_email || "—"}
                          </td>
                          <td className="px-5 py-3 text-white/40">
                            {new Date(p.created_at).toLocaleString("pt-BR")}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  const colors: Record<string, string> = {
    rose: "text-rose-300 bg-rose-500/10",
    amber: "text-amber-300 bg-amber-500/10",
    emerald: "text-emerald-300 bg-emerald-500/10",
    violet: "text-violet-300 bg-violet-500/10",
  };
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[accent]}`}
      >
        {icon}
      </div>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-white" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem" }}>
        {value}
      </p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    approved: { label: "Aprovado", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    pending: { label: "Pendente", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    in_process: { label: "Em análise", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
    rejected: { label: "Recusado", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
    cancelled: { label: "Cancelado", cls: "bg-white/10 text-white/60 border-white/20" },
    refunded: { label: "Estornado", cls: "bg-white/10 text-white/60 border-white/20" },
    paid: { label: "Pago", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    published: { label: "Publicado", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  };
  const s = map[status] ?? { label: status, cls: "bg-white/10 text-white/60 border-white/20" };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full border text-xs uppercase tracking-widest ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
