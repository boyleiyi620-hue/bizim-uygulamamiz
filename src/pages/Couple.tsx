import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Check, Users, ArrowRight } from "lucide-react";
import { useAuth } from "./Auth";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

interface CoupleCtx {
  couple: any;
  partner: any;
  reload: () => void;
}

const CoupleContext = createContext<CoupleCtx>(null as any);
export const useCouple = () => useContext(CoupleContext);

export function CoupleProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [couple, setCouple] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user || !profile) {
      setLoading(false);
      return;
    }
    if (!profile.couple_id) {
      setCouple(null);
      setPartner(null);
      setLoading(false);
      return;
    }
    const { data: c } = await supabase.from("couples").select("*").eq("id", profile.couple_id).single();
    setCouple(c);
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("couple_id", profile.couple_id)
      .neq("id", user.id)
      .single();
    setPartner(p);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user, profile]);

  const value = useMemo(() => ({ couple, partner, reload: load }), [couple, partner]);
  if (loading) return <div className="min-h-full flex items-center justify-center"><motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-12 h-12 rounded-2xl" style={{ background: "var(--grad)" }} /></div>;
  return <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>;
}

export default function CoupleJoin() {
  const { user, profile } = useAuth();
  const { reload } = useCouple();
  const nav = useNavigate();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [myCode, setMyCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!profile?.couple_id) return;
    nav("/");
  }, [profile, nav]);

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let c = "";
    for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
    setMyCode(c);
  };

  const createCouple = async () => {
    if (!user || !myCode) return;
    setBusy(true);
    setErr("");
    const { data: c, error } = await supabase.from("couples").insert({ code: myCode }).select().single();
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    await supabase.from("profiles").update({ couple_id: c.id }).eq("id", user.id);
    await reload();
    setBusy(false);
  };

  const joinCouple = async () => {
    if (!user || code.length < 4) return;
    setBusy(true);
    setErr("");
    const { data: c, error } = await supabase.from("couples").select("*").eq("code", code.toUpperCase()).single();
    if (error || !c) {
      setErr("Eşleşme kodu bulunamadı");
      setBusy(false);
      return;
    }
    const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("couple_id", c.id);
    if (count && count >= 2) {
      setErr("Bu çift zaten dolu");
      setBusy(false);
      return;
    }
    await supabase.from("profiles").update({ couple_id: c.id }).eq("id", user.id);
    await reload();
    setBusy(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 relative z-10">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="mx-auto w-14 h-14 rounded-3xl flex items-center justify-center mb-4" style={{ background: "var(--grad)" }}>
          <Users size={26} color="#fff" />
        </div>
        <h1 className="text-3xl font-extrabold">Çifti Tamamla</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>Eşleşme kodu ile birbirinizi bulun</p>
      </motion.div>

      <div className="w-full max-w-sm flex items-center gap-1 rounded-full glass p-1 mb-6">
        <button onClick={() => setMode("create")} className={`flex-1 py-2 rounded-full text-sm font-bold ${mode === "create" ? "btn-grad" : "text-[var(--text-2)]"}`}>Kod Oluştur</button>
        <button onClick={() => setMode("join")} className={`flex-1 py-2 rounded-full text-sm font-bold ${mode === "join" ? "btn-grad" : "text-[var(--text-2)]"}`}>Koda Katıl</button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "create" ? (
          <motion.div key="create" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="w-full max-w-sm glass rounded-[30px] p-6 text-center relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[100px] opacity-40" style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} />
            <p className="relative text-sm font-semibold mb-4" style={{ color: "var(--text-2)" }}>Partnerine bu kodu gönder</p>
            {!myCode ? (
              <button onClick={generate} className="relative btn-grad rounded-full px-8 py-3 font-extrabold flex items-center gap-2 mx-auto">
                <Heart size={18} /> Kod Üret
              </button>
            ) : (
              <div className="relative space-y-4">
                <button onClick={copy} className="text-4xl font-extrabold tracking-[0.6em] grad-text">{myCode}</button>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>{copied ? "Kopyalandı" : "Kopyalamak için tıkla"}</p>
                <button onClick={createCouple} disabled={busy} className="btn-grad w-full rounded-full py-3.5 font-extrabold flex items-center justify-center gap-2 disabled:opacity-50">
                  {busy ? "Bekleyin..." : <>Eşleşmeyi Başlat <ArrowRight size={18} /></>}
                </button>
              </div>
            )}
            {err && <p className="relative text-xs mt-4 font-semibold" style={{ color: "var(--danger)" }}>{err}</p>}
          </motion.div>
        ) : (
          <motion.div key="join" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="w-full max-w-sm glass rounded-[30px] p-6 relative overflow-hidden">
            <div className="absolute -top-20 right-[-30%] w-48 h-48 rounded-full blur-[100px] opacity-40" style={{ background: "radial-gradient(circle, var(--accent-2), transparent)" }} />
            <p className="relative text-sm font-semibold mb-4" style={{ color: "var(--text-2)" }}>Partnerinden aldığın kodu gir</p>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} placeholder="ABC123" className="relative text-center text-2xl font-extrabold tracking-[0.5em] uppercase" />
            {err && <p className="relative text-xs mt-3 font-semibold" style={{ color: "var(--danger)" }}>{err}</p>}
            <button onClick={joinCouple} disabled={busy || code.length < 6} className="relative btn-grad w-full rounded-full py-3.5 font-extrabold flex items-center justify-center gap-2 mt-5 disabled:opacity-40">
              {busy ? "Bekleyin..." : <>Çifte Katıl <ArrowRight size={18} /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
