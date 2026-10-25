import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const EMOJIS = ["🐶", "🐱", "🍕", "🚀", "🌈", "🎁", "🔥", "⚽", "🌙", "🍓", "🎸", "🦄"];

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

function makeDeck(): Card[] {
  const pairs = EMOJIS.slice(0, 8);
  const deck = [...pairs, ...pairs]
    .map((emoji, i) => ({ id: i, emoji, matched: false }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

export default function Memory({ onExit, onFinish }: { onExit: () => void; onFinish: (p1: number, p2: number) => void }) {
  const [deck, setDeck] = useState(makeDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [lock, setLock] = useState(false);

  const tap = (idx: number) => {
    if (lock || open.includes(idx) || deck[idx].matched) return;
    const next = [...open, idx];
    setOpen(next);
    if (next.length === 2) {
      setLock(true);
      const [a, b] = next;
      if (deck[a].emoji === deck[b].emoji) {
        setTimeout(() => {
          setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          setOpen([]);
          setLock(false);
          setScore((sc) => {
            const nsc = { ...sc, [turn === 1 ? "p1" : "p2"]: sc[turn === 1 ? "p1" : "p2"] + 1 };
            if (nsc.p1 + nsc.p2 === 8) onFinish(nsc.p1, nsc.p2);
            return nsc;
          });
        }, 500);
      } else {
        setTimeout(() => {
          setOpen([]);
          setTurn((t) => (t === 1 ? 2 : 1));
          setLock(false);
        }, 800);
      }
    }
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-28">
      <button onClick={onExit} className="flex items-center gap-1 text-sm font-semibold mb-3 self-start" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={18} /> Geri
      </button>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
          {turn}. OYUNCU
        </span>
        <span className="text-lg font-extrabold">
          {score.p1} — {score.p2}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 flex-1 content-start">
        {deck.map((c, i) => {
          const faceUp = c.matched || open.includes(i);
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => tap(i)}
              className="aspect-square rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: c.matched ? "transparent" : faceUp ? "var(--card-solid)" : "var(--card)",
                border: `1px solid ${c.matched ? "transparent" : "var(--border)"}`,
                opacity: c.matched ? 0.35 : 1,
              }}
            >
              {faceUp ? c.emoji : <span className="text-xl grad-text font-extrabold">?</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
