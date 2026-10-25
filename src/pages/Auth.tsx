import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface AuthCtx {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>(null as any);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setProfile(p);
    })();
  }, [user]);

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error?.message ?? null;
  };
  const signUp: AuthCtx["signUp"] = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) return error.message;
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, full_name: name.trim() });
    }
    return null;
  };
  const signOut: AuthCtx["signOut"] = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({ user, profile, loading, signIn, signUp, signOut }), [user, profile, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function AuthPage() {
  const nav = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) nav("/");
  }, [user, nav]);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setErr("");
    const e = mode === "login" ? await signIn(email, pass) : await signUp(email, pass, name);
    if (e) setErr(e);
    setBusy(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative z-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-7">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mx-auto w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-lg"
          style={{ background: "var(--grad)" }}
        >
          <Heart size={28} fill="#fff" color="#fff" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="grad-text">Bizim</span> Uygulamamız
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
          Birlikte yazdığımız hikaye, sadece ikimize özel
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="w-full max-w-[340px] glass rounded-[28px] p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-24 right-[-40%] w-56 h-56 rounded-full blur-[120px] opacity-40" style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} />
        <div className="relative flex items-center justify-between mb-5">
          <div>
            <p className="text-lg font-extrabold">{mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}</p>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>{mode === "login" ? "Tekrar hoş geldin" : "Yeni bir hikaye başlat"}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full glass px-1 py-1">
            <button onClick={() => setMode("login")} className={`px-2.5 py-1 rounded-full text-xs font-bold ${mode === "login" ? "btn-grad" : ""}`}>
              <span className={mode === "login" ? "text-white" : "text-[var(--text-2)]"}>Giriş</span>
            </button>
            <button onClick={() => setMode("signup")} className={`px-2.5 py-1 rounded-full text-xs font-bold ${mode === "signup" ? "btn-grad" : ""}`}>
              <span className={mode === "signup" ? "text-white" : "text-[var(--text-2)]"}>Kayıt</span>
            </button>
          </div>
        </div>

        <div className="relative flex flex-col gap-2.5">
          {mode === "signup" && (
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ color: "var(--text-2)" }} />
              <input type="text" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} className="h-12 !pl-11 !pr-4" autoComplete="name" />
            </div>
          )}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ color: "var(--text-2)" }} />
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 !pl-11 !pr-4" autoComplete="email" inputMode="email" />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ color: "var(--text-2)" }} />
            <input type="password" placeholder="Şifre" value={pass} onChange={(e) => setPass(e.target.value)} className="h-12 !pl-11 !pr-4" autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </div>
          {err && <p className="text-xs font-semibold pt-1" style={{ color: "var(--danger)" }}>{err}</p>}
          <button onClick={submit} disabled={busy} className="btn-grad w-full rounded-full h-12 mt-1 font-extrabold flex items-center justify-center gap-2 disabled:opacity-50">
            <Sparkles size={18} />
            {busy ? "Bekleyin..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
