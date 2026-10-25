import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Palette, Download, RotateCcw, Copy, Check, LogOut } from "lucide-react";
import { useStore } from "../lib/store";
import { daysTogether } from "../lib/utils";
import type { Theme } from "../lib/types";
import Sheet from "../components/Sheet";

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: "dark", label: "Gece", emoji: "🌌" },
  { id: "romantic", label: "Romantik", emoji: "🌸" },
  { id: "light", label: "Aydınlık", emoji: "☀️" },
];

const BADGES: { id: string; name: string; emoji: string; check: (c: any) => boolean }[] = [
  { id: "start", name: "İlk adım", emoji: "🌱", check: (c) => true },
  { id: "task1", name: "İlk görev", emoji: "✅", check: (c) => c.tasks.some((t: any) => t.done) },
  { id: "task10", name: "10 görev", emoji: "🏆", check: (c) => c.tasks.filter((t: any) => t.done).length >= 10 },
  { id: "game1", name: "İlk oyun", emoji: "🎮", check: (c) => c.scores.filter((s: any) => !s.game.startsWith("WATCH:")).length >= 1 },
  { id: "game10", name: "10 oyun", emoji: "🏅", check: (c) => c.scores.filter((s: any) => !s.game.startsWith("WATCH:")).length >= 10 },
  { id: "photo1", name: "İlk anı", emoji: "📸", check: (c) => c.photos.length >= 1 },
  { id: "photo10", name: "10 anı", emoji: "🎞️", check: (c) => c.photos.length >= 10 },
  { id: "heart1", name: "Kalp gönder", emoji: "💗", check: (c) => c.hearts.length >= 1 },
  { id: "heart50", name: "50 kalp", emoji: "💖", check: (c) => c.hearts.length >= 50 },
  { id: "day100", name: "100 gün", emoji: "💯", check: (c) => daysTogether(c.startDate).days >= 100 },
  { id: "day365", name: "1 yıl!", emoji: " anniversary", check: (c) => daysTogether(c.startDate).days >= 365 },
  { id: "msg10", name: "10 not", emoji: "💌", check: (c) => c.messages.length >= 10 },
  { id: "surprise5", name: "5 sürpriz", emoji: "🎁", check: (c) => c.surprises.length >= 5 },
  { id: "shop1", name: "Alışverişçi", emoji: "🛒", check: (c) => c.shopping.length >= 5 },
  { id: "goal1", name: "Hedef koyucu", emoji: "🎯", check: (c) => c.goals.length >= 1 },
];

export default function Profile() {
  const { state, update, reset } = useStore();
  const [copyOk, setCopyOk] = useState(false);
  const [resetAsk, setResetAsk] = useState(false);

  const c = state!;
  const t = daysTogether(c.startDate);

  const earned = useMemo(() => BADGES.filter((b) => b.check(c)), [c]);

  const stats = useMemo(() => {
    const games = c.scores.filter((s) => !s.game.startsWith("WATCH:"));
    const wins1 = games.filter((g) => g.winner === "p1").length;
    const wins2 = games.filter((g) => g.winner === "p2").length;
    return { games: games.length, wins1, wins2 };
  }, [c.scores]);

  const backup = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `bizim-yedek-${c.code}.json`;
    a.click();
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(c.code);
    } catch {
      /* yok say */
    }
    setCopyOk(true);
    setTimeout(() => setCopyOk(false), 1500);
  };

  return (
    <div className="px-5 pt-4 pb-28 space-y-4">
      {/* Çift kartı */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[28px] p-6 text-center relative overflow-hidden">
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-3xl opacity-25" style={{ background: "var(--grad)" }} />
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-5xl">{c.p1.avatar}</span>
          <span className="text-2xl">💕</span>
          <span className="text-5xl">{c.p2.avatar}</span>
        </div>
        <p className="text-xl font-extrabold">{c.p1.name} & {c.p2.name}</p>
        <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-2)" }}>{t.days} gündür birlikte</p>
        <button onClick={copyCode} className="mt-3 glass rounded-full px-4 py-2 text-xs font-bold inline-flex items-center gap-2">
          {copyOk ? <><Check size={14} /> Kopyalandı</> : <><Copy size={14} /> Davet kodu: {c.code}</>}
        </button>
      </motion.div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Tamamlanan görev", value: c.tasks.filter((x) => x.done).length, emoji: "✅" },
          { label: "Oynanan oyun", value: stats.games, emoji: "🎮" },
          { label: "Eklenen anı", value: c.photos.length, emoji: "📸" },
          { label: "Gönderilen kalp", value: c.hearts.length, emoji: "💗" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-[22px] p-4">
            <p className="text-2xl">{s.emoji}</p>
            <p className="text-2xl font-extrabold grad-text mt-1">{s.value}</p>
            <p className="text-[11px] font-semibold" style={{ color: "var(--text-2)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Oyun skorları */}
      {stats.games > 0 && (
        <div className="glass rounded-[22px] p-5">
          <h3 className="font-extrabold mb-2">Oyun skorları 🏆</h3>
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="text-center">
              <p className="text-3xl font-extrabold grad-text">{stats.wins1}</p>
              <p className="text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{c.p1.avatar} {c.p1.name}</p>
            </div>
            <p className="text-sm font-bold" style={{ color: "var(--text-2)" }}>vs</p>
            <div className="text-center">
              <p className="text-3xl font-extrabold grad-text">{stats.wins2}</p>
              <p className="text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{c.p2.avatar} {c.p2.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rozetler */}
      <div className="glass rounded-[22px] p-5">
        <h3 className="font-extrabold mb-3">Rozetler ({earned.length}/{BADGES.length}) 🏅</h3>
        <div className="grid grid-cols-5 gap-2.5">
          {BADGES.map((b) => {
            const has = earned.some((e) => e.id === b.id);
            return (
              <div key={b.id} className="flex flex-col items-center gap-1" title={b.name}>
                <span className={`text-2xl w-12 h-12 rounded-2xl flex items-center justify-center ${has ? "" : "grayscale opacity-30"}`} style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  {b.id === "day365" ? "🎉" : b.emoji}
                </span>
                <span className="text-[9px] font-bold text-center leading-tight" style={{ color: "var(--text-2)" }}>{b.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tema */}
      <div className="glass rounded-[22px] p-5">
        <h3 className="font-extrabold mb-3 flex items-center gap-2"><Palette size={16} /> Tema</h3>
        <div className="flex gap-2">
          {THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => update((s) => ({ ...s, theme: th.id }))}
              className="flex-1 py-3 rounded-2xl text-sm font-bold flex flex-col items-center gap-1"
              style={c.theme === th.id ? { background: "var(--grad)", color: "#fff" } : { background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}
            >
              <span className="text-xl">{th.emoji}</span>
              {th.label}
            </button>
          ))}
        </div>
      </div>

      {/* Veri */}
      <div className="glass rounded-[22px] p-5 space-y-3">
        <h3 className="font-extrabold">Veri 🗂️</h3>
        <button onClick={backup} className="w-full glass rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2">
          <Download size={17} /> Yedeği indir (JSON)
        </button>
        <button onClick={() => setResetAsk(true)} className="w-full rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2" style={{ background: "color-mix(in srgb, var(--danger) 14%, transparent)", color: "var(--danger)", border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)" }}>
          <LogOut size={17} /> Çifti sıfırla
        </button>
      </div>

      <Sheet open={resetAsk} onClose={() => setResetAsk(false)} title="Emin misin?">
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-2)" }}>
          Tüm görevler, anılar, skorlar silinecek. Bu geri alınamaz!
        </p>
        <div className="flex gap-2 pb-2">
          <button onClick={() => setResetAsk(false)} className="flex-1 glass rounded-2xl py-3.5 font-extrabold">Vazgeç</button>
          <button onClick={() => { reset(); setResetAsk(false); }} className="flex-1 rounded-2xl py-3.5 font-extrabold" style={{ background: "var(--danger)", color: "#fff" }}>
            Sıfırla
          </button>
        </div>
      </Sheet>
    </div>
  );
}
