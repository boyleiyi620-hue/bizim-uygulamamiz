export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function daysTogether(startDate: string) {
  const start = new Date(startDate + "T00:00:00");
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor(diff / 1000),
  };
}

export function daysUntilNext(monthDay: string) {
  const [m, d] = monthDay.split("-").map(Number);
  const now = new Date();
  let next = new Date(now.getFullYear(), m - 1, d);
  if (next.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
    next = new Date(now.getFullYear() + 1, m - 1, d);
  }
  const diff = Math.ceil(
    (next.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86400000
  );
  return diff;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function pickDaily<T>(list: T[], seedStr: string): T {
  const d = new Date();
  const seed = Number(d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate());
  let h = seed;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) % 100000;
  return list[h % list.length];
}

export function randomOf<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
