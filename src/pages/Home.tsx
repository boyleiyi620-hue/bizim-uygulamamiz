import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, ChevronRight } from "lucide-react";
import { useStore } from "../lib/store";
import { daysTogether, pickDaily, randomOf, fmtTime, todayStr, uid } from "../lib/utils";
import { getMyRole } from "../lib/device";
import { QUESTIONS } from "../data/questions";
import { SURPRISES } from "../data/surprises";
import Sheet from "../components/Sheet";

export default function Home() {
  const { state, update, online } = useStore();
  const myRole = getMyRole();
  const [now, setNow] = useState(Date.now());
  const [surprise, setSurprise] = useState<{ text: string; cat: string } | null>(null);
  const [heartFx, setHeartFx] = useState(false);
  const [msg, setMsg] = useState("");
  const [ans1, setAns1] = useState("");
  const [ans2, setAns2] = useState("");

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const dailyQ = useMemo(() => pickDaily(QUESTIONS, "gunun-sorusu"), [now]);

  const t = useMemo(() => daysTogether(state!.startDate), [state?.startDate, now]);
  const hours = Math.floor((now - new Date(state!.startDate + "T00:00:00").getTime()) / 3600000) % 24;
  const mins = Math.floor((now - new Date(state!.startDate + "T00:00:00").getTime()) / 60000) % 60;
  const secs = Math.floor((now / 1000)) % 60;

  const todayAnswer = state?.questionAnswers.find(
    (q) => q.date.slice(0, 10) === todayStr() && q.question === dailyQ.q
  );

  const lastHearts = state?.hearts.slice(-3).reverse() ?? [];

  const sendHeart = () => {
    setHeartFx(true);
    setTimeout(() => setHeartFx(false), 2200);
    update((s) => ({
      ...s,
      hearts: [...s.hearts, { id: uid(), from: "p1" as const, date: new Date().toISOString() }].slice(-300),
    }));
  };

  const drawSurprise = () => {
    const s = randomOf(SURPRISES);
    setSurprise(s);
    update((st) => ({
      ...st,
      surprises: [{ id: uid(), text: s.text, category: s.cat, date: new Date().toISOString() }, ...st.surprises].slice(0, 100),
    }));
  };

  const sendMsg = () => {
    if (!msg.trim()) return;
    update((s) => ({
      ...s,
      messages: [...s.messages, { id: uid(), from: "p1" as const, text: msg.trim(), date: new Date().toISOString() }].slice(-200),
    }));
    setMsg("");
  };

  const saveQ = () => {
    if (!ans1.trim() || !ans2.trim()) return;
    update((s) => ({
      ...s,
      questionAnswers: [
        { id: uid(), question: dailyQ.q, a1: ans1.trim(), a2: ans2.trim(), date: new Date().toISOString() },
        ...s.questionAnswers,
      ].slice(0, 100),
    }));
  };

  const recent = state?.surprises.slice(0, 5) ?? [];

  return (
    <div className="px-5 pt-4 pb-28 space-y-4">
      {/* HERO sayaç */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[28px] p-6 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: "var(--grad)" }} />
        <p className="text-xs font-bold tracking-wide" style={{ color: "var(--text-2)" }}>
          {state!.p1.avatar} {state!.p1.name} & {state!.p2.avatar} {state!.p2.name}
        </p>
        {myRole && (
          <p className="text-[10px] mt-1 font-extrabold px-2.5 py-0.5 rounded-full inline-block glass">
            Bu cihaz: {myRole === "p1" ? state!.p1.name : state!.p2.name}
          </p>
        )}
        <p className="text-6xl font-extrabold mt-2 grad-text">{t.days}</p>
        <p className="text-sm font-bold" style={{ color: "var(--text-2)" }}>günlük beraberiz 💞</p>
        <p className="text-lg font-extrabold mt-3 tabular-nums">
          {hours} sa {mins} dk {secs} sn
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <span className="h-2 w-2 rounded-full" style={{ background: online ? "var(--ok)" : "var(--text-2)" }} />
          <span className="text-[11px] font-semibold" style={{ color: "var(--text-2)" }}>
            {online ? "partnerin çevrimiçi" : "çevrimdışı — yerel kaydediliyor"}
          </span>
        </div>
      </motion.div>

      {/* Aksiyonlar */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button whileTap={{ scale: 0.96 }} onClick={sendHeart} className="glass rounded-[22px] p-4 flex flex-col gap-1 items-start">
          <Heart size={26} style={{ color: "var(--accent)" }} fill="var(--accent)" />
          <span className="font-extrabold text-sm">Kalp gönder</span>
          <span className="text-[11px]" style={{ color: "var(--text-2)" }}>partnerine</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.96 }} onClick={drawSurprise} className="glass rounded-[22px] p-4 flex flex-col gap-1 items-start">
          <Sparkles size={26} style={{ color: "var(--accent-2)" }} />
          <span className="font-extrabold text-sm">Sürpriz çek</span>
          <span className="text-[11px]" style={{ color: "var(--text-2)" }}>şimdi ne yapsak?</span>
        </motion.button>
      </div>

      {/* Kalp efekti */}
      <AnimatePresence>
        {heartFx && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1.6,
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 400,
                }}
                transition={{ duration: 1.6, delay: i * 0.04 }}
                className="absolute text-4xl"
              >
                💗
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Günün sorusu */}
      <div className="glass rounded-[24px] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full" style={{ background: "var(--grad)", color: "#fff" }}>
            GÜNÜN SORUSU
          </span>
          <ChevronRight size={16} style={{ color: "var(--text-2)" }} />
        </div>
        <p className="font-extrabold text-lg leading-snug mb-3">{dailyQ.q}</p>
        {!todayAnswer ? (
          <div className="space-y-2">
            <input placeholder={`${state!.p1.name} cevabı`} value={ans1} onChange={(e) => setAns1(e.target.value)} />
            <input placeholder={`${state!.p2.name} cevabı`} value={ans2} onChange={(e) => setAns2(e.target.value)} />
            <button onClick={saveQ} disabled={!ans1.trim() || !ans2.trim()} className="btn-grad w-full rounded-xl py-2.5 font-bold text-sm disabled:opacity-40">
              Cevapları kaydet
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="glass rounded-xl p-3">
              <p className="text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{state!.p1.avatar} {state!.p1.name}</p>
              <p className="text-sm font-semibold">{todayAnswer.a1}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{state!.p2.avatar} {state!.p2.name}</p>
              <p className="text-sm font-semibold">{todayAnswer.a2}</p>
            </div>
          </div>
        )}
      </div>

      {/* Son sürprizler */}
      {recent.length > 0 && (
        <div className="glass rounded-[24px] p-5">
          <h3 className="font-extrabold mb-2">Son sürprizler 🎁</h3>
          <div className="space-y-2">
            {recent.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{s.text}</span>
                <span className="text-[10px] shrink-0 ml-2" style={{ color: "var(--text-2)" }}>{fmtTime(s.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sohbet */}
      <div className="glass rounded-[24px] p-5">
        <h3 className="font-extrabold mb-3">Not panosu 💬</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-hide mb-3">
          {state!.messages.length === 0 && (
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Birbirinize küçük notlar bırakın...</p>
          )}
          {[...state!.messages].slice(-20).reverse().map((m) => (
            <div key={m.id} className="glass rounded-xl p-3">
              <p className="text-[11px] font-bold" style={{ color: "var(--text-2)" }}>
                {m.from === "p1" ? state!.p1.name : state!.p2.name} · {fmtTime(m.date)}
              </p>
              <p className="text-sm font-semibold">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()} placeholder="Not yaz..." />
          <button onClick={sendMsg} className="btn-grad shrink-0 px-4 rounded-[14px]">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Kalpler geçmişi */}
      {lastHearts.length > 0 && (
        <p className="text-center text-xs font-semibold" style={{ color: "var(--text-2)" }}>
          💗 Son kalpler: {lastHearts.map((h) => fmtTime(h.date)).join(" · ")}
        </p>
      )}

      {/* Sürpriz sheet */}
      <Sheet open={!!surprise} onClose={() => setSurprise(null)} title="Sürpriz! 🎉">
        {surprise && (
          <div className="text-center py-6">
            <p className="text-5xl mb-4">✨</p>
            <p className="text-xl font-extrabold leading-snug mb-2">{surprise.text}</p>
            <p className="text-xs font-bold px-3 py-1 rounded-full inline-block glass" style={{ color: "var(--text-2)" }}>{surprise.cat}</p>
            <button onClick={() => setSurprise(null)} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold mt-6">
              Hadi yapalım!
            </button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
