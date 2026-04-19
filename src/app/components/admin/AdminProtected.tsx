import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { supabase, supabaseConfigured } from "../../../lib/supabase";

export function AdminProtected({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"checking" | "ok" | "redirect">("checking");

  useEffect(() => {
    if (!supabaseConfigured) {
      setStatus("redirect");
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setStatus("redirect");
        return;
      }
      const { data: admin } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();
      if (!admin) {
        await supabase.auth.signOut();
        setStatus("redirect");
        return;
      }
      setStatus("ok");
    });
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
      </div>
    );
  }
  if (status === "redirect") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
