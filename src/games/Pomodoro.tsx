import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";

const MODES = [
  { label: "Odak", mins: 25 },
  { label: "Mola", mins: 5 },
  { label: "Sprint", mins: 10 },
];

export default function Pomodoro({ onExit }: { onExit: () => void }) {
  const [modeIdx, setModeIdx] = useState(0);
  const [left, setLeft] = useState(MODES[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [running]);

  const total = MODES[modeIdx].mins * 60;
  const pct = ((total - left) / total) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-6 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <div className="flex gap-2 justify-center mb-10">
        {MODES.map((m, i) => (
          <button
            key={m.label}
            onClick={() => { setModeIdx(i); setLeft(m.mins * 60); setRunning(false); setDone(false); }}
            className="px-4 py-2 rounded-full text-xs font-extrabold"
            style={i === modeIdx ? { background: "var(--grad)", color: "#fff" } : { background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}
          >
            {m.label} · {m.mins}dk
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className="w-64 h-64 rounded-full flex flex-col items-center justify-center relative"
          style={{ background: `conic-gradient(var(--accent) ${pct}%, var(--card) 0)` }}
        >
          <div className="absolute inset-2.5 rounded-full flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
            {done ? (
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl">🎉</motion.p>
            ) : (
              <>
                <p className="text-6xl font-extrabold tracking-tight">{mm}:{ss}</p>
                <p className="text-sm font-bold mt-1" style={{ color: "var(--text-2)" }}>
                  birlikte {MODES[modeIdx].label.toLowerCase()}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button onClick={() => { setLeft(total); setRunning(false); setDone(false); }} className="glass rounded-2xl p-4">
            <RotateCcw size={22} />
          </button>
          <button onClick={() => setRunning((r) => !r)} className="btn-grad rounded-2xl px-12 py-4 font-extrabold flex items-center gap-2">
            {running ? <><Pause size={20} /> Duraklat</> : <><Play size={20} /> Başlat</>}
          </button>
        </div>
      </div>
    </div>
  );
}
