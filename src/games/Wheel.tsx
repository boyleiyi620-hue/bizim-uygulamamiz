import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SURPRISES } from "../data/surprises";

const SEG = ["Romantik", "Eğlence", "Mutfak", "Dışarısı", "Hedef", "Duygusal", "Ev", "Sürpriz"];

export default function Wheel({ onExit }: { onExit: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof SURPRISES[0] | null>(null);
  const [deg, setDeg] = useState(0);
  const rot = useRef(0);

  const items = SURPRISES.slice(0, 12);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const idx = Math.floor(Math.random() * items.length);
    const extra = 360 * 6 + (360 / items.length) * (items.length - idx) + Math.random() * 20 - 10;
    rot.current += extra;
    setDeg(rot.current);
    setTimeout(() => {
      setResult(items[idx]);
      setSpinning(false);
    }, 3200);
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-4 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <p className="text-center text-xs font-extrabold mb-6" style={{ color: "var(--text-2)" }}>
        ŞANS ÇARKI 🎡
      </p>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px]" style={{ borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "var(--accent)" }} />
          <motion.div
            className="w-72 h-72 rounded-full relative overflow-hidden shadow-2xl"
            animate={{ rotate: deg }}
            transition={{ duration: 3.2, ease: [0.25, 0.8, 0.25, 1] }}
          >
            {items.map((it, i) => {
              const n = items.length;
              const a = 360 / n;
              return (
                <div
                  key={i}
                  className="absolute w-1/2 h-1/2 origin-bottom-right"
                  style={{
                    transform: `rotate(${a * i}deg) skewY(${90 - a}deg)`,
                    background: i % 2 === 0 ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "color-mix(in srgb, var(--accent-2) 16%, transparent)",
                  }}
                >
                  <span
                    className="absolute rotate-90 text-[8px] font-extrabold w-28 text-center"
                    style={{
                      transform: `skewY(${a - 90}deg) rotate(${a / 2}deg) translate(-10px, 12px)`,
                      transformOrigin: "left bottom",
                    }}
                  >
                    {it.text.slice(0, 16)}...
                  </span>
                </div>
              );
            })}
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-xl" style={{ background: "var(--grad)" }}>
              💘
            </div>
          </motion.div>
        </div>

        <button onClick={spin} disabled={spinning} className="btn-grad rounded-2xl px-10 py-4 font-extrabold disabled:opacity-50">
          {spinning ? "Dönüyor..." : "Çevir!"}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-[24px] p-6 text-center mt-4">
            <p className="text-xs font-bold mb-2" style={{ color: "var(--text-2)" }}>{result.cat}</p>
            <p className="text-lg font-extrabold leading-snug">{result.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
