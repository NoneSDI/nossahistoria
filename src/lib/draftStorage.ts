import type { LoveData } from "./types";

const KEY = "love_site_draft";

export function saveLocalDraft(data: Partial<LoveData>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function loadLocalDraft(): Partial<LoveData> | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearLocalDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
