import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore, StoreProvider } from "./lib/store";
import TabBar from "./components/TabBar";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Tasks from "./pages/Tasks";
import Memories from "./pages/Memories";
import Profile from "./pages/Profile";
import CoupleSetup from "./pages/CoupleSetup";
import { Sparkles, Gamepad2, ListChecks, Camera, Heart as HeartIcon } from "lucide-react";

const VIEWS = [
  { id: "home", label: "Ana Sayfa", icon: Sparkles, component: Home },
  { id: "games", label: "Oyunlar", icon: Gamepad2, component: Games },
  { id: "tasks", label: "Görevler", icon: ListChecks, component: Tasks },
  { id: "memories", label: "Anılar", icon: Camera, component: Memories },
  { id: "profile", label: "Biz", icon: HeartIcon, component: Profile },
] as const;

function Shell() {
  const { state, loading } = useStore();
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("home");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state?.theme ?? "neon");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#05030b");
  }, [state?.theme]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.16, 1], rotate: [0, -4, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-14 h-14 rounded-3xl"
          style={{ background: "var(--grad)" }}
        />
      </div>
    );
  }

  if (!state) return <CoupleSetup />;

  const Active = VIEWS.find((v) => v.id === view)?.component ?? Home;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[38dvh]">
        <div className="absolute inset-x-[-20%] top-[-40%] h-full rounded-full blur-[160px] opacity-60" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 32%, transparent), transparent)" }} />
        <div className="absolute inset-x-[20%] top-[-30%] h-full rounded-full blur-[180px] opacity-40" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent-2) 26%, transparent), transparent)" }} />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-md min-h-full flex flex-col px-0 pb-[calc(env(safe-area-inset-bottom,0px)+96px)]">
        <header className="flex items-center justify-between px-4 sm:px-5 pt-[calc(env(safe-area-inset-top,12px)+14px)]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em]" style={{ color: "var(--text-2)" }}>BİZİM HİKAYEMİZ</p>
            <p className="text-lg font-extrabold">{state.p1.name} & {state.p2.name}</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent-2)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>birlikte</span>
          </div>
        </header>
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
              transition={{ duration: 0.28, ease: [0.25, 0.8, 0.25, 1] }}
              className="min-h-full"
            >
              <Active />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <TabBar active={view} onChange={setView} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="aurora" />
      <Shell />
    </StoreProvider>
  );
}
