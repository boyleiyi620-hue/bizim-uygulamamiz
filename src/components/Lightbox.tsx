import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

export default function Lightbox({
  open,
  src,
  onClose,
}: {
  open: boolean;
  src: string | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && src && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/90" onClick={onClose} />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white">
            <X size={20} />
          </button>
          <motion.img
            src={src}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            className="relative max-w-[95vw] max-h-[90dvh] object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
