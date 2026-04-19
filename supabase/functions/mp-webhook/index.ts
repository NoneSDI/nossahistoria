// Supabase Edge Function: mp-webhook
// Receives Mercado Pago notifications and updates payment + draft status.
// Configured as the "notification_url" in the preference and/or in the
// Mercado Pago Developer dashboard > Webhooks.
//
// Env vars: MP_ACCESS_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

// @ts-ignore
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    // @ts-ignore
    const mpToken = Deno.env.get("MP_ACCESS_TOKEN")!;
    // @ts-ignore
    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    // @ts-ignore
    const supaKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const url = new URL(req.url);
    const queryType = url.searchParams.get("type") || url.searchParams.get("topic");
    const queryId = url.searchParams.get("data.id") || url.searchParams.get("id");

    let type: string | null = queryType;
    let paymentId: string | null = queryId;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        type = type || body?.type || body?.topic || null;
        paymentId = paymentId || body?.data?.id || body?.id || null;
      } catch {}
    }

    if (!paymentId) return new Response("no id", { status: 200, headers: CORS });
    if (type && type !== "payment") return new Response("ignored", { status: 200, headers: CORS });

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
    });
    if (!mpRes.ok) {
      const t = await mpRes.text();
      console.error("mp fetch err", t);
      return new Response("mp err", { status: 200, headers: CORS });
    }
    const mp = await mpRes.json();

    const draftId = mp.external_reference || mp.metadata?.draft_id;
    if (!draftId) return new Response("no draft ref", { status: 200, headers: CORS });

    const status = normalizeStatus(mp.status);
    const supa = createClient(supaUrl, supaKey);

    const { data: existing } = await supa
      .from("payments")
      .select("id")
      .eq("mp_payment_id", String(paymentId))
      .maybeSingle();

    if (existing) {
      await supa
        .from("payments")
        .update({
          status,
          payer_email: mp.payer?.email ?? null,
          raw: mp,
        })
        .eq("id", existing.id);
    } else {
      const { data: pending } = await supa
        .from("payments")
        .select("id")
        .eq("draft_id", draftId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pending) {
        await supa
          .from("payments")
          .update({
            mp_payment_id: String(paymentId),
            status,
            payer_email: mp.payer?.email ?? null,
            raw: mp,
          })
          .eq("id", pending.id);
      } else {
        await supa.from("payments").insert({
          draft_id: draftId,
          mp_payment_id: String(paymentId),
          status,
          amount: mp.transaction_amount ?? 0,
          payer_email: mp.payer?.email ?? null,
          raw: mp,
        });
      }
    }

    if (status === "approved") {
      await supa
        .from("drafts")
        .update({ status: "paid" })
        .eq("id", draftId)
        .in("status", ["pending"]);
    }

    return new Response("ok", { status: 200, headers: CORS });
  } catch (e) {
    console.error(e);
    return new Response("ok", { status: 200, headers: CORS });
  }
});

function normalizeStatus(s: string): string {
  const map: Record<string, string> = {
    approved: "approved",
    authorized: "approved",
    in_process: "in_process",
    in_mediation: "in_process",
    pending: "pending",
    rejected: "rejected",
    cancelled: "cancelled",
    refunded: "refunded",
    charged_back: "refunded",
  };
  return map[s] ?? "pending";
}
