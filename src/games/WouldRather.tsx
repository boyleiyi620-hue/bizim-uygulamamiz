import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { WOULD_RATHER } from "../data/wouldRather";
import { randomOf } from "../lib/utils";

export default function WouldRather({ onExit }: { onExit: () => void }) {
  const [pair, setPair] = useState(() => randomOf(WOULD_RATHER));
  const [pick1, setPick1] = useState<0 | 1 | null>(null);
  const [pick2, setPick2] = useState<0 | 1 | null>(null);
  const [phase, setPhase] = useState<"p1" | "p2" | "reveal">("p1");

  const next = () => {
    setPair(randomOf(WOULD_RATHER.filter((p) => p[0] !== pair[0])));
    setPick1(null);
    setPick2(null);
    setPhase("p1");
  };

  const choose = (i: 0 | 1) => {
    if (phase === "p1") {
      setPick1(i);
      setPhase("p2");
    } else {
      setPick2(i);
      setPhase("reveal");
    }
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-4 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full glass">
          {phase === "p1" ? "1. SIRA" : phase === "p2" ? "2. SIRA" : "SONUÇ"}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {([0, 1] as const).map((i) => {
          const hidden = (phase === "p2" && i !== 1) || phase === "p1";
          const showPick1 = phase === "reveal" && pick1 === i;
          const showPick2 = phase === "reveal" && pick2 === i;
          return (
            <motion.button
              key={pair[i]}
              whileTap={{ scale: 0.97 }}
              onClick={() => phase !== "reveal" && choose(i)}
              className="glass rounded-[24px] p-7 flex-1 text-center relative overflow-hidden disabled:opacity-100"
              disabled={phase === "reveal"}
            >
              {phase === "reveal" && (
                <>
                  {showPick1 && (
                    <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
                      1.tercih
                    </span>
                  )}
                  {showPick2 && (
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full glass">
                      2.tercih
                    </span>
                  )}
                  {showPick1 && showPick2 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center text-5xl"
                    >
                      💞
                    </motion.div>
                  )}
                </>
              )}
              <p className="text-xl font-extrabold leading-snug">{pair[i]}</p>
              {hidden && (
                <p className="text-[11px] mt-2" style={{ color: "var(--text-2)" }}>
                  gizli seçim için dokun
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {phase === "reveal" && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={next}
            className="btn-grad rounded-2xl py-4 mt-4 font-extrabold"
          >
            {pick1 === pick2 ? "💞 Aynı seçtiniz! Sonraki" : "Sonraki soru →"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
