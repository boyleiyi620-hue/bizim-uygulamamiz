const KEY = "bizim_me_device_v1";

export function getMyRole(): "p1" | "p2" | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "p1" || v === "p2") return v;
    return null;
  } catch {
    return null;
  }
}

export function setMyRole(role: "p1" | "p2" | null) {
  try {
    if (!role) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, role);
  } catch {}
}
