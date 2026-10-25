const KEY = "bizim_state_v1";

export function loadLocal(): any | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocal(state: any) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* kota dolu olabilir */
  }
}

export function clearLocal() {
  localStorage.removeItem(KEY);
}

export function makeCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

export async function createCouple(code: string, state: any) {
  const r = await fetch("/api/couple", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, state }),
  });
  if (!r.ok) throw new Error("Sunucuya ulaşılamadı");
  return r.json();
}

export async function fetchState(code: string) {
  const r = await fetch(`/api/state/${code}`);
  if (!r.ok) return null;
  const j = await r.json();
  return j.state ?? null;
}

export async function pushState(state: any) {
  const r = await fetch(`/api/state/${state.code}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });
  if (!r.ok) return null;
  return r.json();
}
