import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function TruthLie({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"write" | "guess" | "reveal">("write");
  const [s, setS] = useState(["", "", ""]);
  const [lieIdx, setLieIdx] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [score, setScore] = useState({ p1: 0, p2: 0 });

  const reset = (nextTurn: 1 | 2) => {
    setS(["", "", ""]);
    setLieIdx(null);
    setGuess(null);
    setTurn(nextTurn);
    setPhase("write");
  };

  const correct = guess === lieIdx;

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-3 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold px-3 py-1 rounded-full glass">
          {turn === 1 ? "1. OYUNCU" : "2. OYUNCU"} YAZIYOR
        </span>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
          {score.p1} — {score.p2}
        </span>
      </div>

      <p className="text-sm mb-3" style={{ color: "var(--text-2)" }}>
        {phase === "write"
          ? "3 madde yaz: 2'si doğru, 1'i yalan. Hangisi yalan sadece sen bileceksin."
          : phase === "guess"
          ? "Diğer oyuncu: hangisi yalan? Tahmin et!"
          : "Sonuç!"}
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={phase} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-3">
          {phase === "write" &&
            s.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder={`${i + 1}. madde`}
                  value={v}
                  onChange={(e) => {
                    const n = [...s];
                    n[i] = e.target.value;
                    setS(n);
                  }}
                />
                <button
                  onClick={() => setLieIdx(i)}
                  className="shrink-0 px-3 rounded-[14px] text-xs font-bold border"
                  style={{
                    background: lieIdx === i ? "var(--danger)" : "var(--card)",
                    borderColor: "var(--border)",
                    color: lieIdx === i ? "#fff" : "var(--text-2)",
                  }}
                >
                  YALAN
                </button>
              </div>
            ))}

          {phase === "guess" &&
            s.map((_, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                onClick={() => setGuess(i)}
                className="glass w-full rounded-2xl p-4 text-left font-bold"
                style={{ borderColor: guess === i ? "var(--accent)" : undefined }}
              >
                {i + 1}. madde →
              </motion.button>
            ))}

          {phase === "reveal" && (
            <div className="space-y-3">
              {s.map((v, i) => (
                <div key={i} className="glass rounded-2xl p-4">
                  <p className="font-bold text-sm">{v}</p>
                  <div className="flex gap-2 mt-2 text-[11px]">
                    {i === lieIdx && <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--danger)", color: "#fff" }}>YALAN</span>}
                    {i === guess && <span className="px-2 py-0.5 rounded-full font-bold glass">TAHMİN</span>}
                  </div>
                </div>
              ))}
              <motion.p
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="text-center text-lg font-extrabold py-2"
              >
                {correct ? "🎉 Doğru bildin!" : `Yalan ${lieIdx! + 1}. maddeydi`}
              </motion.p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {phase === "write" && (
        <button
          disabled={s.some((x) => !x.trim()) || lieIdx === null}
          onClick={() => setPhase("guess")}
          className="btn-grad rounded-2xl py-4 mt-4 font-extrabold disabled:opacity-40"
        >
          Hazırım, pass at →
        </button>
      )}
      {phase === "guess" && (
        <button disabled={guess === null} onClick={() => setPhase("reveal")} className="btn-grad rounded-2xl py-4 mt-4 font-extrabold disabled:opacity-40">
          Tahminim bu →
        </button>
      )}
      {phase === "reveal" && (
        <button
          onClick={() => {
            if (correct) setScore((sc) => (turn === 1 ? { ...sc, p1: sc.p1 + 1 } : { ...sc, p2: sc.p2 + 1 }));
            reset(turn === 1 ? 2 : 1);
          }}
          className="btn-grad rounded-2xl py-4 mt-4 font-extrabold"
        >
          Sıra değişsin →
        </button>
      )}
    </div>
  );
}
