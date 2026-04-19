// Supabase Edge Function: create-payment
// Creates a Mercado Pago Checkout Pro preference and returns the init_point URL.
//
// Env vars required (set in Supabase dashboard > Edge Functions > Secrets):
//   MP_ACCESS_TOKEN    — Mercado Pago access token (TEST-... or APP_USR-...)
//   SUPABASE_URL       — Auto-injected
//   SUPABASE_SERVICE_ROLE_KEY — Auto-injected (used as service role)
//   PUBLIC_SITE_URL    — e.g. https://yourdomain.com (for back_urls)
//   PRICE_BRL          — e.g. "19.90" (optional, defaults to 19.90)
//
// deno-lint-ignore-file

// @ts-ignore Deno import
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const { draftId } = await req.json();
    if (!draftId) return json({ error: "missing draftId" }, 400);

    // @ts-ignore
    const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
    // @ts-ignore
    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    // @ts-ignore
    const supaKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // @ts-ignore
    const publicSite = Deno.env.get("PUBLIC_SITE_URL") ?? "https://example.com";
    // @ts-ignore
    const price = Number(Deno.env.get("PRICE_BRL") ?? "19.90");

    if (!mpToken) return json({ error: "MP_ACCESS_TOKEN not set" }, 500);

    const supa = createClient(supaUrl, supaKey);

    const { data: draft, error } = await supa
      .from("drafts")
      .select("id, person1, person2, email, slug")
      .eq("id", draftId)
      .maybeSingle();

    if (error || !draft) return json({ error: "draft not found" }, 404);

    const prefBody = {
      items: [
        {
          id: draft.id,
          title: `Site romântico: ${draft.person1} e ${draft.person2}`,
          description: "Página romântica personalizada com link único vitalício.",
          quantity: 1,
          currency_id: "BRL",
          unit_price: price,
        },
      ],
      payer: draft.email ? { email: draft.email } : undefined,
      back_urls: {
        success: `${publicSite}/sucesso/${draft.id}`,
        pending: `${publicSite}/sucesso/${draft.id}`,
        failure: `${publicSite}/checkout/${draft.id}?failed=1`,
      },
      auto_return: "approved",
      external_reference: draft.id,
      notification_url: `${supaUrl}/functions/v1/mp-webhook`,
      statement_descriptor: "NOSSOHISTORIA",
      metadata: { draft_id: draft.id, slug: draft.slug },
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mpToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prefBody),
    });

    const mpData = await mpRes.json();
    if (!mpRes.ok) {
      return json({ error: "mp error", details: mpData }, 500);
    }

    await supa.from("payments").insert({
      draft_id: draft.id,
      mp_preference_id: mpData.id,
      amount: price,
      payer_email: draft.email,
      status: "pending",
      raw: { preference: mpData },
    });

    return json({
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
      preference_id: mpData.id,
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
