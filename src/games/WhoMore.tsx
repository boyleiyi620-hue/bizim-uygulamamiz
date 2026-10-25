import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { WHO_MORE } from "../data/whoMore";
import { randomOf } from "../lib/utils";
import { useStore } from "../lib/store";
import { uid } from "../lib/utils";

export default function WhoMore({ onExit }: { onExit: () => void }) {
  const { state, update } = useStore();
  const [q, setQ] = useState(() => randomOf(WHO_MORE));
  const [pick1, setPick1] = useState<"p1" | "p2" | null>(null);
  const [pick2, setPick2] = useState<"p1" | "p2" | null>(null);
  const [phase, setPhase] = useState<"p1" | "p2" | "reveal">("p1");

  const next = () => {
    setQ(randomOf(WHO_MORE.filter((x) => x !== q)));
    setPick1(null);
    setPick2(null);
    setPhase("p1");
  };

  const choose = (who: "p1" | "p2") => {
    if (phase === "p1") {
      setPick1(who);
      setPhase("p2");
    } else {
      setPick2(who);
      setPhase("reveal");
    }
  };

  const match = pick1 === pick2;

  const finish = () => {
    if (match) {
      update((s) => ({
        ...s,
        scores: [
          { id: uid(), game: "KimDahaÇok", winner: "beraber" as const, p1: 1, p2: 1, date: new Date().toISOString() },
          ...s.scores,
        ].slice(0, 200),
      }));
    }
    next();
  };

  const name = (k: "p1" | "p2") => state?.[k].name ?? (k === "p1" ? "1" : "2");

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-4 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <p className="text-center text-xs font-bold px-3 py-1 rounded-full glass self-center mb-5">
        KİM DAHA ÇOK?
      </p>

      <AnimatePresence mode="wait">
        <motion.h2
          key={q}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="text-center text-3xl font-extrabold mb-8"
        >
          {q}
        </motion.h2>
      </AnimatePresence>

      <div className="flex-1 flex flex-col gap-3">
        {(["p1", "p2"] as const).map((k) => {
          const votes1 = phase !== "p1" && pick1 === k;
          const votes2 = phase === "reveal" && pick2 === k;
          const hidden = phase === "p1" || phase === "p2";
          return (
            <motion.button
              key={k}
              whileTap={{ scale: 0.97 }}
              onClick={() => phase !== "reveal" && choose(k)}
              disabled={phase === "reveal"}
              className="glass rounded-[24px] p-6 flex-1 flex flex-col items-center justify-center gap-1 relative overflow-hidden"
              style={{ borderColor: phase === "reveal" && match && pick1 === k ? "var(--accent)" : undefined }}
            >
              <span className="text-5xl">{state?.[k].avatar ?? (k === "p1" ? "🥰" : "😍")}</span>
              <span className="text-lg font-extrabold">{name(k)}</span>
              {phase === "reveal" && (
                <div className="flex gap-2 mt-1 text-[11px] font-bold">
                  {votes1 && <span className="px-2 py-0.5 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>{name("p1")} oy verdi</span>}
                  {votes2 && <span className="px-2 py-0.5 rounded-full glass">{name("p2")} oy verdi</span>}
                </div>
              )}
              {hidden && <p className="text-[11px]" style={{ color: "var(--text-2)" }}>gizli seçim için dokun</p>}
            </motion.button>
          );
        })}
      </div>

      {phase === "reveal" && (
        <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-center text-lg font-extrabold py-3">
          {match ? "💞 Fikir birliği!" : "🤔 Farklı düşündünüz"}
        </motion.p>
      )}

      {phase === "reveal" && (
        <button onClick={finish} className="btn-grad rounded-2xl py-4 font-extrabold">
          Sonraki soru →
        </button>
      )}
    </div>
  );
}
