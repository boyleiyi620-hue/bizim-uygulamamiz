import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Timer } from "lucide-react";
import { WORD_BANK } from "../data/words";

export default function WordChain({ onExit }: { onExit: () => void }) {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [turn, setTurn] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [over, setOver] = useState<1 | 2 | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (over) return;
    timer.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setOver(turn);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [turn, over]);

  const lastWord = words[words.length - 1] ?? "";

  const valid = (w: string) => {
    const word = w.toLowerCase().trim().replace(/[^a-zçğıöşü]/g, "");
    if (word.length < 3) return "En az 3 harf olmalı";
    if (words.includes(word)) return "Bu kelime zaten kullanıldı";
    if (lastWord) {
      const last = lastWord[lastWord.length - 1];
      const last2 = lastWord.slice(-2);
      if (!word.startsWith(last) && !word.startsWith(last2)) {
        return `Önceki kelime "${lastWord}" ile bitmeli`;
      }
    }
    if (!WORD_BANK.includes(word)) return "Sözlükte yok (kelime bankasından dene)";
    return null;
  };

  const submit = () => {
    const err = valid(input);
    if (err) {
      setError(err);
      return;
    }
    const w = input.toLowerCase().trim().replace(/[^a-zçğıöşü]/g, "");
    setWords((prev) => [...prev, w]);
    setInput("");
    setError("");
    setTurn(turn === 1 ? 2 : 1);
    setSeconds(30);
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-3 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      {over ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl">⏰</motion.p>
          <p className="text-2xl font-extrabold">{over === 1 ? "1." : "2."} oyuncu süre doldu!</p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>Toplam {words.length} kelime oynandı</p>
          <button onClick={() => { setWords([]); setTurn(1); setSeconds(30); setOver(null); setError(""); }} className="btn-grad rounded-2xl px-8 py-3.5 font-extrabold">
            Tekrar oyna
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
              {turn}. OYUNCU
            </span>
            <span className="flex items-center gap-1.5 text-lg font-extrabold" style={{ color: seconds <= 10 ? "var(--danger)" : "inherit" }}>
              <Timer size={18} /> {seconds}
            </span>
          </div>

          <div className="glass rounded-[24px] p-6 mb-4 min-h-[160px] flex flex-wrap content-start gap-2">
            {words.length === 0 && (
              <p className="text-sm" style={{ color: "var(--text-2)" }}>
                İlk kelimeyi sen yaz (kelime bankasındaki kelimelerden) ✍️
              </p>
            )}
            {words.map((w, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-sm font-bold"
                style={{
                  background: (i % 2 === 0 ? "var(--grad)" : "var(--card)"),
                  color: i % 2 === 0 ? "#fff" : "var(--text)",
                  border: i % 2 === 0 ? "none" : "1px solid var(--border)",
                }}
              >
                {w}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={lastWord ? `"${lastWord}" ile biten kelime` : "İlk kelime..."}
            />
            <button onClick={submit} className="btn-grad shrink-0 px-6 rounded-[14px] font-extrabold text-sm">
              Yaz
            </button>
          </div>
          {error && <p className="text-xs mt-2 font-semibold" style={{ color: "var(--danger)" }}>{error}</p>}
        </>
      )}
    </div>
  );
}
