import React, { useState } from 'react';
import { Download, Send } from 'lucide-react';
import { Modal } from '../components/modals';
import { LEADS_ENDPOINT, STICKER_KIT_URL, TELEGRAM_STICKERS_URL, WHATSAPP_STICKERS_URL } from '../config/links';
import { DRAWABLE } from './collection';
import { track } from '../lib/analytics';

const UNLOCKED_KEY = 'amigah_kit_unlocked_v1';

const isUnlocked = () => {
  try {
    return localStorage.getItem(UNLOCKED_KEY) === '1';
  } catch {
    return false;
  }
};

const button =
  'flex items-center justify-center gap-2 rounded-full border-2 border-ink px-4 py-2.5 font-display text-[17px] uppercase shadow-hard active:translate-x-px active:translate-y-px active:shadow-none';

/** Free sticker kit for WhatsApp and Telegram, unlocked by leaving an email (sent to Lorena via FormSubmit) */
export const KitModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(LEADS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          origen: 'Kit de stickers AMIGAAAAAAAH (pragmagick.app/amigah)',
          _subject: 'Nuevo correo: kit de stickers AMIGAAAAAAAH',
          _template: 'table',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try {
        localStorage.setItem(UNLOCKED_KEY, '1');
      } catch {
        // ignore
      }
      track('generate_lead', { source: 'sticker_kit' });
      setUnlocked(true);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Kit de stickers">
      <div className="p-5 flex flex-col gap-4">
        <h3 className="leading-none">
          <span className="block text-[13px] lowercase">{DRAWABLE.length} stickers de</span>
          <span className="block font-display text-[40px] leading-[0.92]">AMIGAAAAH</span>
        </h3>

        {!unlocked ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <p className="text-[14.5px] leading-snug">
              Son tuyos, gratis, para WhatsApp y Telegram. Solo déjame tu correo y te aviso apenas salga la próxima tanda
              (la señora de los stickers no hace spam, palabra).
            </p>
            <label htmlFor="kit-email" className="font-mono text-[11px] uppercase">
              Tu correo
            </label>
            <input
              id="kit-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amigah@correo.com"
              className="w-full rounded-full border-2 border-ink bg-white px-4 py-2.5 text-[16px] outline-none focus:bg-sky/40"
            />
            <button type="submit" disabled={status === 'sending'} className={`${button} bg-yellow disabled:opacity-60`}>
              <Send className="w-4 h-4" /> {status === 'sending' ? 'Enviando…' : 'Quiero mis stickers'}
            </button>
            {status === 'error' && (
              <p role="alert" className="text-[13px] bg-yellow border-2 border-ink rounded-[10px] px-3 py-2">
                No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.
              </p>
            )}
            <p className="text-[11.5px] text-graphite">Tu correo solo se usa para avisarte de stickers nuevos.</p>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[14.5px] leading-snug">¡Listo, son tuyos! Elige dónde los quieres:</p>
            {TELEGRAM_STICKERS_URL && (
              <a href={TELEGRAM_STICKERS_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('kit_install', { app: 'telegram' })} className={`${button} bg-sky`}>
                Agregar a Telegram
              </a>
            )}
            {WHATSAPP_STICKERS_URL && (
              <a href={WHATSAPP_STICKERS_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('kit_install', { app: 'whatsapp' })} className={`${button} bg-sky`}>
                Agregar a WhatsApp
              </a>
            )}
            <a href={STICKER_KIT_URL} download onClick={() => track('kit_download')} className={`${button} bg-yellow`}>
              <Download className="w-4 h-4" /> Descargar el kit (.zip)
            </a>
            <div className="bg-sky border-[1.5px] border-ink rounded-[12px] px-4 py-3 text-[13px] leading-snug flex flex-col gap-2">
              <p>
                <b>WhatsApp:</b> instala la app gratis Sticker.ly, crea un paquete con las imágenes del kit y toca «Agregar
                a WhatsApp».
              </p>
              <p>
                <b>Telegram:</b> abre el chat con @Stickers, escribe /newpack y envía las imágenes del kit.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
