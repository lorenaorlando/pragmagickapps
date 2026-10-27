import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Share2 } from 'lucide-react';
import { GREETING_ID, StickerOracleItem } from './stickers';
import { DRAWABLE, useCollection } from './collection';
import { StickerImage } from './StickerImage';
import { CollectionModal } from './CollectionModal';
import { KitModal } from './KitModal';
import { shareChat } from './shareChat';
import { ASK_AGAIN_LABEL, ASK_LABEL, GREETING_QUESTION, KIT_OFFER, KIT_OFFER_BUTTON } from './copy';
import { ScreenHeader } from '../components/ScreenHeader';
import { whatsappUrl } from '../config/links';
import { track } from '../lib/analytics';

type NewMessage =
  | { from: 'her'; text: string }
  | { from: 'her'; stickerId: string }
  | { from: 'her'; kitOffer: true }
  | { from: 'me'; text: string };
type Message = NewMessage & { id: number };

const TYPING_MS = { short: 700, long: 1500 };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const Avatar = () => (
  <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase">
    <span className="w-6 h-6 rounded-full border-2 border-ink bg-yellow flex items-center justify-center font-display text-[13px] normal-case">A</span>
    señora de los stickers
  </div>
);

const Typing = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="self-start bg-white border-2 border-ink rounded-[16px] rounded-bl-[4px] px-3.5 py-2.5 flex gap-1"
    aria-label="escribiendo…"
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-ink"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18 }}
      />
    ))}
  </motion.div>
);

/** A sticker that looks like one: white die-cut tile, hard shadow and a peeled corner */
const StickerTile: React.FC<{ id: string; tilt: number; caption?: React.ReactNode }> = ({ id, tilt, caption }) => (
  <div className="self-start flex flex-col gap-1.5">
    <motion.div
      initial={{ scale: 1.25, opacity: 0, rotate: tilt * 3 }}
      animate={{ scale: 1, opacity: 1, rotate: tilt }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className="relative w-[150px] h-[150px] bg-white border-2 border-ink rounded-[24px] shadow-[4px_5px_0_#111] flex items-center justify-center p-3"
    >
      <StickerImage id={id} alt={id} className="w-full h-full rounded-[12px]" />
      <span
        aria-hidden="true"
        className="absolute -right-[2px] -top-[2px] w-7 h-7 border-l-2 border-b-2 border-ink rounded-bl-[8px] rounded-tr-[22px]"
        style={{ background: 'linear-gradient(225deg, #f6f8ee 50%, #dcdcdc 50%)' }}
      />
    </motion.div>
    {caption}
  </div>
);

export const AmigaOracleScreen: React.FC = () => {
  const { collected, draw, total, newInLatest } = useCollection();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(true);
  const [last, setLast] = useState<StickerOracleItem | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [kitOpen, setKitOpen] = useState(false);
  const draws = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const alive = useRef(true);

  const push = (m: NewMessage) => {
    if (alive.current) setMessages((prev) => [...prev, { ...m, id: nextId.current++ }]);
  };

  const herTurn = async (ms: number, m: NewMessage) => {
    setTyping(true);
    await wait(ms);
    setTyping(false);
    push(m);
  };

  // She greets with her own sticker and asks what happened (once, even if React mounts twice)
  const greeted = useRef(false);
  useEffect(() => {
    alive.current = true;
    if (!greeted.current) {
      greeted.current = true;
      (async () => {
        await herTurn(TYPING_MS.short, { from: 'her', stickerId: GREETING_ID });
        await herTurn(TYPING_MS.short, { from: 'her', text: GREETING_QUESTION });
        setBusy(false);
      })();
    }
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const ask = async () => {
    if (busy) return;
    setBusy(true);
    push({ from: 'me', text: last ? ASK_AGAIN_LABEL : ASK_LABEL });
    const sticker = draw();
    track('sticker_drawn', { sticker: sticker.id });
    await herTurn(TYPING_MS.long, { from: 'her', stickerId: sticker.id });
    await herTurn(TYPING_MS.short, { from: 'her', text: sticker.message });
    // After the third sticker she offers the whole set for WhatsApp and Telegram
    if (++draws.current === 3) {
      await herTurn(TYPING_MS.long, { from: 'her', text: KIT_OFFER });
      push({ from: 'her', kitOffer: true });
    }
    setLast(sticker);
    setBusy(false);
  };

  const share = async () => {
    if (!last) return;
    setSharing(true);
    try {
      track('share', { method: 'story', content_type: 'amigah' });
      await shareChat(last);
    } finally {
      setSharing(false);
    }
  };

  const stickerNumber = (id: string) => DRAWABLE.findIndex((s) => s.id === id) + 1;

  return (
    <div className="relative h-full flex flex-col">
      <ScreenHeader
        title="AMIGAAAAAAAH"
        back="/menu"
        right={<span className="shrink-0 font-display text-[15px] lowercase">en línea ●</span>}
      />

      <div
        ref={scroller}
        className="flex-1 min-h-0 overflow-y-auto px-3.5 py-4 flex flex-col gap-2.5 bg-[#f6f8ee]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <Avatar />
        {messages.map((m, i) =>
          'kitOffer' in m ? (
            <motion.button
              key={m.id}
              type="button"
              onClick={() => {
                track('kit_offer_click');
                setKitOpen(true);
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start flex items-center gap-2 bg-yellow border-2 border-ink rounded-[16px] rounded-bl-[4px] pl-1.5 pr-3.5 py-1.5 font-display text-[16px] uppercase shadow-hard"
            >
              <img src="/suits/emocional.webp" alt="" className="w-8 h-10 object-cover rounded-[6px] border-2 border-white" />
              {KIT_OFFER_BUTTON}
            </motion.button>
          ) : 'stickerId' in m ? (
            <StickerTile
              key={m.id}
              id={m.stickerId}
              tilt={i % 4 === 0 ? -5 : 4}
              caption={
                m.stickerId !== GREETING_ID && (
                  <span className="font-mono text-[9.5px] uppercase pl-1">sticker #{stickerNumber(m.stickerId)}</span>
                )
              }
            />
          ) : (
            <motion.p
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[82%] border-2 border-ink rounded-[16px] px-3.5 py-2 text-[14.5px] leading-snug whitespace-pre-line shadow-[2px_2px_0_#111] ${
                m.from === 'me' ? 'self-end bg-sky rounded-br-[4px]' : 'self-start bg-white rounded-bl-[4px]'
              }`}
            >
              {m.text}
            </motion.p>
          ),
        )}
        <AnimatePresence>{typing && <Typing />}</AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => setCollectionOpen(true)}
        className="shrink-0 border-t-2 border-ink bg-white px-3.5 py-2 flex items-center gap-2.5 font-mono text-[10px] uppercase"
        aria-label={`Colección: ${collected.length} de ${total}`}
      >
        colección
        <span className="flex-1 h-2.5 rounded-full border-2 border-ink overflow-hidden">
          <motion.span
            className="block h-full bg-ink"
            animate={{ width: `${(collected.length / total) * 100}%` }}
          />
        </span>
        <span className="tabular-nums">{collected.length}/{total}</span>
        {newInLatest > 0 && (
          <span className="bg-yellow border-[1.5px] border-ink rounded-full px-1.5">+{newInLatest} nuevos</span>
        )}
      </button>

      {last ? (
        <div className="shrink-0 grid grid-cols-3 border-t-2 border-ink font-display text-[14px] uppercase leading-[1.05]">
          <button type="button" onClick={ask} disabled={busy} className="bg-yellow px-1 py-3 disabled:opacity-60">
            {ASK_AGAIN_LABEL}
          </button>
          <button
            type="button"
            onClick={share}
            disabled={busy || sharing}
            className="bg-sky px-1 py-3 border-x-2 border-ink flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" /> Compartir
          </button>
          <a
            href={whatsappUrl(`¡Hola! La señora de los stickers de pragmagick.app me dijo "${last.message}" y quiero hablarlo contigo 🌙`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('booking_click', { channel: 'whatsapp', source: 'amigah' })}
            className="bg-white px-1 py-3 flex items-center justify-center gap-1.5 text-center"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" /> Hablar con Lorena
          </a>
        </div>
      ) : (
        <button
          type="button"
          onClick={ask}
          disabled={busy}
          className="shrink-0 border-t-2 border-ink bg-yellow py-3.5 font-display text-[19px] uppercase disabled:opacity-60 transition-opacity"
        >
          {ASK_LABEL}
        </button>
      )}

      <CollectionModal
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
        collected={collected}
        onOpenKit={() => {
          setCollectionOpen(false);
          setKitOpen(true);
        }}
      />
      <KitModal open={kitOpen} onClose={() => setKitOpen(false)} />
    </div>
  );
};
