import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { QUIZ } from "../data/quiz";
import { randomOf } from "../lib/utils";

export default function Quiz({ onExit, onFinish }: { onExit: () => void; onFinish: (score: number) => void }) {
  const [qs] = useState(() => {
    const pool = [...QUIZ].sort(() => Math.random() - 0.5).slice(0, 8);
    return pool;
  });
  const [i, setI] = useState(0);
  const [pick1, setPick1] = useState<number | null>(null);
  const [pick2, setPick2] = useState<number | null>(null);
  const [phase, setPhase] = useState<"p1" | "p2" | "reveal">("p1");
  const [bothCorrect, setBoth] = useState(0);

  const q = qs[i];

  const choose = (idx: number) => {
    if (phase === "p1") {
      setPick1(idx);
      setPhase("p2");
    } else {
      setPick2(idx);
      setPhase("reveal");
      if (idx === q.correct && pick1 === q.correct) setBoth((b) => b + 1);
    }
  };

  const next = () => {
    if (i + 1 >= qs.length) {
      onFinish(bothCorrect);
      return;
    }
    setI(i + 1);
    setPick1(null);
    setPick2(null);
    setPhase("p1");
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-3 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full glass">
          {i + 1} / {qs.length} · {phase === "p1" ? "1. SIRA" : phase === "p2" ? "2. SIRA" : "SONUÇ"}
        </span>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
          💞 {bothCorrect}
        </span>
      </div>

      <div className="glass rounded-[24px] p-6 mb-5">
        <p className="text-xl font-extrabold leading-snug">{q.q}</p>
      </div>

      <div className="flex-1 grid grid-cols-1 gap-2.5 content-start">
        {q.options.map((o, idx) => {
          const isCorrect = idx === q.correct;
          const show = phase === "reveal";
          return (
            <motion.button
              key={o}
              whileTap={{ scale: 0.97 }}
              disabled={phase === "reveal"}
              onClick={() => choose(idx)}
              className="glass rounded-2xl p-4 text-left font-bold text-sm flex items-center justify-between"
              style={
                show && isCorrect
                  ? { borderColor: "var(--ok)", background: "color-mix(in srgb, var(--ok) 12%, transparent)" }
                  : undefined
              }
            >
              {o}
              {show && isCorrect && <span>✅</span>}
              {show && idx === pick1 && !isCorrect && <span>1✗</span>}
              {show && idx === pick2 && !isCorrect && <span>2✗</span>}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            {pick1 === q.correct && pick2 === q.correct && (
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-lg font-extrabold pb-2">
                💥 İkiniz de bildiniz!
              </motion.p>
            )}
            <button onClick={next} className="btn-grad w-full rounded-2xl py-4 font-extrabold">
              {i + 1 >= qs.length ? "Yarışı bitir 🏁" : "Sonraki soru →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
