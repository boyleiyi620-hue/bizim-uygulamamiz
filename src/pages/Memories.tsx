import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Plus, Trash2, CalendarHeart, Film, Upload } from "lucide-react";
import { useStore } from "../lib/store";
import { uid, fmtDate, daysUntilNext } from "../lib/utils";
import Sheet from "../components/Sheet";
import Lightbox from "../components/Lightbox";

type Seg = "photos" | "days" | "watch";

async function compress(file: File): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = URL.createObjectURL(file);
  });
  const max = 1000;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.75);
}

export default function Memories() {
  const { state, update } = useStore();
  const [seg, setSeg] = useState<Seg>("photos");
  const [daySheet, setDaySheet] = useState(false);
  const [watchSheet, setWatchSheet] = useState(false);
  const [noteSheet, setNoteSheet] = useState(false);
  const [note, setNote] = useState("");
  const [dTitle, setDTitle] = useState("");
  const [dDate, setDDate] = useState("");
  const [dEmoji, setDEmoji] = useState("💕");
  const [wTitle, setWTitle] = useState("");
  const [wType, setWType] = useState<"Film" | "Dizi">("Film");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [lb, setLb] = useState<string | null>(null);

  const photos = state!.photos;

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    try {
      const dataUrl = await compress(f);
      update((s) => ({
        ...s,
        photos: [{ id: uid(), dataUrl, note: note.trim(), date: new Date().toISOString() }, ...s.photos].slice(0, 120),
      }));
      setNote("");
      setNoteSheet(false);
    } finally {
      setUploading(false);
    }
  };

  const addDay = () => {
    if (!dTitle.trim() || !dDate) return;
    update((s) => ({
      ...s,
      specialDays: [...s.specialDays, { id: uid(), title: dTitle.trim(), date: dDate, emoji: dEmoji }],
    }));
    setDTitle(""); setDDate(""); setDaySheet(false);
  };

  const addWatch = () => {
    if (!wTitle.trim()) return;
    update((s) => ({
      ...s,
      scores: [
        { id: uid(), game: `WATCH:${wType}:${wTitle.trim()}`, winner: "beraber", p1: 0, p2: 0, date: new Date().toISOString() },
        ...s.scores,
      ],
    }));
    setWTitle("");
    setWatchSheet(false);
  };

  const watchItems = state!.scores.filter((x) => x.game.startsWith("WATCH:"));
  const days = [...state!.specialDays].sort(
    (a, b) => daysUntilNext(a.date) - daysUntilNext(b.date)
  );

  const segs: { id: Seg; label: string; icon: any }[] = [
    { id: "photos", label: "Anılar", icon: Camera },
    { id: "days", label: "Özel Günler", icon: CalendarHeart },
    { id: "watch", label: "İzle", icon: Film },
  ];

  return (
    <div className="px-5 pt-4 pb-28">
      <h1 className="text-2xl font-extrabold mb-4">Anılar 📸</h1>

      <div className="glass rounded-full p-1 flex mb-5">
        {segs.map((sg) => {
          const Icon = sg.icon;
          const on = seg === sg.id;
          return (
            <button key={sg.id} onClick={() => setSeg(sg.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-extrabold relative" style={{ color: on ? "#fff" : "var(--text-2)" }}>
              {on && <motion.span layoutId="seg-bg2" className="absolute inset-0 rounded-full" style={{ background: "var(--grad)" }} transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
              <span className="relative flex items-center gap-1.5"><Icon size={14} /> {sg.label}</span>
            </button>
          );
        })}
      </div>

      {seg === "photos" && (
        <>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <button
            onClick={() => {
              setNoteSheet(true);
            }}
            className="btn-grad w-full rounded-2xl py-3.5 mb-5 font-extrabold text-sm flex items-center justify-center gap-2"
          >
            {uploading ? "Yükleniyor..." : <><Plus size={18} /> Anı ekle</>}
          </button>

          {photos.length === 0 && (
            <div className="glass rounded-[22px] p-8 text-center">
              <p className="text-4xl mb-2">🖼️</p>
              <p className="font-bold text-sm">Henüz anı yok — ilk fotoğrafı ekleyin</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {photos.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-[20px] overflow-hidden relative group">
                  <button onClick={() => setLb(p.dataUrl)} className="w-full">
                    <img src={p.dataUrl} alt="" className="w-full h-44 object-cover" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-2.5 pointer-events-none" style={{ background: "linear-gradient(transparent, rgba(0,0,0,.75))" }}>
                    <p className="text-[10px] font-bold text-white">{fmtDate(p.date)}</p>
                    {p.note && <p className="text-[11px] font-semibold text-white leading-tight">{p.note}</p>}
                  </div>
                  <button
                    onClick={() => update((s) => ({ ...s, photos: s.photos.filter((x) => x.id !== p.id) }))}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {seg === "days" && (
        <>
          <div className="space-y-3 mb-4">
            {days.map((d) => {
              const daysLeft = daysUntilNext(d.date);
              return (
                <div key={d.id} className="glass rounded-[22px] p-4 flex items-center gap-3">
                  <span className="text-3xl">{d.emoji}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-sm">{d.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-2)" }}>
                      {daysLeft === 0 ? "🎉 Bugün!" : `${daysLeft} gün kaldı`} · {d.date.slice(5).replace("-", ".")}
                    </p>
                  </div>
                  <button onClick={() => update((s) => ({ ...s, specialDays: s.specialDays.filter((x) => x.id !== d.id) }))} className="p-2 opacity-60">
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            {days.length === 0 && (
              <div className="glass rounded-[22px] p-8 text-center">
                <p className="text-4xl mb-2">📅</p>
                <p className="font-bold text-sm">Özel gün ekleyin, geri sayım başlasın</p>
              </div>
            )}
          </div>
          <button onClick={() => setDaySheet(true)} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold text-sm flex items-center justify-center gap-2">
            <Plus size={18} /> Özel gün ekle
          </button>
        </>
      )}

      {seg === "watch" && (
        <>
          <div className="space-y-3 mb-4">
            {watchItems.map((w) => {
              const [, type, ...rest] = w.game.split(":");
              const title = rest.join(":");
              return (
                <div key={w.id} className="glass rounded-[22px] p-4 flex items-center gap-3">
                  <span className="text-2xl">{type === "Film" ? "🎬" : "📺"}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-sm">{title}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-2)" }}>{type} · {fmtDate(w.date)}</p>
                  </div>
                  <button onClick={() => update((s) => ({ ...s, scores: s.scores.filter((x) => x.id !== w.id) }))} className="p-2 opacity-60">
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            {watchItems.length === 0 && (
              <div className="glass rounded-[22px] p-8 text-center">
                <p className="text-4xl mb-2">🍿</p>
                <p className="font-bold text-sm">Bugün ne izlesek? Listenizi oluşturun</p>
              </div>
            )}
          </div>
          <button onClick={() => setWatchSheet(true)} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold text-sm flex items-center justify-center gap-2">
            <Plus size={18} /> İzle listesine ekle
          </button>
        </>
      )}

      {/* Not sheet */}
      <Sheet open={noteSheet} onClose={() => setNoteSheet(false)} title="Yeni anı">
        <div className="space-y-3 pb-2">
          <input placeholder="Not (isteğe bağlı)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button onClick={() => fileRef.current?.click()} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold flex items-center justify-center gap-2">
            <Upload size={18} /> {uploading ? "Yükleniyor..." : "Fotoğraf seç"}
          </button>
        </div>
      </Sheet>

      {/* Özel gün sheet */}
      <Sheet open={daySheet} onClose={() => setDaySheet(false)} title="Özel gün">
        <div className="space-y-3 pb-2">
          <div className="flex gap-2 flex-wrap">
            {["💕", "🎂", "💞", "🌟", "🎄", "🥂", "🏆", "💐"].map((e) => (
              <button key={e} onClick={() => setDEmoji(e)} className="text-2xl p-2 rounded-xl" style={e === dEmoji ? { background: "var(--card-solid)", border: "1px solid var(--accent)" } : {}}>
                {e}
              </button>
            ))}
          </div>
          <input placeholder="Gün adı (örn: Yıldönümümüz)" value={dTitle} onChange={(e) => setDTitle(e.target.value)} />
          <input type="date" value={dDate} onChange={(e) => setDDate(e.target.value)} />
          <button onClick={addDay} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold">Ekle</button>
        </div>
      </Sheet>

      {/* İzle sheet */}
      <Sheet open={watchSheet} onClose={() => setWatchSheet(false)} title="İzle listesi">
        <div className="space-y-3 pb-2">
          <div className="flex gap-2">
            {(["Film", "Dizi"] as const).map((tp) => (
              <button key={tp} onClick={() => setWType(tp)} className="flex-1 py-2.5 rounded-2xl text-sm font-bold" style={tp === wType ? { background: "var(--grad)", color: "#fff" } : { background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                {tp === "Film" ? "🎬 Film" : "📺 Dizi"}
              </button>
            ))}
          </div>
          <input placeholder="Film/dizi adı" value={wTitle} onChange={(e) => setWTitle(e.target.value)} />
          <button onClick={addWatch} className="btn-grad w-full rounded-2xl py-3.5 font-extrabold">Ekle</button>
        </div>
      </Sheet>
      <Lightbox open={!!lb} src={lb} onClose={() => setLb(null)} />
    </div>
  );
}
