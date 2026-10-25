import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, UserPlus } from "lucide-react";
import { useStore } from "../lib/store";

const AVATARS = ["🥰", "😍", "😎", "😻", "🙈", "🐰", "🐻", "🦊", "🌸", "⭐", "🔥", "💋"];

export default function CoupleSetup() {
  const { create, join } = useStore();
  const [mode, setMode] = useState<"pick" | "create" | "join">("pick");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [a1, setA1] = useState("🥰");
  const [a2, setA2] = useState("😍");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submitCreate = async () => {
    if (!n1.trim() || !n2.trim()) return;
    setBusy(true);
    await create({ name: n1.trim(), avatar: a1 }, { name: n2.trim(), avatar: a2 }, date);
    setBusy(false);
  };

  const submitJoin = async () => {
    if (code.trim().length < 4) return;
    setBusy(true);
    setErr("");
    const ok = await join(code);
    setBusy(false);
    if (!ok) setErr("Böyle bir kod bulunamadı. Kontrol edip tekrar dene.");
  };

  return (
    <div className="min-h-full flex flex-col justify-center px-6 py-10 relative z-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <motion.p animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="text-6xl mb-3">💘</motion.p>
        <h1 className="text-3xl font-extrabold grad-text">Bizim Uygulamamız</h1>
        <p className="text-sm font-semibold mt-2" style={{ color: "var(--text-2)" }}>
          Birlikte oynayın, görev tamamlayın, anı biriktirin
        </p>
      </motion.div>

      {mode === "pick" && (
        <div className="space-y-3">
          <button onClick={() => setMode("create")} className="btn-grad w-full rounded-[22px] p-5 flex items-center gap-4 font-extrabold">
            <UserPlus size={24} />
            <span className="text-left">
              Yeni çift oluştur
              <span className="block text-xs font-semibold opacity-80">Kod üretilir, partnerin katılır</span>
            </span>
          </button>
          <button onClick={() => setMode("join")} className="glass w-full rounded-[22px] p-5 flex items-center gap-4 font-extrabold">
            <Users size={24} />
            <span className="text-left">
              Davet koduyla katıl
              <span className="block text-xs font-semibold" style={{ color: "var(--text-2)" }}>Partnerin kodu girdi</span>
            </span>
          </button>
        </div>
      )}

      {mode === "create" && (
        <div className="space-y-4">
          <div className="glass rounded-[22px] p-4 space-y-3">
            <p className="text-xs font-extrabold" style={{ color: "var(--text-2)" }}>1. SEN</p>
            <input placeholder="Adın" value={n1} onChange={(e) => setN1(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setA1(a)} className="text-2xl p-1.5 rounded-xl" style={a === a1 ? { background: "var(--card-solid)", border: "1px solid var(--accent)" } : { opacity: 0.6 }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="glass rounded-[22px] p-4 space-y-3">
            <p className="text-xs font-extrabold" style={{ color: "var(--text-2)" }}>2. PARTNERİN</p>
            <input placeholder="Adı" value={n2} onChange={(e) => setN2(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setA2(a)} className="text-2xl p-1.5 rounded-xl" style={a === a2 ? { background: "var(--card-solid)", border: "1px solid var(--accent)" } : { opacity: 0.6 }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold mb-1.5" style={{ color: "var(--text-2)" }}>BAŞLANGIÇ / TANIŞMA TARİHİ</p>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button onClick={submitCreate} disabled={busy || !n1.trim() || !n2.trim()} className="btn-grad w-full rounded-2xl py-4 font-extrabold disabled:opacity-40">
            <Heart size={18} className="inline mr-1.5" />
            {busy ? "Oluşturuluyor..." : "Oluştur"}
          </button>
          <button onClick={() => setMode("pick")} className="w-full text-sm font-semibold py-1" style={{ color: "var(--text-2)" }}>← Geri</button>
        </div>
      )}

      {mode === "join" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-extrabold mb-1.5" style={{ color: "var(--text-2)" }}>DAVET KODU (6 hane)</p>
            <input
              placeholder="örn. A3K9PZ"
              value={code}
              maxLength={6}
              autoCapitalize="characters"
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(""); }}
              className="text-center text-xl font-extrabold tracking-[0.4em] uppercase"
            />
            {err && <p className="text-xs font-bold mt-2" style={{ color: "var(--danger)" }}>{err}</p>}
          </div>
          <button onClick={submitJoin} disabled={busy || code.length < 4} className="btn-grad w-full rounded-2xl py-4 font-extrabold disabled:opacity-40">
            {busy ? "Katılınıyor..." : "Çifte katıl"}
          </button>
          <button onClick={() => setMode("pick")} className="w-full text-sm font-semibold py-1" style={{ color: "var(--text-2)" }}>← Geri</button>
        </div>
      )}
    </div>
  );
}
