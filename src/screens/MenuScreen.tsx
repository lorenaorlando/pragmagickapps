import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/language';
import { ScreenHeader } from '../components/ScreenHeader';
import { LanguageToggle } from '../components/LanguageToggle';
import { Sticker } from '../components/Sticker';
import { INSTAGRAM_URL } from '../config/links';
import { StickerImage } from '../amigah/StickerImage';
import { GREETING_ID as AMIGAH_STICKER } from '../amigah/stickers';

export const MenuScreen: React.FC = () => {
  const { t } = useLanguage();

  const tiles: { to: string; title: string; desc: string; sticker?: string; image?: string; bg: string; rotate: number }[] = [
    { to: '/tarot', title: t.menu.tarotTitle, desc: t.menu.tarotDesc, sticker: '01-el-mago', bg: 'bg-yellow', rotate: 5 },
    { to: '/amigah', title: t.menu.stickersTitle, desc: t.menu.stickersDesc, image: AMIGAH_STICKER, bg: 'bg-sky', rotate: -5 },
    { to: '/monedaire', title: t.menu.coinTitle, desc: t.menu.coinDesc, sticker: '10-la-rueda-de-la-fortuna', bg: 'bg-white', rotate: 4 },
  ];

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t.menu.banner} back="/" right={<LanguageToggle />} />
      <div className="flex-1 min-h-0 flex flex-col gap-4 px-4 py-5 dots-soft">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.to}
            className="flex-1 min-h-[110px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={tile.to}
              className={`${tile.bg} relative h-full flex flex-col justify-center gap-1 rounded-[12px] border-2 border-ink shadow-hard-lg pl-4 pr-[104px] py-3 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[transform,box-shadow]`}
            >
              <span className="font-display text-[23px] uppercase leading-[0.95]">{tile.title}</span>
              <span className="text-[12.5px] leading-tight">{tile.desc}</span>
              {tile.image ? (
                <StickerImage id={tile.image} rotate={tile.rotate} className="absolute right-2 top-1/2 -translate-y-1/2 w-[92px] rounded-[10px] border-[3px] border-white drop-sticker" />
              ) : (
                <Sticker slug={tile.sticker!} rotate={tile.rotate} className="absolute right-2 top-1/2 -translate-y-1/2 w-[86px]" />
              )}
            </Link>
          </motion.div>
        ))}
      </div>
      <footer className="shrink-0 border-t-2 border-ink grid grid-cols-2 font-mono text-[11px] uppercase">
        <Link to="/story" className="py-3 text-center border-r-2 border-ink hover:bg-yellow">
          {t.menu.about}
        </Link>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="py-3 text-center hover:bg-sky">
          @pragmagicka
        </a>
      </footer>
    </div>
  );
};
