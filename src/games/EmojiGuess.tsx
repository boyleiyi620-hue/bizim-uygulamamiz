import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EMOJI_PUZZLES } from "../data/emojiPuzzles";
import { randomOf } from "../lib/utils";

export default function EmojiGuess({ onExit }: { onExit: () => void }) {
  const [puzzle, setPuzzle] = useState(() => randomOf(EMOJI_PUZZLES));
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [turn, setTurn] = useState<1 | 2>(1);
  const [round, setRound] = useState(1);

  const options = [puzzle.answer, ...puzzle.wrong].sort(() => Math.random() - 0.5);
  const correct = pick === puzzle.answer;

  const next = () => {
    if (correct) setScore((s) => ({ ...s, [turn === 1 ? "p1" : "p2"]: s[turn === 1 ? "p1" : "p2"] + 1 }));
    setPuzzle(randomOf(EMOJI_PUZZLES.filter((p) => p.answer !== puzzle.answer)));
    setPick(null);
    setTurn(turn === 1 ? 2 : 1);
    setRound((r) => r + 1);
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-3 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full glass">TUR {round} · {turn}. OYUNCU</span>
        <span className="text-lg font-extrabold">{score.p1} — {score.p2}</span>
      </div>

      <motion.div
        key={puzzle.answer + round}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-[28px] py-12 text-center text-6xl mb-5 tracking-widest"
      >
        {puzzle.emojis}
      </motion.div>

      <div className="flex-1 grid grid-cols-1 gap-2.5 content-start">
        {options.map((o) => {
          const show = pick !== null;
          const isCorrect = o === puzzle.answer;
          return (
            <motion.button
              key={o}
              whileTap={{ scale: 0.97 }}
              disabled={show}
              onClick={() => setPick(o)}
              className="glass rounded-2xl p-4 font-bold text-sm text-left"
              style={show && isCorrect ? { borderColor: "var(--ok)", background: "color-mix(in srgb, var(--ok) 12%, transparent)" } : undefined}
            >
              {o} {show && isCorrect && "✅"}
            </motion.button>
          );
        })}
      </div>

      {pick !== null && (
        <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={next} className="btn-grad rounded-2xl py-4 mt-4 font-extrabold">
          {correct ? "🎉 Doğru! Sonraki →" : `Yanlış, cevap: ${puzzle.answer} →`}
        </motion.button>
      )}
    </div>
  );
}
