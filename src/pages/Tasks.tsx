import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Target, ShoppingCart, ListChecks } from "lucide-react";
import { useStore } from "../lib/store";
import { uid, todayStr } from "../lib/utils";
import Sheet from "../components/Sheet";
import Confetti from "../components/Confetti";

type Seg = "tasks" | "goals" | "shopping";

const CATS = ["Ev", "Randevu", "Sürpriz", "Sağlık", "Hedef", "Alışveriş"];

export default function Tasks() {
  const { state, update } = useStore();
  const [seg, setSeg] = useState<Seg>("tasks");
  const [sheet, setSheet] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState(CATS[0]);
  const [assignee, setAssignee] = useState<"p1" | "p2" | "both">("both");
  const [goalSheet, setGoalSheet] = useState(false);
  const [gTitle, setGTitle] = useState("");
  const [gTarget, setGTarget] = useState("10");
  const [gUnit, setGUnit] = useState("");
  const [gEmoji, setGEmoji] = useState("🎯");
  const [shopInput, setShopInput] = useState("");

  const tasks = state!.tasks;
  const doneCount = tasks.filter((t) => t.done).length;
  const todayDone = tasks.filter((t) => t.doneAt?.slice(0, 10) === todayStr()).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const streak = useMemo(() => {
    const days = new Set(tasks.filter((t) => t.done).map((t) => t.doneAt!.slice(0, 10)));
    let s = 0;
    const d = new Date();
    while (days.has(d.toISOString().slice(0, 10))) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return;
    update((s) => ({
      ...s,
      tasks: [{ id: uid(), title: title.trim(), category: cat, assignee, done: false, createdAt: new Date().toISOString() }, ...s.tasks],
    }));
    setTitle("");
    setSheet(false);
  };

  const toggleTask = (id: string) => {
    const wasDone = tasks.find((t) => t.id === id)?.done;
    update((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : undefined } : t
      ),
    }));
    if (!wasDone) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1800);
    }
  };

  const del = (kind: "task" | "goal" | "shop", id: string) => {
    update((s) => {
      const n = { ...s };
      if (kind === "task") n.tasks = s.tasks.filter((x) => x.id !== id);
      if (kind === "goal") n.goals = s.goals.filter((x) => x.id !== id);
      if (kind === "shop") n.shopping = s.shopping.filter((x) => x.id !== id);
      return n;
    });
  };

  const addGoal = () => {
    if (!gTitle.trim()) return;
    update((s) => ({
      ...s,
      goals: [...s.goals, { id: uid(), title: gTitle.trim(), current: 0, target: Number(gTarget) || 10, unit: gUnit.trim() || "kez", emoji: gEmoji }],
    }));
    setGTitle(""); setGUnit(""); setGoalSheet(false);
  };

  const bumpGoal = (id: string, dir: 1 | -1) => {
    update((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, current: Math.max(0, Math.min(g.target, g.current + dir)) } : g)),
    }));
  };

  const addShop = () => {
    if (!shopInput.trim()) return;
    update((s) => ({ ...s, shopping: [...s.shopping, { id: uid(), title: shopInput.trim(), done: false }] }));
    setShopInput("");
  };

  const segs: { id: Seg; label: string; icon: any }[] = [
    { id: "tasks", label: "Görevler", icon: ListChecks },
    { id: "goals", label: "Hedefler", icon: Target },
    { id: "shopping", label: "Alışveriş", icon: ShoppingCart },
  ];

  const assignLabel = (a: "p1" | "p2" | "both") =>
    a === "both" ? `💞 ${state!.p1.name} & ${state!.p2.name}` : a === "p1" ? `${state!.p1.avatar} ${state!.p1.name}` : `${state!.p2.avatar} ${state!.p2.name}`;

  return (
    <div className="px-5 pt-4 pb-28">
      <Confetti show={confetti} />

      <h1 className="text-2xl font-extrabold mb-1">Görevler ✅</h1>
      <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
        {doneCount}/{tasks.length} tamamlandı · 🔥 {streak} günlük seri
      </p>

      {/* Segmented */}
      <div className="glass rounded-full p-1 flex mb-5">
        {segs.map((sg) => {
          const Icon = sg.icon;
          const on = seg === sg.id;
          return (
            <button
              key={sg.id}
              onClick={() => setSeg(sg.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-extrabold relative"
              style={{ color: on ? "#fff" : "var(--text-2)" }}
            >
              {on && <motion.span layoutId="seg-bg" className="absolute inset-0 rounded-full" style={{ background: "var(--grad)" }} transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
              <span className="relative flex items-center gap-1.5"><Icon size={14} /> {sg.label}</span>
            </button>
          );
        })}
      </div>

      {seg === "tasks" && (
        <>
          {tasks.length > 0 && (
            <div className="glass rounded-[22px] p-4 mb-4 flex items-center gap-4">
              <div className="ring-progress w-14 h-14 rounded-full flex items-center justify-center" style={{ ["--p" as any]: pct }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-extrabold" style={{ background: "var(--card-solid)" }}>{pct}%</div>
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-sm">Ortak ilerleme</p>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>bugün {todayDone} görev bitti</p>
              </div>
              <button onClick={() => setSheet(true)} className="btn-grad rounded-2xl p-3"><Plus size={20} /></button>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="glass rounded-[22px] p-8 text-center mb-4">
              <p className="text-4xl mb-2">📋</p>
              <p className="font-bold text-sm mb-4">Henüz görev yok, ilki sizinkin olsun</p>
              <button onClick={() => setSheet(true)} className="btn-grad rounded-2xl px-6 py-3 font-extrabold text-sm inline-flex items-center gap-2">
                <Plus size={18} /> Görev ekle
              </button>
            </div>
          )}

          <div className="space-y-2.5">
            <AnimatePresence>
              {tasks.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  className="glass rounded-2xl p-4 flex items-center gap-3"
                >
                  <button onClick={() => toggleTask(t.id)} className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2" style={{ borderColor: t.done ? "var(--ok)" : "var(--border)", background: t.done ? "var(--ok)" : "transparent" }}>
                    {t.done && <Check size={16} color="#fff" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${t.done ? "line-through opacity-50" : ""}`}>{t.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-2)" }}>
                      {assignLabel(t.assignee)} · {t.category}
                    </p>
                  </div>
                  <button onClick={() => del("task", t.id)} className="p-2 opacity-60"><Trash2 size={16} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {tasks.length > 0 && (
            <button onClick={() => setSheet(true)} className="btn-grad w-full rounded-2xl py-3.5 mt-4 font-extrabold text-sm flex items-center justify-center gap-2">
              <Plus size={18} /> Görev ekle
            </button>
          )}
        </>
      )}

      {seg === "goals" && (
        <>
          <div className="space-y-3 mb-4">
            {state!.goals.length === 0 && (
              <div className="glass rounded-[22px] p-8 text-center">
                <p className="text-4xl mb-2">🎯</p>
                <p className="font-bold text-sm">Birlikte bir hedef koyun: birikim, spor, seyahat...</p>
              </div>
            )}
            {state!.goals.map((g) => {
              const p = Math.round((g.current / g.target) * 100);
              return (
                <div key={g.id} className="glass rounded-[22px] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-extrabold">{g.emoji} {g.title}</p>
                    <button onClick={() => del("goal", g.id)} className="p-1.5 opacity-60"><Trash2 size={15} /></button>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: "var(--border)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className="h-full rounded-full" style={{ background: "var(--grad)" }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold" style={{ color: "var(--text-2)" }}>{g.current} / {g.target} {g.unit} · %{p}</p>
                    <div className="flex gap-2">
                      <button onClick={() => bumpGoal(g.id, -1)} className="glass rounded-xl px-3 py-1.5 text-xs font-extrabold">−</button>
                      <button onClick={() => bumpGoal(g.id, 1)} className="btn-grad rounded-xl px-4 py-1.5 text-xs font-extrabold">+1</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setGoalSheet(true)} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold text-sm flex items-center justify-center gap-2">
            <Plus size={18} /> Hedef ekle
          </button>
        </>
      )}

      {seg === "shopping" && (
        <>
          <div className="flex gap-2 mb-4">
            <input value={shopInput} onChange={(e) => setShopInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addShop()} placeholder="Ürün ekle..." />
            <button onClick={addShop} className="btn-grad shrink-0 px-5 rounded-[14px] font-extrabold text-sm">Ekle</button>
          </div>
          <div className="space-y-2">
            {state!.shopping.length === 0 && (
              <div className="glass rounded-[22px] p-8 text-center">
                <p className="text-4xl mb-2">🛒</p>
                <p className="font-bold text-sm">Ortak alışveriş listesi boş</p>
              </div>
            )}
            {state!.shopping.map((it) => (
              <div key={it.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                <button
                  onClick={() => update((s) => ({ ...s, shopping: s.shopping.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)) }))}
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2"
                  style={{ borderColor: it.done ? "var(--ok)" : "var(--border)", background: it.done ? "var(--ok)" : "transparent" }}
                >
                  {it.done && <Check size={16} color="#fff" />}
                </button>
                <p className={`flex-1 font-bold text-sm ${it.done ? "line-through opacity-50" : ""}`}>{it.title}</p>
                <button onClick={() => del("shop", it.id)} className="p-2 opacity-60"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Görev ekle sheet */}
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Yeni görev">
        <div className="space-y-3 pb-2">
          <input placeholder="Görev başlığı" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className="px-3.5 py-1.5 rounded-full text-xs font-bold" style={c === cat ? { background: "var(--grad)", color: "#fff" } : { background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["p1", "p2", "both"] as const).map((a) => (
              <button key={a} onClick={() => setAssignee(a)} className="flex-1 py-2.5 rounded-2xl text-xs font-bold" style={a === assignee ? { background: "var(--grad)", color: "#fff" } : { background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                {assignLabel(a)}
              </button>
            ))}
          </div>
          <button onClick={addTask} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold">Ekle</button>
        </div>
      </Sheet>

      {/* Hedef ekle sheet */}
      <Sheet open={goalSheet} onClose={() => setGoalSheet(false)} title="Yeni hedef">
        <div className="space-y-3 pb-2">
          <div className="flex gap-2 flex-wrap">
            {["🎯", "💰", "✈️", "🏃", "📚", "🏠", "🎸", "💪"].map((e) => (
              <button key={e} onClick={() => setGEmoji(e)} className="text-2xl p-2 rounded-xl" style={e === gEmoji ? { background: "var(--card-solid)", border: "1px solid var(--accent)" } : {}}>
                {e}
              </button>
            ))}
          </div>
          <input placeholder="Hedef adı (örn: Tatil biriktirme)" value={gTitle} onChange={(e) => setGTitle(e.target.value)} />
          <div className="flex gap-2">
            <input placeholder="Hedef sayı" value={gTarget} onChange={(e) => setGTarget(e.target.value)} inputMode="numeric" />
            <input placeholder="Birim (örn: TL, gün)" value={gUnit} onChange={(e) => setGUnit(e.target.value)} />
          </div>
          <button onClick={addGoal} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold">Ekle</button>
        </div>
      </Sheet>
    </div>
  );
}
