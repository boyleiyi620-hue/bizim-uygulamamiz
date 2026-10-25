import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import CardsDeck from "../games/CardsDeck";
import WouldRather from "../games/WouldRather";
import TruthLie from "../games/TruthLie";
import Memory from "../games/Memory";
import WhoMore from "../games/WhoMore";
import Quiz from "../games/Quiz";
import EmojiGuess from "../games/EmojiGuess";
import WordChain from "../games/WordChain";
import Compatibility from "../games/Compatibility";
import Wheel from "../games/Wheel";
import Pomodoro from "../games/Pomodoro";
import { useStore } from "../lib/store";
import { uid } from "../lib/utils";

type GameId =
  | "cards" | "wouldRather" | "truthLie" | "memory" | "whoMore"
  | "quiz" | "emoji" | "wordChain" | "pomodoro" | "compat" | "wheel" | null;

const GAMES: { id: Exclude<GameId, null>; name: string; emoji: string; desc: string }[] = [
  { id: "cards", name: "Soru Kartları", emoji: "🃏", desc: "Derinleşen 45+ soru" },
  { id: "wouldRather", name: "A mı B mı?", emoji: "⚖️", desc: "Sürpriz tercihler" },
  { id: "truthLie", name: "Doğru / Yalan", emoji: "🕵️", desc: "Yalanı bul" },
  { id: "memory", name: "Hafıza", emoji: "🧠", desc: "Emoji eşleştir" },
  { id: "whoMore", name: "Kim Daha Çok?", emoji: "🙋", desc: "Fikir birliği" },
  { id: "quiz", name: "Bilgi Yarışması", emoji: "🎯", desc: "İkiniz de bilin" },
  { id: "emoji", name: "Emoji Tahmin", emoji: "😜", desc: "Emoji çöz" },
  { id: "wordChain", name: "Kelime Zinciri", emoji: "🔤", desc: "Son harften devam" },
  { id: "compat", name: "Uyumluluk Testi", emoji: "💕", desc: "% uyum hesapla" },
  { id: "wheel", name: "Şans Çarkı", emoji: "🎡", desc: "Rastgele aktivite" },
];

export default function Games() {
  const [active, setActive] = useState<GameId>(null);
  const { update } = useStore();

  const recordScore = (game: string, p1: number, p2: number) => {
    update((s) => ({
      ...s,
      scores: [
        { id: uid(), game, winner: p1 > p2 ? ("p1" as const) : p2 > p1 ? ("p2" as const) : ("beraber" as const), p1, p2, date: new Date().toISOString() },
        ...s.scores,
      ].slice(0, 200),
    }));
    setActive(null);
  };

  if (active) {
    return (
      <div className="min-h-full">
        <AnimatePresence>
          {active === "cards" && <CardsDeck onExit={() => setActive(null)} />}
          {active === "wouldRather" && <WouldRather onExit={() => setActive(null)} />}
          {active === "truthLie" && <TruthLie onExit={() => setActive(null)} />}
          {active === "memory" && <Memory onExit={() => setActive(null)} onFinish={(a, b) => recordScore("Hafıza", a, b)} />}
          {active === "whoMore" && <WhoMore onExit={() => setActive(null)} />}
          {active === "quiz" && <Quiz onExit={() => setActive(null)} onFinish={(s) => recordScore("Bilgi Yarışması", s, 0)} />}
          {active === "emoji" && <EmojiGuess onExit={() => setActive(null)} />}
          {active === "wordChain" && <WordChain onExit={() => setActive(null)} />}
          {active === "pomodoro" && <Pomodoro onExit={() => setActive(null)} />}
          {active === "compat" && <Compatibility onExit={() => setActive(null)} />}
          {active === "wheel" && <Wheel onExit={() => setActive(null)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 pb-28">
      <h1 className="text-2xl font-extrabold mb-1">Oyunlar 🎮</h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>
        Beraber oynayın, skorlar kaydedilir
      </p>

      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActive(g.id)}
            className="glass rounded-[22px] p-4 text-left flex flex-col gap-1 min-h-[110px]"
          >
            <span className="text-3xl">{g.emoji}</span>
            <span className="font-extrabold text-sm leading-tight">{g.name}</span>
            <span className="text-[11px]" style={{ color: "var(--text-2)" }}>{g.desc}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
