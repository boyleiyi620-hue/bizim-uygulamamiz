import { motion } from "framer-motion";
import { Home, Gamepad2, ListChecks, Camera, Heart } from "lucide-react";

const TABS = [
  { id: "home", label: "Ana Sayfa", icon: Home },
  { id: "games", label: "Oyunlar", icon: Gamepad2 },
  { id: "tasks", label: "Görevler", icon: ListChecks },
  { id: "memories", label: "Anılar", icon: Camera },
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
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-b">
      <div className="mx-auto max-w-md px-3 pb-2">
        <div className="glass rounded-[26px] flex items-center justify-around py-2 px-1 shadow-2xl">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 w-[19%] transition-colors"
                style={{ color: on ? "var(--accent)" : "var(--text-2)" }}
              >
                {on && (
                  <motion.span
                    layoutId="tab-glow"
                    className="absolute -top-0.5 h-9 w-9 rounded-full opacity-25 blur-md"
                    style={{ background: "var(--grad)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={22} strokeWidth={on ? 2.4 : 1.8} />
                <span className={`text-[10px] ${on ? "font-bold" : "font-medium"}`}>
                  {t.label}
                </span>
                {on && (
                  <motion.span
                    layoutId="tab-dot"
                    className="absolute -bottom-0.5 h-1 w-4 rounded-full"
                    style={{ background: "var(--grad)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
