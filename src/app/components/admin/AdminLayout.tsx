import { Link, useLocation, useNavigate } from "react-router";
import type { ReactNode } from "react";
import { Heart, LayoutDashboard, CreditCard, Globe, LogOut } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export function AdminLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const nav = useNavigate();

  const links = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/payments", icon: CreditCard, label: "Pagamentos" },
    { to: "/admin/sites", icon: Globe, label: "Sites" },
  ];

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <aside className="w-60 shrink-0 border-r border-white/[0.06] bg-black/40 flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
            <span style={{ fontFamily: "Great Vibes, cursive", fontSize: "1.4rem" }}>admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  active ? "bg-rose-500/15 text-rose-200" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto">{children}</main>
    </div>
  );
}
