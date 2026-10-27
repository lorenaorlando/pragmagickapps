import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Send, RotateCcw, MessageCircle, Instagram, Rocket, ChevronUp, ChevronDown } from 'lucide-react';
import { STICKER_ORACLE_ITEMS, StickerOracleItem } from './stickers';
import { ScreenHeader } from '../components/ScreenHeader';
import { GoalModal } from '../components/modals';
import { INSTAGRAM_URL, whatsappUrl } from '../config/links';

// The sticker oracle only speaks Spanish, so its copy is not translated.
const DEFAULT_PROMPT = 'señora de los stickers, me puede ayudar?';
const AMIGAH_IMAGE = 'https://sandboxlandia.online/wp-content/uploads/2026/09/AMIGAH.png';

export const AmigaOracleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState(DEFAULT_PROMPT);
  const [sticker, setSticker] = useState<StickerOracleItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);

  const ask = () => {
    setSticker(STICKER_ORACLE_ITEMS[Math.floor(Math.random() * STICKER_ORACLE_ITEMS.length)]);
  };

  const again = () => {
    setMenuOpen(false);
    setSticker(null);
    setInputText(DEFAULT_PROMPT);
  };

  const menu = [
    { label: 'Pedir otro sticker', sub: 'Volver a consultar al oráculo', icon: RotateCcw, bg: 'bg-yellow', onClick: again },
    {
      label: 'Hablar con Lorena',
      sub: 'Escríbeme por WhatsApp',
      icon: MessageCircle,
      bg: 'bg-green',
      href: whatsappUrl(`¡Hola! El oráculo de stickers de pragmagick.app me dijo "${sticker?.message ?? ''}" y quiero hablarlo 🌙`),
    },
    { label: '¿Compartiendo tu sticker?', sub: 'Etiqueta a @pragmagicka en Instagram', icon: Instagram, bg: 'bg-sky', href: INSTAGRAM_URL },
    { label: 'Pragmagick a las tiendas', sub: 'Ayuda a que la app llegue a las tiendas', icon: Rocket, bg: 'bg-white', onClick: () => { setMenuOpen(false); setGoalOpen(true); } },
  ];

  return (
    <div className="relative h-full flex flex-col">
      <ScreenHeader title="AMIGAAAAAAAH" back="/menu" bg="green" />

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-5 dots-soft">
        <AnimatePresence mode="wait">
          {!sticker ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center"
            >
              <img src={AMIGAH_IMAGE} alt="Amigah" className="w-32 h-32 object-contain mb-3 drop-sticker" />
              <p className="font-display text-xl uppercase mb-5">Oráculo de stickers</p>
              <div className="w-full bg-white rounded-full border-2 border-ink shadow-hard py-1.5 pl-4 pr-1.5 flex items-center gap-2">
                <input
                  id="amigah-question"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ask()}
                  className="flex-1 min-w-0 bg-transparent text-[15px] outline-none"
                  placeholder={DEFAULT_PROMPT}
                  aria-label="Tu pregunta"
                />
                <motion.button
                  type="button"
                  onClick={ask}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  aria-label="Enviar"
                  className="w-10 h-10 rounded-full bg-green border-2 border-ink flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4 translate-x-px" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={sticker.id}
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <img src={sticker.imageUrl} alt={sticker.name} className="max-w-[220px] max-h-[220px] object-contain mb-5 drop-sticker" />
              <p className="max-w-[290px] bg-yellow border-2 border-ink shadow-hard px-3 py-2 font-display text-[17px] leading-snug uppercase whitespace-pre-line">
                {sticker.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative shrink-0 z-30">
        {sticker ? (
          <>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-30 bg-black/20"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-0 right-0 z-40 border-t-2 border-ink flex flex-col divide-y-2 divide-ink"
                  >
                    {menu.map((item) => {
                      const content = (
                        <>
                          <span className="flex flex-col text-left">
                            <span className="font-display text-[17px] uppercase leading-tight">{item.label}</span>
                            <span className="text-[12px] mt-0.5">{item.sub}</span>
                          </span>
                          <item.icon className="w-5 h-5 shrink-0" />
                        </>
                      );
                      const cls = `${item.bg} w-full px-4 py-3 flex items-center justify-between gap-2`;
                      return item.href ? (
                        <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={() => setMenuOpen(false)}>
                          {content}
                        </a>
                      ) : (
                        <button key={item.label} type="button" onClick={item.onClick} className={cls}>
                          {content}
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="w-full border-t-2 border-ink bg-yellow py-3.5 font-display text-[18px] uppercase flex items-center justify-center gap-2"
            >
              Y ahora… ¿qué hago con esto?
              {menuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full border-t-2 border-ink bg-white py-3 font-mono text-[11px] uppercase"
          >
            @pragmagicka · pragmagick.app
          </button>
        )}
      </div>

      <GoalModal open={goalOpen} onClose={() => setGoalOpen(false)} />
    </div>
  );
};
