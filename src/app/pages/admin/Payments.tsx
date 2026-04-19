import { useEffect, useState } from "react";
import { Loader2, Search, RefreshCw } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { StatusBadge } from "./Dashboard";
import { supabase } from "../../../lib/supabase";

function formatBRL(n: number) {
  return (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AdminPayments() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    let query = supabase
      .from("payments")
      .select(
        "id, draft_id, status, amount, payer_email, mp_payment_id, created_at, drafts(person1, person2, slug, email)"
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setRows((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const filtered = rows.filter((r) => {
    if (!q.trim()) return true;
    const hay = `${r.drafts?.person1} ${r.drafts?.person2} ${r.payer_email} ${r.mp_payment_id}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl">
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1
              className="text-white mb-1"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem" }}
            >
              Pagamentos
            </h1>
            <p className="text-white/50 text-sm">{filtered.length} resultado(s)</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar casal, e-mail, payment id..."
                className="pl-9 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm w-72 focus:outline-none focus:border-rose-400/50"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="approved">Aprovados</option>
              <option value="pending">Pendentes</option>
              <option value="in_process">Em análise</option>
              <option value="rejected">Recusados</option>
              <option value="cancelled">Cancelados</option>
            </select>
            <button
              onClick={load}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-white/40 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-5 py-3 font-normal">Casal</th>
                    <th className="px-5 py-3 font-normal">Status</th>
                    <th className="px-5 py-3 font-normal">Valor</th>
                    <th className="px-5 py-3 font-normal">E-mail</th>
                    <th className="px-5 py-3 font-normal">MP ID</th>
                    <th className="px-5 py-3 font-normal">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-white/30">
                        Nenhum resultado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr key={p.id} className="border-t border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white/80">
                          <div>
                            {p.drafts?.person1} &amp; {p.drafts?.person2}
                          </div>
                          {p.drafts?.slug && (
                            <a
                              href={`/love/${p.drafts.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-rose-400/70 text-xs hover:underline"
                            >
                              /{p.drafts.slug}
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-5 py-3 text-white/70">{formatBRL(p.amount)}</td>
                        <td className="px-5 py-3 text-white/50 truncate max-w-[180px]">
                          {p.payer_email || p.drafts?.email || "—"}
                        </td>
                        <td className="px-5 py-3 text-white/40 text-xs">{p.mp_payment_id || "—"}</td>
                        <td className="px-5 py-3 text-white/40">
                          {new Date(p.created_at).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
