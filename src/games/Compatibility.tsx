import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const Qs = [
  "Sabah kahvaltısında ne tercih edersin?",
  "Hangi film türünü daha çok seversin?",
  "Deniz mi dağ mı?",
  "Köpek mi kedi mi?",
  "Müzik dinlerken hangi ruh hali?",
  "Tatlı mı tuzlu mu?",
  "İç mekanda mı dış mekanda mı?",
  "Erken yatmak mı geç yatmak mı?",
  "Planlı olmak mı spontanik olmak mı?",
  "Romantik akşam mı oyun gecesi mi?",
];

export default function Compatibility({ onExit }: { onExit: () => void }) {
  const [i, setI] = useState(0);
  const [a1, setA1] = useState<string[]>([]);
  const [a2, setA2] = useState<string[]>([]);
  const [phase, setPhase] = useState<"p1" | "p2" | "res">("p1");
  const [opts] = useState(() => ["A", "B", "C", "D"]);

  const done = phase === "res";
  const same = a1.filter((x, idx) => x === a2[idx]).length;
  const pct = Math.round((same / Qs.length) * 100);

  const next = (v: string) => {
    if (phase === "p1") {
      setA1([...a1, v]);
      if (i === Qs.length - 1) setPhase("p2");
      else setI(i + 1);
    } else {
      setA2([...a2, v]);
      if (i === Qs.length - 1) setPhase("res");
      else setI(i + 1);
    }
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-4 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      {!done ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
              {phase === "p1" ? "1. OYUNCU" : "2. OYUNCU"} · {i + 1}/{Qs.length}
            </span>
          </div>
          <div className="glass rounded-[24px] p-6 mb-5">
            <p className="text-xl font-extrabold leading-snug">{Qs[i]}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {opts.map((o) => (
              <button key={o} onClick={() => next(o)} className="glass rounded-2xl py-4 font-extrabold">
                {o}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl grad-text font-extrabold">
            %{pct}
          </motion.p>
          <p className="text-2xl font-extrabold">Uyumluluk Oranı</p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            {same}/{Qs.length} soruda aynı fikirdeydiniz 💞
          </p>
          <button onClick={() => { setI(0); setA1([]); setA2([]); setPhase("p1"); }} className="btn-grad rounded-2xl px-8 py-3.5 font-extrabold mt-4">
            Tekrar test et
          </button>
        </div>
      )}
    </div>
  );
}
