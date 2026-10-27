// Tappable and scroll-driven pieces of the /story page.
import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useTransform, useInView, MotionValue } from 'motion/react';
import { MAJOR_ARCANA } from '../data/tarotCards';
import { CardBack, CardFace } from '../components/cards';
import { sigilLetters, sigilPath, sigilPoints, WHEEL_LETTERS } from './sigil';
import { useL } from './lang';
import { useLanguage } from '../lib/language';
import { cardName } from '../lib/cards';

export const Hint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-graphite flex items-center gap-1.5">
    <span aria-hidden="true">✦</span> {children}
  </p>
);

/** A photo slot that shows a drawn placeholder until the real file exists */
export const Polaroid: React.FC<{ src: string; caption: string; placeholder: React.ReactNode; tilt?: number; width?: number }> = ({
  src,
  caption,
  placeholder,
  tilt = -4,
  width = 220,
}) => {
  const [missing, setMissing] = useState(false);
  return (
    <figure
      className="bg-white border-2 border-ink p-2.5 pb-3 shadow-hard-lg max-w-full"
      style={{ width, transform: `rotate(${tilt}deg)` }}
    >
      <div className="aspect-square bg-sky/50 border-[1.5px] border-ink overflow-hidden flex items-center justify-center">
        {missing ? placeholder : <img src={src} alt={caption} className="w-full h-full object-cover" onError={() => setMissing(true)} />}
      </div>
      <figcaption className="font-display text-[20px] uppercase text-center mt-2 leading-none">{caption}</figcaption>
    </figure>
  );
};

// ── Prologue ────────────────────────────────────────────────────────────────

/** "La Vía del Tarot": tap the cover to open the book */
export const Book: React.FC = () => {
  const l = useL();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        aria-label={l('Abrir el libro', 'Open the book')}
        className="relative w-[240px] h-[320px] perspective"
      >
        {/* inside page */}
        <div className="absolute inset-0 bg-white border-2 border-ink rounded-r-[8px] shadow-hard-lg flex flex-col justify-center gap-3 px-6 text-left">
          <p className="font-mono text-[11px] uppercase tracking-widest">{l('Capítulo I', 'Chapter I')}</p>
          <p className="font-display text-[26px] leading-[0.95] uppercase">{l('La Vía del Tarot', 'The Way of Tarot')}</p>
          <p className="text-[13px] leading-snug">Alejandro Jodorowsky &amp; Marianne Costa</p>
          <p className="italic font-semibold text-[17px] leading-snug border-l-[3px] border-ink pl-3">{l('“mi biblia del Tarot”', '“my Tarot bible”')}</p>
          <p className="text-[12px] text-graphite">{l('Un regalo de mi mamá.', 'A gift from my mom.')}</p>
        </div>
        {/* cover */}
        <motion.div
          className="absolute inset-0 preserve-3d origin-left"
          animate={{ rotateY: open ? -165 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 backface-hidden bg-yellow border-2 border-ink rounded-r-[8px] flex flex-col items-center justify-center gap-4 star-pattern-bg">
            <div className="absolute inset-[10px] border-[1.5px] border-ink rounded-[4px] star-pattern opacity-25" />
            <span className="relative font-display text-[34px] leading-[0.9] uppercase text-center">{l(<>La Vía<br />del Tarot</>, <>The Way<br />of Tarot</>)}</span>
            <span className="relative w-16 h-16 rounded-full bg-white border-2 border-ink flex items-center justify-center">
              <img src="/brand/logo.webp" alt="" className="w-12" />
            </span>
          </div>
          <div className="absolute inset-0 backface-hidden bg-sky border-2 border-ink rounded-l-[8px]" style={{ transform: 'rotateY(180deg)' }} />
        </motion.div>
      </button>
      <Hint>{open ? l('Toca para cerrarlo', 'Tap to close it') : l('Toca el libro para abrirlo', 'Tap the book to open it')}</Hint>
    </div>
  );
};

/** Coffee cup seen from above: tap to read the grounds */
export const CoffeeCup: React.FC = () => {
  const l = useL();
  const [read, setRead] = useState(false);
  const grounds = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const a = Math.random() * Math.PI * 2;
        const r = 6 + Math.random() * 22;
        return { id: i, x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r, s: 1.2 + Math.random() * 1.8 };
      }),
    [],
  );
  // When read, the grounds settle into a crescent moon and a four-pointed star
  const shape = useMemo(
    () =>
      grounds.map((g, i) => {
        if (i < 28) {
          const t = (i / 27) * Math.PI * 1.25 + Math.PI * 0.35;
          return { x: 44 + Math.cos(t) * 16, y: 52 + Math.sin(t) * 16 };
        }
        const k = i - 28;
        const arm = k % 4;
        const d = 3 + Math.floor(k / 4) * 3;
        const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        return { x: 62 + dirs[arm][0] * d, y: 40 + dirs[arm][1] * d };
      }),
    [grounds],
  );
  return (
    <div className="flex flex-col items-center gap-3">
      <button type="button" onClick={() => setRead((r) => !r)} aria-pressed={read} aria-label={l('Leer la taza de café', 'Read the coffee cup')} className="relative w-[230px] h-[230px]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="52" rx="47" ry="45" fill="#fff" stroke="#111" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="36" fill="#f3ead8" stroke="#111" strokeWidth="1.5" />
          <path d="M 86 44 q 13 6 0 14" fill="none" stroke="#111" strokeWidth="2.2" />
          {grounds.map((g, i) => (
            <motion.circle
              key={g.id}
              r={g.s / 2}
              fill="#3b2a1c"
              initial={false}
              animate={read ? { cx: shape[i].x, cy: shape[i].y } : { cx: g.x, cy: g.y }}
              transition={{ duration: 1.2, delay: i * 0.012, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
      </button>
      <AnimatePresence mode="wait">
        <motion.div key={String(read)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {read ? (
            <p className="bg-yellow border-2 border-ink rounded-[12px] px-3 py-1.5 font-display uppercase text-[18px] -rotate-1">{l('una luna y una estrella', 'a moon and a star')}</p>
          ) : (
            <Hint>{l('Toca la taza para leer el café', 'Tap the cup to read the coffee grounds')}</Hint>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/** 78 arcana given away one by one */
export const SeventyEight: React.FC = () => {
  const l = useL();
  const { language } = useLanguage();
  const [given, setGiven] = useState<Set<number>>(new Set());
  const [kept] = useState(() => MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)]);
  const left = 78 - given.size;
  const give = (i: number) => setGiven((g) => new Set(g).add(i));
  const giveAll = () => {
    for (let i = 0; i < 78; i++) setTimeout(() => give(i), i * 28);
  };
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-baseline gap-3">
        <motion.span key={left} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="font-display text-[64px] leading-none tabular-nums">
          {left}
        </motion.span>
        <span className="text-[15px]">{left === 1 ? l('arcano en el mazo', 'arcanum in the deck') : l('arcanos en el mazo', 'arcana in the deck')}</span>
      </div>
      <div className="relative grid grid-cols-13 gap-1 w-full max-w-[560px]" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
        {Array.from({ length: 78 }, (_, i) => (
          <motion.button
            key={i}
            type="button"
            aria-label={l(`Regalar el arcano ${i + 1}`, `Give away arcanum ${i + 1}`)}
            onClick={() => give(i)}
            disabled={given.has(i)}
            animate={
              given.has(i)
                ? { y: -220 - Math.random() * 200, x: (Math.random() - 0.5) * 300, rotate: (Math.random() - 0.5) * 120, opacity: 0 }
                : { y: 0, x: 0, rotate: 0, opacity: 1 }
            }
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="aspect-[526/810]"
          >
            <span className="block w-full h-full bg-yellow border-[1.5px] border-ink rounded-[2px] star-pattern-bg" />
          </motion.button>
        ))}
      </div>
      {left > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <Hint>{l('Toca las cartas para regalarlas', 'Tap the cards to give them away')}</Hint>
          <button type="button" onClick={giveAll} className="rounded-full border-2 border-ink bg-sky px-4 py-1.5 font-mono text-[11px] uppercase shadow-hard">
            {l('regalarlas todas', 'give them all away')}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 text-center">
          <p className="italic font-semibold text-[19px] max-w-[30ch]">{l('A veces me pregunto si aún conservarán esa carta que les di.', 'Sometimes I wonder if they still keep the card I gave them.')}</p>
          <CardFace card={kept} alt={cardName(kept, language)} className="w-[110px] shadow-hard rotate-3" />
          <p className="font-mono text-[11px] uppercase">
            {l(`¿y si alguien todavía guarda ${kept.spanishName.toLowerCase()}?`, `what if someone still keeps ${kept.name.toLowerCase()}?`)}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// ── 2019 ────────────────────────────────────────────────────────────────────

/** A dull spreadsheet that cracks open into sun rays when it scrolls into view */
export const Epiphany: React.FC = () => {
  const l = useL();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} className="relative w-full max-w-[560px] h-[300px] border-2 border-ink rounded-[14px] overflow-hidden bg-white">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-8">
        {Array.from({ length: 48 }, (_, i) => (
          <span key={i} className="border-r border-b border-ink/15 font-mono text-[11px] text-ink/30 px-1 truncate">
            {i % 7 === 0 ? 'TOTAL' : i % 5 === 0 ? '=SUM()' : ''}
          </span>
        ))}
      </div>
      <motion.div
        className="absolute inset-0 rays flex items-center justify-center p-6"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={inView ? { clipPath: 'circle(75% at 50% 50%)' } : {}}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.65, 0, 0.35, 1] }}
      >
        <p className="font-display uppercase text-[34px] leading-[0.95] text-center max-w-[14ch]">
          {l('quisiera ganarme la vida leyendo el Tarot', "I'd like to make a living reading Tarot")}
        </p>
      </motion.div>
    </div>
  );
};

/** Word of mouth: friends recommend friends, drawn as you scroll */
export const WordOfMouth: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const l = useL();
  const nodes = [
    { x: 50, y: 50, r: 7, label: l('yo', 'me') },
    { x: 24, y: 30, r: 4 }, { x: 78, y: 26, r: 4 }, { x: 28, y: 76, r: 4 }, { x: 74, y: 74, r: 4 },
    { x: 8, y: 14, r: 2.6 }, { x: 10, y: 48, r: 2.6 }, { x: 44, y: 8, r: 2.6 }, { x: 94, y: 46, r: 2.6 },
    { x: 92, y: 8, r: 2.6 }, { x: 8, y: 92, r: 2.6 }, { x: 52, y: 94, r: 2.6 }, { x: 94, y: 92, r: 2.6 },
  ];
  const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [1, 7], [2, 7], [2, 8], [2, 9], [3, 10], [3, 11], [4, 11], [4, 12], [4, 8]];
  const draw = useTransform(progress, [0.15, 0.55], [0, 1]);
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[420px]">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#111"
          strokeWidth="0.7"
          style={{ pathLength: draw }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.g key={i} style={{ opacity: useTransform(progress, [0.12 + (i / nodes.length) * 0.4, 0.18 + (i / nodes.length) * 0.4], [0, 1]) }}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={i === 0 ? '#ffff0f' : i < 5 ? '#baeaee' : '#fff'} stroke="#111" strokeWidth="0.8" />
          {n.label && (
            <text x={n.x} y={n.y + 1.6} textAnchor="middle" fontSize="4.5" fontFamily="Viaoda Libre">{n.label}</text>
          )}
        </motion.g>
      ))}
    </svg>
  );
};

/** Words that land like stamps when they scroll into view */
export const Stamps: React.FC<{ words: string[]; colors?: string[] }> = ({ words, colors = ['bg-yellow', 'bg-sky', 'bg-white'] }) => (
  <div className="flex flex-wrap justify-center gap-2.5">
    {words.map((w, i) => (
      <motion.span
        key={w}
        initial={{ scale: 2.2, opacity: 0, rotate: -12 }}
        whileInView={{ scale: 1, opacity: 1, rotate: i % 2 ? 3 : -3 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 16, delay: i * 0.18 }}
        className={`${colors[i % colors.length]} border-2 border-ink rounded-[10px] px-3 py-1 font-display uppercase text-[20px] shadow-hard`}
      >
        {w}
      </motion.span>
    ))}
  </div>
);

// ── Pause ───────────────────────────────────────────────────────────────────

/** The Hanged Man turns upright as you scroll */
export const HangedTurn: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const rotate = useTransform(progress, [0.2, 0.7], [0, 180]);
  const l = useL();
  const card = MAJOR_ARCANA.find((c) => c.id === 12)!;
  return (
    <motion.div style={{ rotate }} className="w-[150px]">
      <CardFace card={card} alt={l('El Colgado', 'The Hanged Man')} className="w-full shadow-hard-lg" />
    </motion.div>
  );
};

// ── Sagittarius ─────────────────────────────────────────────────────────────

export const Arrow: React.FC = () => (
  <motion.div
    initial={{ x: '-60vw', rotate: -8 }}
    whileInView={{ x: '0vw', rotate: -8 }}
    viewport={{ once: true, amount: 0.9 }}
    transition={{ duration: 0.8, ease: [0.2, 0.9, 0.3, 1.2] }}
    className="font-display text-[88px] leading-none select-none"
    aria-hidden="true"
  >
    ♐︎
  </motion.div>
);

// ── Life happened ───────────────────────────────────────────────────────────

export interface LifeEvent {
  text: string;
  color: string;
  art?: React.ReactNode;
}

/** A stack of cards: tap the top one to move through what happened */
export const LifeDeck: React.FC<{ events: LifeEvent[] }> = ({ events }) => {
  const l = useL();
  const [i, setI] = useState(0);
  const done = i >= events.length;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[270px] h-[340px]">
        {events.map((e, n) => {
          if (n < i) return null;
          const depth = n - i;
          return (
            <motion.button
              key={n}
              type="button"
              onClick={() => depth === 0 && setI(i + 1)}
              aria-label={depth === 0 ? `${e.text}. ${l('Toca para seguir', 'Tap to continue')}` : undefined}
              tabIndex={depth === 0 ? 0 : -1}
              className={`absolute inset-0 ${e.color} border-2 border-ink rounded-[16px] shadow-hard-lg flex flex-col items-center justify-center gap-4 p-6 text-center`}
              style={{ zIndex: events.length - n }}
              initial={false}
              animate={{ y: depth * 8, x: depth * 4, rotate: depth === 0 ? 0 : depth % 2 ? 3 : -2, scale: 1 - depth * 0.03 }}
              exit={{ x: 400, rotate: 25, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              {e.art}
              <span className="font-display uppercase text-[28px] leading-[0.95]">{e.text}</span>
              {depth === 0 && <span className="font-mono text-[11px] uppercase">{n + 1} / {events.length} · {l('toca', 'tap')}</span>}
            </motion.button>
          );
        })}
        {done && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <p className="font-display uppercase text-[30px] leading-[0.95]">{l('y finalmente sentí el llamado', 'and finally I felt the call')}</p>
            <button type="button" onClick={() => setI(0)} className="font-mono text-[11px] uppercase underline underline-offset-2">{l('volver a empezar', 'start over')}</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ── Apps ────────────────────────────────────────────────────────────────────

/** A tiny monedaire: a coin with three faces */
export const MiniCoin: React.FC = () => {
  const l = useL();
  const faces = [
    { label: l('SÍ', 'YES'), bg: 'bg-yellow' },
    { label: 'NO', bg: 'bg-sky' },
    { label: '?', bg: 'bg-white', note: l('¿qué resultado esperabas?', 'what result were you hoping for?') },
  ];
  const [face, setFace] = useState<number | null>(null);
  const [spins, setSpins] = useState(0);
  const flip = () => {
    setSpins((s) => s + 1);
    setFace(null);
    setTimeout(() => setFace(Math.floor(Math.random() * 3)), 900);
  };
  const f = face === null ? null : faces[face];
  return (
    <div className="flex flex-col items-center gap-3">
      <button type="button" onClick={flip} aria-label={l('Lanzar la moneda', 'Flip the coin')} className="perspective">
        <motion.span
          animate={{ rotateY: spins * 1080, y: [0, -70, 0] }}
          key={spins}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`w-[120px] h-[120px] rounded-full border-[3px] border-ink shadow-hard-lg flex items-center justify-center font-display text-[46px] ${f ? f.bg : 'bg-white'}`}
          style={{ display: 'flex' }}
        >
          {f ? f.label : '✦'}
        </motion.span>
      </button>
      <p className="min-h-[1.5em] text-[15px] italic">{f?.note ?? (spins ? '' : l('tócala: tiene tres caras', 'tap it: it has three sides'))}</p>
    </div>
  );
};

// ── The four aces ───────────────────────────────────────────────────────────

const ACES = [
  { file: 'emocional', word: 'emocional', wordEn: 'emotional', back: 'bg-sky' },
  { file: 'intelectual', word: 'intelectual', wordEn: 'intellectual', back: 'bg-yellow' },
  { file: 'material', word: 'material', wordEn: 'material', back: 'bg-sky' },
  { file: 'creativo', word: 'creativo', wordEn: 'creative', back: 'bg-yellow' },
];

export const Aces: React.FC = () => {
  const l = useL();
  const [open, setOpen] = useState<Set<number>>(new Set());
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-4 gap-2.5 w-full max-w-[520px]">
        {ACES.map((a, i) => (
          <button
            key={a.file}
            type="button"
            onClick={() => setOpen((o) => { const n = new Set(o); n.has(i) ? n.delete(i) : n.add(i); return n; })}
            aria-pressed={open.has(i)}
            aria-label={l(a.word, a.wordEn)}
            className="perspective aspect-[3/4]"
          >
            <motion.span className="relative block w-full h-full preserve-3d" animate={{ rotateY: open.has(i) ? 180 : 0 }} transition={{ duration: 0.6 }}>
              <span className="absolute inset-0 backface-hidden border-2 border-ink rounded-[10px] bg-white overflow-hidden shadow-hard">
                <img src={`/suits/${a.file}.webp`} alt="" className="w-full h-full object-contain" />
              </span>
              <span
                className={`absolute inset-0 backface-hidden ${a.back} border-2 border-ink rounded-[10px] flex items-center justify-center shadow-hard`}
                style={{ transform: 'rotateY(180deg)' }}
              >
                <span className="font-display uppercase text-[15px] sm:text-[19px] -rotate-90 sm:rotate-0">{l(a.word, a.wordEn)}</span>
              </span>
            </motion.span>
          </button>
        ))}
      </div>
      <Hint>{l('Toca cada as', 'Tap each ace')}</Hint>
    </div>
  );
};

// ── Sigils ──────────────────────────────────────────────────────────────────

export const SigilMaker: React.FC = () => {
  const l = useL();
  const [text, setText] = useState(() => l('quiero accionar', 'i take action'));
  const letters = sigilLetters(text);
  const points = sigilPoints(letters);
  const d = sigilPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  // End bar perpendicular to the last stroke
  const bar = (() => {
    if (!last) return null;
    const dx = last.x - (prev?.x ?? 50);
    const dy = last.y - (prev?.y ?? 50);
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * 4;
    const ny = (dx / len) * 4;
    return { x1: last.x - nx, y1: last.y - ny, x2: last.x + nx, y2: last.y + ny };
  })();
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <label htmlFor="sigil-intent" className="font-mono text-[11px] uppercase">{l('Escribe una intención', 'Write an intention')}</label>
      <input
        id="sigil-intent"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 40))}
        className="w-full max-w-[340px] rounded-full border-2 border-ink bg-white px-4 py-2 text-[16px] text-center outline-none focus:bg-yellow/40"
      />
      <svg viewBox="0 0 100 100" className="w-[280px] max-w-full" role="img" aria-label={l(`Sigilo hecho con las letras ${letters.join(' ')}`, `Sigil made from the letters ${letters.join(' ')}`)}>
        <circle cx="50" cy="50" r="46" fill="#fff" stroke="#111" strokeWidth="0.8" />
        {WHEEL_LETTERS.map((l, i) => {
          const a = (i / WHEEL_LETTERS.length) * Math.PI * 2 - Math.PI / 2;
          const on = letters.includes(l);
          return (
            <text key={l} x={50 + Math.cos(a) * 43} y={50 + Math.sin(a) * 43 + 1.3} textAnchor="middle" fontSize="3.6" fontFamily="DM Mono" fill={on ? '#111' : '#bbb'}>
              {l}
            </text>
          );
        })}
        <motion.path key={d} d={d} fill="none" stroke="#111" strokeWidth="1.6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
        {first && <circle cx={first.x} cy={first.y} r="2.4" fill="#ffff0f" stroke="#111" strokeWidth="1" />}
        {bar && <line {...bar} stroke="#111" strokeWidth="1.6" strokeLinecap="round" />}
      </svg>
      <p className="text-[13px] text-graphite text-center max-w-[36ch]">
        {l('Sin vocales ni letras repetidas: ', 'No vowels or repeated letters: ')}
        <b className="font-mono">{letters.join(' ') || '—'}</b>.{' '}
        {l('Cada letra se une en la rueda del alfabeto.', 'Each letter is joined on the alphabet wheel.')}
      </p>
    </div>
  );
};

// ── Stars ───────────────────────────────────────────────────────────────────

/** Scattered stars that line up as you scroll */
export const AligningStars: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const stars = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ sx: 8 + Math.random() * 84, sy: 10 + Math.random() * 80, tx: 10 + i * 10, ty: 50 })),
    [],
  );
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[560px]">
      <motion.line x1="6" y1="50" x2="94" y2="50" stroke="#111" strokeWidth="0.4" strokeDasharray="1 1.5" style={{ opacity: useTransform(progress, [0.45, 0.6], [0, 1]) }} />
      {stars.map((s, i) => (
        <Star key={i} s={s} progress={progress} />
      ))}
    </svg>
  );
};

const Star: React.FC<{ s: { sx: number; sy: number; tx: number; ty: number }; progress: MotionValue<number> }> = ({ s, progress }) => {
  const x = useTransform(progress, [0.15, 0.55], [s.sx, s.tx]);
  const y = useTransform(progress, [0.15, 0.55], [s.sy, s.ty]);
  return (
    <motion.path
      d="M0 -5 C0.6 -1.2 1.2 -0.6 5 0 C1.2 0.6 0.6 1.2 0 5 C-0.6 1.2 -1.2 0.6 -5 0 C-1.2 -0.6 -0.6 -1.2 0 -5 Z"
      fill="#ffff0f"
      stroke="#111"
      strokeWidth="0.5"
      style={{ x, y }}
    />
  );
};

// ── The last card ───────────────────────────────────────────────────────────

export const NextCard: React.FC = () => {
  const l = useL();
  const { language } = useLanguage();
  const [card] = useState(() => MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)]);
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button type="button" onClick={() => setFlipped(true)} aria-label={l('Voltear tu carta', 'Turn your card')} className="perspective w-[150px] aspect-[526/810]">
        <motion.span className="relative block w-full h-full preserve-3d" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.8 }}>
          <span className="absolute inset-0 backface-hidden"><CardBack className="w-full h-full shadow-hard-lg" /></span>
          <span className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
            <CardFace card={card} alt={cardName(card, language)} className="w-full h-full shadow-hard-lg" />
          </span>
        </motion.span>
      </button>
      {flipped ? (
        <p className="font-display uppercase text-[22px]">{cardName(card, language)}</p>
      ) : (
        <Hint>{l('Hay una carta para ti', "There's a card for you")}</Hint>
      )}
    </div>
  );
};
