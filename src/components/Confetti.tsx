import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#FF4D8D", "#A855F7", "#FFD166", "#3DDC97", "#4CC9F0", "#FF9E7D"];

export default function Confetti({ show }: { show: boolean }) {
  const [pieces] = useState(() =>
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 320,
      rot: Math.random() * 720 - 360,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.2,
      size: 6 + Math.random() * 8,
    }))
  );
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: 420,
            scale: 0.6,
            rotate: p.rot,
          }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            borderRadius: 3,
          }}
        />
      ))}
    </div>
  );
}
