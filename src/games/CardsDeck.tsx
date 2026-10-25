import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Star } from "lucide-react";
import { QUESTIONS } from "../data/questions";
import { useStore } from "../lib/store";
import { uid } from "../lib/utils";

export default function CardsDeck({ onExit }: { onExit: () => void }) {
  const { state, update } = useStore();
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const [flipped, setFlipped] = useState(false);

  const q = QUESTIONS[idx];
  const isFav = state?.favoriteQuestions.includes(q.q) ?? false;

  const next = () => {
    let n = idx;
    while (n === idx) n = Math.floor(Math.random() * QUESTIONS.length);
    setIdx(n);
    setFlipped(false);
  };

  const toggleFav = () => {
    update((s) => ({
      ...s,
      favoriteQuestions: isFav
        ? s.favoriteQuestions.filter((f) => f !== q.q)
        : [...s.favoriteQuestions, q.q],
    }));
  };

  const saveAnswer = (a1: string, a2: string) => {
    update((s) => ({
      ...s,
      questionAnswers: [
        { id: uid(), question: q.q, a1, a2, date: new Date().toISOString() },
        ...s.questionAnswers,
      ].slice(0, 100),
    }));
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--text-2)" }}>
          <ArrowLeft size={18} /> Geri
        </button>
        <span className="text-xs font-bold px-3 py-1 rounded-full glass">
          {idx + 1} / {QUESTIONS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="flex-1"
        >
          <div
            onClick={() => setFlipped((f) => !f)}
            className="glass rounded-[28px] p-7 min-h-[340px] flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden"
          >
            <span className="absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
              {q.level === 1 ? "HAFİF" : q.level === 2 ? "ORTA" : "DERİN"}
            </span>
            <p className="text-2xl font-extrabold leading-snug">{q.q}</p>
            <p className="text-sm mt-6" style={{ color: "var(--text-2)" }}>
              {flipped ? "Cevaplayın, sonra sonraki kart ⬇" : "Dokun ve cevapla →"}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {flipped && <AnswerBox key={q.q} onSave={saveAnswer} />}

      <div className="flex gap-3 mt-4">
        <button onClick={toggleFav} className="glass rounded-2xl px-5 py-3.5 flex items-center gap-2 font-bold text-sm">
          <Star size={18} fill={isFav ? "var(--accent)" : "none"} style={{ color: isFav ? "var(--accent)" : "inherit" }} />
          {isFav ? "Favorilerde" : "Favorile"}
        </button>
        <button onClick={next} className="btn-grad rounded-2xl px-6 py-3.5 flex-1 font-extrabold text-sm flex items-center justify-center gap-2">
          <Heart size={18} /> Sonraki kart
        </button>
      </div>
    </div>
  );
}

function AnswerBox({ onSave }: { onSave: (a1: string, a2: string) => void }) {
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4 mt-4 space-y-3">
      {!saved ? (
        <>
          <input placeholder="Partner 1 cevabı" value={a1} onChange={(e) => setA1(e.target.value)} />
          <input placeholder="Partner 2 cevabı" value={a2} onChange={(e) => setA2(e.target.value)} />
          <button
            onClick={() => {
              if (!a1.trim() || !a2.trim()) return;
              onSave(a1.trim(), a2.trim());
              setSaved(true);
            }}
            className="btn-grad w-full rounded-xl py-2.5 font-bold text-sm"
          >
            Cevapları kaydet
          </button>
        </>
      ) : (
        <p className="text-sm font-semibold text-center py-1">✓ Cevaplar anılara kaydedildi</p>
      )}
    </motion.div>
  );
}
