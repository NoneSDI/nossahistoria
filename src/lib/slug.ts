export function toSlug(person1: string, person2: string): string {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 30);

  const a = normalize(person1) || "amor";
  const b = normalize(person2) || "amor";
  const rand = Math.random().toString(36).slice(2, 6);
  return `${a}-e-${b}-${rand}`;
}

export function daysSince(iso: string): { days: number; hours: number; minutes: number; seconds: number } {
  const start = new Date(iso + "T00:00:00").getTime();
  const diff = Date.now() - start;
  if (isNaN(diff) || diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
