import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import type { CoupleState } from "./types";
import { loadLocal, saveLocal, clearLocal, pushState, makeCode, createCouple, fetchState } from "./server";
import { uid, emptyState } from "./types";

interface Ctx {
  state: CoupleState | null;
  loading: boolean;
  online: boolean;
  update: (fn: (s: CoupleState) => CoupleState) => void;
  create: (p1: { name: string; avatar: string }, p2: { name: string; avatar: string }, startDate: string) => Promise<void>;
  join: (code: string) => Promise<boolean>;
  reset: () => void;
}

const StoreCtx = createContext<Ctx>(null as any);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CoupleState | null>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const applyingRemote = useRef(false);
  const pushTimer = useRef<number | null>(null);

  // LocalStorage'dan yükle
  useEffect(() => {
    const local = loadLocal();
    if (local) setState(local);
    setLoading(false);
  }, []);

  // Socket bağlantısı
  useEffect(() => {
    if (!state?.code) return;
    const s = io({ transports: ["websocket", "polling"] });
    socketRef.current = s;
    s.on("connect", () => {
      setOnline(true);
      s.emit("join", state.code);
    });
    s.on("disconnect", () => setOnline(false));
    s.on("state", (remote: CoupleState) => {
      if (applyingRemote.current) return;
      if (remote.updatedAt > (state?.updatedAt ?? 0)) {
        applyingRemote.current = true;
        setState(remote);
        saveLocal(remote);
        setTimeout(() => (applyingRemote.current = false), 300);
      }
    });
    return () => {
      s.disconnect();
    };
  }, [state?.code]);

  // Değişiklikleri kaydet (debounce push)
  useEffect(() => {
    if (!state || applyingRemote.current) return;
    saveLocal(state);
    if (pushTimer.current) window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(async () => {
      try {
        const res = await pushState(state);
        if (res?.stale && res.state) {
          applyingRemote.current = true;
          setState(res.state);
          saveLocal(res.state);
          setTimeout(() => (applyingRemote.current = false), 300);
        }
      } catch {
        /* çevrimdışı — local yeter */
      }
    }, 600);
  }, [state]);

  const update = (fn: (s: CoupleState) => CoupleState) => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...fn(prev), updatedAt: Date.now() };
    });
  };

  const create: Ctx["create"] = async (p1, p2, startDate) => {
    const code = makeCode();
    const fresh = emptyState(code, p1, p2, startDate);
    setState(fresh);
    saveLocal(fresh);
    try {
      await createCouple(code, fresh);
    } catch {
      /* sadece local çalışır */
    }
  };

  const join: Ctx["join"] = async (codeRaw) => {
    const code = codeRaw.toUpperCase().trim();
    const remote = await fetchState(code);
    if (!remote) return false;
    setState(remote);
    saveLocal(remote);
    return true;
  };

  const reset = () => {
    clearLocal();
    setState(null);
  };

  return (
    <StoreCtx.Provider value={{ state, loading, online, update, create, join, reset }}>
      {children}
    </StoreCtx.Provider>
  );
}

export { uid };
