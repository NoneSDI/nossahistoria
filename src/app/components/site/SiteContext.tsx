import { createContext, useContext, type ReactNode } from "react";
import type { LoveData } from "../../../lib/types";
import { THEMES } from "../../../lib/types";

const SiteContext = createContext<LoveData | null>(null);

export function SiteProvider({ data, children }: { data: LoveData; children: ReactNode }) {
  return <SiteContext.Provider value={data}>{children}</SiteContext.Provider>;
}

export function useSite(): LoveData {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export function useThemeAccent() {
  const { theme } = useSite();
  return THEMES[theme] ?? THEMES.rose;
}
