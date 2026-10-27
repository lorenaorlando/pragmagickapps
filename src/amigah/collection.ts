import { useCallback, useEffect, useState } from 'react';
import { GREETING_ID, STICKER_ORACLE_ITEMS, StickerOracleItem } from './stickers';

const STORAGE_KEY = 'amigah_collection_v1';

/** Stickers that can come out of the oracle (the greeting is not drawn) */
export const DRAWABLE = STICKER_ORACLE_ITEMS.filter((s) => s.id !== GREETING_ID);
export const LATEST_BATCH = Math.max(...DRAWABLE.map((s) => s.batch));

const load = (): string[] => {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(ids) ? ids.filter((id) => DRAWABLE.some((s) => s.id === id)) : [];
  } catch {
    return [];
  }
};

/** Collected sticker ids, remembered on this phone */
export const useCollection = () => {
  const [collected, setCollected] = useState<string[]>(load);
  // Only people who already had stickers before this visit get the "new batch" nudge
  const [returning] = useState(() => collected.length > 0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
    } catch {
      // ignore
    }
  }, [collected]);

  /** Draw a sticker, preferring ones not collected yet so the set fills up */
  const draw = useCallback((): StickerOracleItem => {
    const missing = DRAWABLE.filter((s) => !collected.includes(s.id));
    const pool = missing.length ? missing : DRAWABLE;
    const sticker = pool[Math.floor(Math.random() * pool.length)];
    setCollected((prev) => (prev.includes(sticker.id) ? prev : [...prev, sticker.id]));
    return sticker;
  }, [collected]);

  const newInLatest = returning
    ? DRAWABLE.filter((s) => s.batch === LATEST_BATCH && !collected.includes(s.id)).length
    : 0;

  return { collected, draw, total: DRAWABLE.length, newInLatest };
};
