import { supabase, supabaseConfigured, STORAGE_BUCKET, photoPublicUrl } from "./supabase";
import { toSlug } from "./slug";
import type { Draft, LoveData, Payment } from "./types";

export async function submitDraft(
  data: LoveData,
  email: string
): Promise<{ draftId: string; slug: string }> {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase não está configurado. Crie um arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
    );
  }

  const slug = toSlug(data.person1, data.person2);

  const { data: draft, error: draftErr } = await supabase
    .from("drafts")
    .insert({
      slug,
      person1: data.person1,
      person2: data.person2,
      start_date: data.startDate,
      story: data.story,
      music_url: data.musicUrl || null,
      theme: data.theme,
      photos: [],
      email,
      special_title: data.specialTitle || null,
      special_date: data.specialDate || null,
      signature: data.signature || null,
      status: "pending",
    })
    .select()
    .single();

  if (draftErr || !draft) throw new Error(draftErr?.message || "Erro ao criar rascunho");

  const uploadedPaths: string[] = [];
  for (let i = 0; i < data.photos.length; i++) {
    const src = data.photos[i];
    if (src.startsWith("http")) {
      uploadedPaths.push(src);
      continue;
    }
    const blob = await dataUrlToBlob(src);
    const ext = blob.type.split("/")[1] || "jpg";
    const path = `${draft.id}/photo-${i}.${ext}`;
    const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
      contentType: blob.type,
      upsert: true,
    });
    if (upErr) throw new Error(`Erro ao subir foto ${i + 1}: ${upErr.message}`);
    uploadedPaths.push(path);
  }

  const { error: updErr } = await supabase
    .from("drafts")
    .update({ photos: uploadedPaths })
    .eq("id", draft.id);
  if (updErr) throw new Error(updErr.message);

  return { draftId: draft.id, slug: draft.slug };
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function getDraft(id: string): Promise<Draft | null> {
  const { data, error } = await supabase.from("drafts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Draft | null;
}

export async function getDraftBySlug(slug: string): Promise<Draft | null> {
  const { data, error } = await supabase.from("drafts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Draft | null;
}

export async function getLatestPayment(draftId: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("draft_id", draftId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Payment | null;
}

export function draftToLoveData(draft: Draft): LoveData {
  return {
    id: draft.id,
    slug: draft.slug || undefined,
    person1: draft.person1,
    person2: draft.person2,
    startDate: draft.start_date,
    story: draft.story || "",
    musicUrl: draft.music_url || undefined,
    theme: draft.theme,
    photos: (draft.photos || []).map((p: string) => photoPublicUrl(p)),
    specialTitle: draft.special_title || undefined,
    specialDate: draft.special_date || undefined,
    signature: draft.signature || undefined,
  };
}

export async function createPayment(
  draftId: string
): Promise<{ init_point: string; preference_id: string }> {
  const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`;
  const res = await fetch(fnUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ draftId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao criar pagamento: ${text}`);
  }
  return res.json();
}
