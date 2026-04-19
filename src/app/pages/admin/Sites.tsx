import { useEffect, useState } from "react";
import { Loader2, Search, ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { StatusBadge } from "./Dashboard";
import { supabase } from "../../../lib/supabase";

export function AdminSites() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    let query = supabase
      .from("drafts")
      .select("id, slug, person1, person2, email, status, theme, created_at, photos")
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

  const del = async (id: string) => {
    if (!confirm("Deletar este site permanentemente? Essa ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("drafts").delete().eq("id", id);
    if (error) alert(error.message);
    else load();
  };

  const publish = async (id: string) => {
    const { error } = await supabase.from("drafts").update({ status: "published" }).eq("id", id);
    if (error) alert(error.message);
    else load();
  };

  const filtered = rows.filter((r) => {
    if (!q.trim()) return true;
    const hay = `${r.person1} ${r.person2} ${r.slug} ${r.email}`.toLowerCase();
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
              Sites
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
                placeholder="Buscar casal, slug, e-mail..."
                className="pl-9 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm w-72 focus:outline-none focus:border-rose-400/50"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="paid">Pagos</option>
              <option value="published">Publicados</option>
              <option value="pending">Pendentes</option>
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
                    <th className="px-5 py-3 font-normal">Slug</th>
                    <th className="px-5 py-3 font-normal">Status</th>
                    <th className="px-5 py-3 font-normal">Fotos</th>
                    <th className="px-5 py-3 font-normal">Tema</th>
                    <th className="px-5 py-3 font-normal">E-mail</th>
                    <th className="px-5 py-3 font-normal">Criado</th>
                    <th className="px-5 py-3 font-normal">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-white/30">
                        Nenhum resultado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id} className="border-t border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white/80">
                          {r.person1} &amp; {r.person2}
                        </td>
                        <td className="px-5 py-3 text-white/50 font-mono text-xs">
                          {r.slug || "—"}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-5 py-3 text-white/60">{(r.photos || []).length}</td>
                        <td className="px-5 py-3 text-white/60">{r.theme}</td>
                        <td className="px-5 py-3 text-white/50 truncate max-w-[160px]">
                          {r.email || "—"}
                        </td>
                        <td className="px-5 py-3 text-white/40 text-xs">
                          {new Date(r.created_at).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            {(r.status === "paid" || r.status === "published") && r.slug && (
                              <a
                                href={`/love/${r.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded hover:bg-white/5 text-white/60 hover:text-rose-300"
                                title="Abrir site"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {r.status === "paid" && (
                              <button
                                onClick={() => publish(r.id)}
                                className="text-xs text-rose-300 hover:text-rose-200 px-2 py-1"
                              >
                                Publicar
                              </button>
                            )}
                            <button
                              onClick={() => del(r.id)}
                              className="p-1.5 rounded hover:bg-rose-500/15 text-white/60 hover:text-rose-300"
                              title="Deletar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
