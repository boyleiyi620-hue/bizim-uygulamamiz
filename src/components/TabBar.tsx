import { motion } from "framer-motion";
import { Sparkles, Gamepad2, ListChecks, Camera, Heart } from "lucide-react";

const TABS = [
  { id: "home", label: "Ana", icon: Sparkles },
  { id: "games", label: "Oyun", icon: Gamepad2 },
  { id: "tasks", label: "Görev", icon: ListChecks },
  { id: "memories", label: "Anı", icon: Camera },
  { id: "profile", label: "Biz", icon: Heart },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export default function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-b">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="relative glass rounded-full flex items-center justify-between px-2 py-1.5 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className="relative flex items-center gap-2 px-3 py-2 rounded-full"
              >
                {on && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--grad)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <Icon size={18} strokeWidth={on ? 2.4 : 1.8} className="relative" color={on ? "#fff" : "var(--text-2)"} />
                {on && (
                  <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="relative text-xs font-extrabold text-white">
                    {t.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
