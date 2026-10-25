import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore, StoreProvider } from "./lib/store";
import TabBar, { type TabId } from "./components/TabBar";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Tasks from "./pages/Tasks";
import Memories from "./pages/Memories";
import Profile from "./pages/Profile";
import CoupleSetup from "./pages/CoupleSetup";

function Shell() {
  const { state, loading } = useStore();
  const [tab, setTab] = useState<TabId>("home");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state?.theme ?? "dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    const bg = state?.theme === "light" ? "#f4f2fb" : state?.theme === "romantic" ? "#1a0a17" : "#0b0b14";
    if (meta) meta.setAttribute("content", bg);
  }, [state?.theme]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <motion.p animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">💘</motion.p>
      </div>
    );
  }

  if (!state) return <CoupleSetup />;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="relative z-10 mx-auto max-w-md min-h-full"
        >
          {tab === "home" && <Home />}
          {tab === "games" && <Games />}
          {tab === "tasks" && <Tasks />}
          {tab === "memories" && <Memories />}
          {tab === "profile" && <Profile />}
        </motion.div>
      </AnimatePresence>
      <TabBar active={tab} onChange={setTab} />
    </>
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
