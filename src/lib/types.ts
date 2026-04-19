export type Theme = "rose" | "amber" | "violet" | "emerald" | "midnight";

export interface LoveData {
  id?: string;
  slug?: string;
  person1: string;
  person2: string;
  startDate: string;
  story: string;
  photos: string[];
  musicUrl?: string;
  theme: Theme;
  specialTitle?: string;
  specialDate?: string;
  signature?: string;
}

export interface Draft {
  id: string;
  slug: string | null;
  person1: string;
  person2: string;
  start_date: string;
  story: string | null;
  music_url: string | null;
  theme: Theme;
  photos: string[];
  email: string | null;
  special_title: string | null;
  special_date: string | null;
  signature: string | null;
  status: "pending" | "paid" | "published";
  created_at: string;
}

export interface Payment {
  id: string;
  draft_id: string;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled" | "in_process";
  amount: number;
  payer_email: string | null;
  raw: any;
  created_at: string;
  updated_at: string;
}

export const PRICE_BRL = 1;

export const THEMES: Record<Theme, { label: string; gradient: string; accent: string }> = {
  rose: { label: "Rosa Clássico", gradient: "from-rose-500 to-pink-600", accent: "#f43f5e" },
  amber: { label: "Dourado", gradient: "from-amber-400 to-orange-500", accent: "#f59e0b" },
  violet: { label: "Violeta", gradient: "from-violet-500 to-purple-600", accent: "#a855f7" },
  emerald: { label: "Esmeralda", gradient: "from-emerald-400 to-teal-500", accent: "#10b981" },
  midnight: { label: "Meia-noite", gradient: "from-indigo-500 to-blue-600", accent: "#6366f1" },
};
