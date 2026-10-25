import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md glass-solid rounded-t-[28px] max-h-[88dvh] overflow-y-auto scrollbar-hide pb-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-4 pb-2 bg-[var(--card-solid)]">
              <div className="h-1.5 w-10 rounded-full absolute left-1/2 -translate-x-1/2 top-2 opacity-40" style={{ background: "var(--text-2)" }} />
              <h3 className="text-lg font-extrabold mt-2">{title}</h3>
              <button onClick={onClose} className="mt-2 p-1.5 rounded-full" style={{ background: "var(--card)" }}>
                <X size={18} />
              </button>
            </div>
            <div className="px-5 pt-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
