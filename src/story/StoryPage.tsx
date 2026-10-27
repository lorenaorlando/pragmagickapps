// /story: Lorena's story told as the Fool's journey through the Major Arcana.
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionValue, useAnimationControls, useInView, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ExternalLink } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { CardFace } from '../components/cards';
import { MAJOR_ARCANA } from '../data/tarotCards';
import { KOFI_BOOKING_URL, INSTAGRAM_URL } from '../config/links';
import { track } from '../lib/analytics';
import {
  Aces, AligningStars, Arrow, Book, CoffeeCup, Epiphany, HangedTurn, Hint, LifeDeck, MiniCoin, NextCard,
  Polaroid, SeventyEight, SigilMaker, Stamps, WordOfMouth,
} from './widgets';

const EBOOK_URL = 'https://ko-fi.com/s/d5662eb54a';
const COURSE_URL = 'https://ko-fi.com/s/8436f90a86';

interface ChapterMeta {
  id: string;
  numeral: string;
  arcano: string;
}

// The Fool's journey, in the order the story visits each arcanum
const CHAPTERS: ChapterMeta[] = [
  { id: 'libreria', numeral: '0', arcano: 'El Loco' },
  { id: 'herencia', numeral: 'III', arcano: 'La Emperatriz' },
  { id: 'arcanos', numeral: 'X', arcano: 'La Rueda' },
  { id: 'mutarotista', numeral: 'I', arcano: 'El Mago' },
  { id: 'pausa', numeral: 'XII', arcano: 'El Colgado' },
  { id: 'sagitario', numeral: 'XIV', arcano: 'La Templanza' },
  { id: 'vida', numeral: 'XVI', arcano: 'La Casa Dios' },
  { id: 'llamado', numeral: 'XX', arcano: 'El Juicio' },
  { id: 'fuerza', numeral: 'XI', arcano: 'La Fuerza' },
  { id: 'grimorio', numeral: 'IX', arcano: 'El Ermitaño' },
  { id: 'astros', numeral: 'XVII', arcano: 'La Estrella' },
  { id: 'mundo', numeral: 'XXI', arcano: 'El Mundo' },
];

const ActiveContext = createContext<(id: string) => void>(() => {});

// ── Building blocks ─────────────────────────────────────────────────────────

/** Yellow highlighter that paints itself across the words when they scroll into view */
const Mark: React.FC<{ children: React.ReactNode; color?: 'yellow' | 'sky' }> = ({ children, color = 'yellow' }) => (
  <motion.mark
    className="text-ink px-0.5 [box-decoration-break:clone]"
    style={{
      backgroundImage: `linear-gradient(${color === 'yellow' ? '#ffff0f' : '#baeaee'}, ${color === 'yellow' ? '#ffff0f' : '#baeaee'})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 85%',
      backgroundColor: 'transparent',
    }}
    initial={{ backgroundSize: '0% 70%' }}
    whileInView={{ backgroundSize: '100% 70%' }}
    viewport={{ once: true, amount: 1 }}
    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
  >
    {children}
  </motion.mark>
);

const P: React.FC<{ children: React.ReactNode; big?: boolean }> = ({ children, big }) => (
  <motion.p
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={big ? 'text-[22px] sm:text-[26px] leading-[1.35]' : 'text-[18px] sm:text-[20px] leading-[1.6]'}
  >
    {children}
  </motion.p>
);

const LinkCard: React.FC<{ href: string; kicker: string; title: string; event: string }> = ({ href, kicker, title, event }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => track('story_link', { target: event })}
    initial={{ opacity: 0, y: 12, rotate: -1.5 }}
    whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
    whileHover={{ rotate: 0, y: -3 }}
    viewport={{ once: true }}
    className="self-start flex items-center gap-4 bg-sky border-2 border-ink rounded-[12px] px-4 py-3 shadow-hard-lg max-w-full"
  >
    <span className="flex flex-col">
      <span className="font-mono text-[11px] uppercase">{kicker}</span>
      <span className="font-display uppercase text-[22px] leading-none">{title}</span>
    </span>
    <ExternalLink className="w-5 h-5 shrink-0" />
  </motion.a>
);

interface ChapterProps {
  meta: ChapterMeta;
  title: string;
  sticker?: string;
  band?: 'yellow' | 'sky';
  /** Content, or a function that receives the chapter's scroll progress (0 → 1 while it crosses the screen) */
  children: React.ReactNode | ((progress: MotionValue<number>) => React.ReactNode);
}

const Chapter: React.FC<ChapterProps> = ({ meta, title, sticker, children, band }) => {
  const ref = useRef<HTMLElement>(null);
  const setActive = useContext(ActiveContext);
  const inView = useInView(ref, { amount: 0.35 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  useEffect(() => {
    if (inView) setActive(meta.id);
  }, [inView, meta.id, setActive]);

  return (
    <section
      id={meta.id}
      ref={ref}
      className={`relative scroll-mt-16 ${band === 'yellow' ? 'bg-yellow' : band === 'sky' ? 'bg-sky' : ''} border-t-2 border-ink`}
    >
      <div className="relative max-w-[720px] mx-auto px-5 sm:px-8 py-20 sm:py-28 flex flex-col gap-7">
        {sticker && (
          <motion.div
            style={{ y, rotate }}
            className="hidden md:block absolute -right-40 lg:-right-52 top-24 w-[190px] pointer-events-none z-0"
          >
            <Sticker slug={sticker} className="w-full" />
          </motion.div>
        )}
        <header className="relative z-10 flex flex-col gap-1">
          <div className="flex items-end justify-between gap-3 min-h-[24px]">
            <span className="font-mono text-[12px] uppercase tracking-[0.14em]">
              {meta.numeral} · {meta.arcano}
            </span>
            {sticker && (
              <motion.div
                initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
                whileInView={{ rotate: 6, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="md:hidden w-[64px] -mb-2 shrink-0"
              >
                <Sticker slug={sticker} className="w-full" />
              </motion.div>
            )}
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display uppercase text-[48px] sm:text-[84px] leading-[0.92] tracking-tight [overflow-wrap:anywhere] sm:[overflow-wrap:normal]"
          >
            {title}
          </motion.h2>
        </header>
        <div className="relative z-10 flex flex-col gap-7">
          {typeof children === 'function' ? children(scrollYProgress) : children}
        </div>
      </div>
    </section>
  );
};

const byId = (id: string) => CHAPTERS.find((c) => c.id === id)!;

// ── Page ────────────────────────────────────────────────────────────────────

export const StoryPage: React.FC = () => {
  const [active, setActive] = useState(CHAPTERS[0].id);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    document.title = 'La historia de Pragmagicka';
    track('story_open');
  }, []);

  return (
    <ActiveContext.Provider value={setActive}>
      <div className="min-h-[100dvh] bg-white dots-soft text-ink overflow-x-hidden">
        <TopBar active={active} progress={bar} />
        <Hero />

        <Chapter meta={byId('libreria')} title="La librería" sticker="00-el-loco">
          <P>
            Cuando aún existían librerías en el centro comercial del pueblo, un día salí con uno de los libros que
            cambiaría mi vida para siempre: <Mark>La Vía del Tarot</Mark>, de Alejandro Jodorowsky y Marianne Costa.
          </P>
          <Book />
        </Chapter>

        <Chapter meta={byId('herencia')} title="La herencia" sticker="03-la-emperatriz" band="sky">
          <P>
            Me lo regaló mi mamá, que en su juventud <Mark color="yellow">pretendía que leía las tazas de café</Mark> y la
            gente lo creía por su herencia árabe.
          </P>
          <CoffeeCup />
          <P>
            Lo empecé a leer y a aplicar su conocimiento con amig@s, por probar. Resulta que me salía bien. Ese libro me
            acompañó a todos lados; al día de hoy lo llamo <Mark>«mi biblia del Tarot»</Mark>.
          </P>
        </Chapter>

        <Chapter meta={byId('arcanos')} title="78 arcanos" sticker="10-la-rueda-de-la-fortuna">
          <P>
            Tuve mi primer mazo del Tarot de Marsella, que se convirtió en mi fiel compañero. Se fue conmigo a México y
            terminé <Mark>regalando cada uno de sus 78 arcanos</Mark> a gente que conocía.
          </P>
          <SeventyEight />
        </Chapter>

        <FastForward />

        <MutarotistaChapter />

        <PauseChapter />

        <Chapter meta={byId('sagitario')} title="Naturaleza sagitariana" sticker="14-la-templanza" band="sky">
          <Arrow />
          <P>
            Lo retomaría años después, pero dada mi <Mark>naturaleza sagitariana</Mark>, cambié toda la propuesta inicial.
            Ahora, bajo mi nombre propio, abriría un nuevo camino, más expansivo, de mi práctica.
          </P>
          <p className="font-mono text-[11px] uppercase">✦ dato: en el tarot, La Templanza es el arcano de Sagitario</p>
          <P>
            Allí empecé a dictar cursos: <b>El Tarot a TU manera</b>, en vivo de forma online. Luego…
          </P>
          <Stamps words={['produje', 'redacté', 'grabé', 'edité', 'generé']} colors={['bg-white', 'bg-yellow']} />
          <P>
            …todo el material escrito del <Mark>Tarot de la Acción</Mark>, un curso pregrabado donde recopilé todo mi
            conocimiento a lo largo de los años, enfocado en el Tarot como una herramienta para accionar y tomar
            decisiones, pero también para el autoconocimiento.
          </P>
          <LinkCard href={COURSE_URL} kicker="curso pregrabado" title="El Tarot de la Acción" event="course" />
          <P>
            Luego enfoqué el proyecto hacia la propuesta del Tarot para artistas y procesos creativos, pero otra vez la
            vida pasó.
          </P>
        </Chapter>

        <LifeChapter />

        <CallChapter />

        <Chapter meta={byId('fuerza')} title="Esoterismo pragmático" sticker="08-la-fuerza" band="yellow">
          <P>En esta vuelta tengo muchísimo más clara una idea que venía rumiando durante años:</P>
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="bg-white border-2 border-ink rounded-[14px] shadow-hard-lg px-5 py-5 -rotate-1 italic font-semibold text-[21px] sm:text-[24px] leading-[1.4]"
          >
            las prácticas esotéricas, magickas, deben estar a favor del consultante; no llenarl@s de miedos o fantasías
            con predicciones, sino hacer de la voluntad propia una fuerza imparable, cosa que en ciertos contextos es un
            acto de supervivencia.
          </motion.blockquote>
          <P>
            Eso es el <b>Esoterismo Pragmático</b>: una forma de usar todas esas herramientas ancestrales en pro de nuestro
            bienestar emocional, intelectual, material y creativo.
          </P>
          <Aces />
        </Chapter>

        <Chapter meta={byId('grimorio')} title="El grimorio" sticker="09-el-ermitano">
          <P>
            Actualmente estoy ampliando mis conocimientos en todo lo referente al esoterismo y a la magick. Estoy
            estudiando <Mark color="sky">astrología</Mark> y aprendiendo a hacer <Mark>sigilos</Mark>.
          </P>
          <SigilMaker />
          <P>
            Un pasito a la vez, absorbiendo todo lo que voy aprendiendo y anotándolo en mi primer grimorio.
          </P>
          <div className="self-center">
            <Polaroid
              src="/story/grimorio.webp"
              caption="mi primer grimorio"
              tilt={3}
              placeholder={
                <svg viewBox="0 0 100 100" className="w-3/4" aria-hidden="true">
                  <rect x="18" y="14" width="64" height="74" rx="4" fill="#ffff0f" stroke="#111" strokeWidth="2" />
                  <line x1="28" y1="14" x2="28" y2="88" stroke="#111" strokeWidth="2" />
                  <path d="M55 36c1 7 4 10 11 11-7 1-10 4-11 11-1-7-4-10-11-11 7-1 10-4 11-11z" fill="#111" />
                </svg>
              }
            />
          </div>
          <P>
            Cuando este conocimiento se asiente en mi cabeza, espero poder llevarlo al ámbito de las apps también. Pero
            todo a su tiempo.
          </P>
        </Chapter>

        <StarsChapter />

        <EndChapter />
      </div>
    </ActiveContext.Provider>
  );
};

// ── Sections with their own behaviour ───────────────────────────────────────

const TopBar: React.FC<{ active: string; progress: ReturnType<typeof useSpring> }> = ({ active, progress }) => {
  const list = useRef<HTMLOListElement>(null);
  // Keep the current chapter's numeral visible on narrow screens
  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>('[data-active="true"]');
    if (el && list.current) list.current.scrollTo({ left: el.offsetLeft - list.current.clientWidth / 2, behavior: 'smooth' });
  }, [active]);
  return (
  <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b-2 border-ink" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
    <div className="flex items-center gap-3 px-3 sm:px-5 h-12">
      <Link to="/" className="shrink-0" aria-label="pragmagick.app">
        <img src="/brand/logo-circle.webp" alt="" className="w-8 h-8 rounded-full border-2 border-ink" />
      </Link>
      <span className="font-display uppercase text-[18px] shrink-0 hidden sm:inline">La vía</span>
      <ol ref={list} className="flex-1 flex items-center justify-between gap-0.5 overflow-x-auto no-scrollbar">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              title={c.arcano}
              data-active={active === c.id}
              className={`block min-w-[26px] text-center font-display text-[13px] sm:text-[15px] px-1 rounded-full border-[1.5px] transition-colors ${
                active === c.id ? 'bg-yellow border-ink' : 'border-transparent text-graphite'
              }`}
            >
              {c.numeral}
            </a>
          </li>
        ))}
      </ol>
    </div>
    <motion.div className="h-[4px] bg-ink origin-left" style={{ scaleX: progress }} />
  </nav>
  );
};

const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const foolX = useTransform(scrollYProgress, [0, 1], ['-10%', '90%']);
  const foolRotate = useTransform(scrollYProgress, [0, 1], [-4, 14]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  return (
    <header ref={ref} className="relative min-h-[100svh] pt-24 pb-12 flex flex-col justify-center overflow-hidden rays border-b-2 border-ink">
      <motion.div style={{ y: titleY }} className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-8 flex flex-col gap-5">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[20px] sm:text-[24px]">
          la historia de
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display uppercase text-[68px] sm:text-[132px] leading-[0.88] tracking-tight -ml-1"
        >
          Pragma<br />gicka
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border-2 border-ink rounded-[14px] shadow-hard-lg px-4 py-3 -rotate-1 italic font-semibold text-[18px] sm:text-[21px] leading-snug max-w-[34ch]"
        >
          o cómo una librería de pueblo, 78 arcanos regalados, dos terremotos y una gata me trajeron hasta aquí.
        </motion.p>
        <motion.a
          href="#libreria"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 0.9 }, y: { repeat: Infinity, duration: 1.8 } }}
          className="self-start mt-4 w-14 h-14 rounded-full bg-sky border-2 border-ink flex items-center justify-center shadow-hard"
          aria-label="Empezar a leer"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.a>
      </motion.div>
      <motion.div style={{ x: foolX, rotate: foolRotate }} className="absolute bottom-6 left-0 w-[150px] sm:w-[230px] pointer-events-none">
        <Sticker slug="00-el-loco" className="w-full" />
      </motion.div>
    </header>
  );
};

const FastForward: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const year = useTransform(scrollYProgress, [0.2, 0.6], [2008, 2019]);
  const [shown, setShown] = useState(2008);
  useEffect(() => year.on('change', (v) => setShown(Math.round(v))), [year]);
  return (
    <div ref={ref} className="relative bg-ink text-yellow border-t-2 border-ink py-16 overflow-hidden">
      <motion.div style={{ x }} className="whitespace-nowrap font-display uppercase text-[64px] sm:text-[110px] leading-none">
        {'fast forward ⏩ fast forward ⏩ fast forward ⏩ fast forward ⏩ '.repeat(2)}
      </motion.div>
      <p className="text-center font-display text-[90px] sm:text-[150px] leading-none mt-6 tabular-nums">{shown}</p>
    </div>
  );
};

const MutarotistaChapter: React.FC = () => {
  return (
      <Chapter meta={byId('mutarotista')} title="Mutarotista" sticker="01-el-mago" band="sky">
        {(progress) => (
          <>
        <P>En una tarde tediosa trabajando en algo que no me gustaba para nada, tuve una epifanía:</P>
        <Epiphany />
        <P>
          Así nació <Mark>Mutarotista</Mark>, el primer capítulo de esta historia. Empecé a leerle el Tarot a amig@s a
          cambio de que me recomendaran; así se fue corriendo la voz…
        </P>
        <div className="self-center w-full flex justify-center">
          <WordOfMouth progress={progress} />
        </div>
        <P>
          …y un tiempo después las lecturas se convirtieron en mi principal fuente de sustento. Yo disfrutaba de hacerlo y
          la gente disfrutaba de mis lecturas, distintas a las típicas lecturas predictivas:
        </P>
        <Stamps words={['muy honestas', 'con humor', 'con mucho amor']} />
        <P>
          Amor por serle útil a la gente, amor por el conocimiento infinito que el Tarot me regalaba todos los días. En esa
          etapa también escribí un ebook:
        </P>
        <LinkCard href={EBOOK_URL} kicker="ebook" title="Guía de los Arcanos Mayores del Tarot" event="ebook" />
          </>
        )}
      </Chapter>
  );
};

const PauseChapter: React.FC = () => {
  return (
      <Chapter meta={byId('pausa')} title="Pausa">
        {(progress) => (
          <>
        <P big>
          Pero como siempre, la vida pasa y cosas pasan y en algún punto entre una cosa pasando y otra,{' '}
          <Mark>abandoné el proyecto.</Mark>
        </P>
        <div className="self-center flex flex-col items-center gap-3">
          <HangedTurn progress={progress} />
          <Hint>sigue bajando: todo se da vuelta</Hint>
        </div>
          </>
        )}
      </Chapter>
  );
};

const LifeChapter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimationControls();
  useEffect(() => {
    if (!inView) return;
    // Two earthquakes
    const quake = { x: [0, -14, 12, -10, 8, -4, 0], transition: { duration: 0.6 } };
    controls.start(quake).then(() => setTimeout(() => controls.start(quake), 500));
  }, [inView, controls]);

  const card = (id: number) => MAJOR_ARCANA.find((c) => c.id === id)!;
  return (
    <motion.div ref={ref} animate={controls}>
      <Chapter meta={byId('vida')} title="Y vaya que pasó…" sticker="16-la-casa-dios" band="yellow">
        <LifeDeck
          events={[
            { text: 'sobreviví a dos terremotos', color: 'bg-white', art: <span className="font-display text-[60px] leading-none">≋</span> },
            { text: 'y a un bombardeo', color: 'bg-sky', art: <CardFace card={card(16)} alt="" className="w-[80px] -rotate-3" /> },
            { text: 'perdí a mi padre', color: 'bg-white', art: <span className="text-[44px]" aria-hidden="true">🕯️</span> },
            {
              text: 'adopté a una nueva gata',
              color: 'bg-sky',
              art: (
                <Polaroid
                  src="/story/maggie.webp"
                  caption="Maggie"
                  tilt={-3}
                  width={160}
                  placeholder={
                    <svg viewBox="0 0 100 100" className="w-2/3" aria-hidden="true">
                      <path d="M28 40 L30 18 L44 32 Q50 30 56 32 L70 18 L72 40 Q80 52 72 66 Q62 80 50 80 Q38 80 28 66 Q20 52 28 40 Z" fill="#fff" stroke="#111" strokeWidth="2.5" />
                      <circle cx="41" cy="50" r="3" fill="#111" /><circle cx="59" cy="50" r="3" fill="#111" />
                      <path d="M46 60 Q50 64 54 60" fill="none" stroke="#111" strokeWidth="2" />
                    </svg>
                  }
                />
              ),
            },
            { text: 'hice mucha música', color: 'bg-yellow', art: <span className="font-display text-[60px] leading-none">♪ ♫</span> },
            { text: 'me deprimí', color: 'bg-white', art: <CardFace card={card(18)} alt="" className="w-[80px] rotate-2" /> },
            { text: 'me volví a animar', color: 'bg-yellow', art: <CardFace card={card(19)} alt="" className="w-[80px] -rotate-2" /> },
            { text: 'el contexto me volvió a deprimir', color: 'bg-sky', art: <span className="font-display text-[60px] leading-none">☾</span> },
          ]}
        />
      </Chapter>
    </motion.div>
  );
};

const CallChapter: React.FC = () => (
  <Chapter meta={byId('llamado')} title="El llamado" sticker="20-el-juicio" band="sky">
    <P big>…y finalmente sentí el llamado de volver a mi práctica del Tarot.</P>
    <motion.div
      initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ type: 'spring', stiffness: 140, damping: 12 }}
      className="self-center flex flex-col items-center gap-3"
    >
      <img src="/brand/logo-circle.webp" alt="Pragmagicka" className="w-[150px] h-[150px] rounded-full border-2 border-ink" />
      <p className="font-display uppercase text-[30px]">Así nació Pragmagicka</p>
    </motion.div>
    <P>
      Pero hubo algo en el medio de ese recorrido que hizo de esta vuelta algo más interesante: me volví{' '}
      <Mark>una dura en diseño web</Mark> y, aprendiendo a hacer apps, inventé <b>Monedaire</b>, una app sencilla para
      lanzar una moneda, solo por practicar.
    </P>
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <MiniCoin />
      <Link to="/monedaire" onClick={() => track('story_link', { target: 'monedaire' })} className="rounded-full border-2 border-ink bg-white px-4 py-2 font-mono text-[12px] uppercase shadow-hard">
        abrir monedaire →
      </Link>
    </div>
    <P>
      Desde hace mucho tiempo había soñado con tener una app de Tarot con mi propia perspectiva e interpretaciones. En
      algún momento lo intenté con un proyecto llamado{' '}
      <span className="relative inline-block font-display uppercase">
        El Cuaderno del Momento
        <motion.span
          className="absolute left-0 right-0 top-1/2 h-[3px] bg-ink origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />
      </span>
      , pero nunca me pareció suficiente esa propuesta. Entonces dije: <i>¿por qué no volver a intentarlo?</i>
    </P>
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="self-center flex flex-col items-center gap-4"
    >
      <Link
        to="/tarot"
        onClick={() => track('story_link', { target: 'app' })}
        className="bg-yellow border-2 border-ink rounded-[14px] shadow-hard-lg px-6 py-4 font-display uppercase text-[30px] leading-none rotate-1"
      >
        pragmagick.app →
      </Link>
      <p className="text-[15px] text-center max-w-[32ch]">Y me lancé a hacer Pragmagick.app, una app sencilla de tiradas de Tarot.</p>
    </motion.div>
  </Chapter>
);

const StarsChapter: React.FC = () => {
  return (
      <Chapter meta={byId('astros')} title="Los astros" sticker="17-la-estrella" band="sky">
        {(progress) => (
          <>
        <P>Y hoy que escribo esto me entusiasma retomar este camino. Espero que esta vez</P>
        <div className="self-center w-full flex justify-center">
          <AligningStars progress={progress} />
        </div>
        <P big>
          <Mark>los astros se alineen</Mark> para que este proyecto dure todo lo que merece durar, que siento que merece
          muuuchos años y mucho desarrollo en el tiempo.
        </P>
          </>
        )}
      </Chapter>
  );
};

const EndChapter: React.FC = () => (
  <Chapter meta={byId('mundo')} title="Gracias" sticker="21-el-mundo" band="yellow">
    <P big>
      Gracias por leer hasta aquí. Si esta historia te generó empatía y respeto, eso es exactamente lo mismo que yo
      siento por mis consultantes.
    </P>
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <NextCard />
      <div className="flex flex-col gap-3 items-center sm:items-start">
        <p className="text-[18px]">Si te interesa tener una lectura conmigo, puedes hacerlo aquí:</p>
        <a
          href={KOFI_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('booking_click', { channel: 'kofi', source: 'story' })}
          className="bg-white border-2 border-ink rounded-full shadow-hard-lg px-5 py-3 font-display uppercase text-[19px] sm:text-[24px] whitespace-nowrap"
        >
          agendar una lectura 1:1
        </a>
        <div className="flex gap-2 font-mono text-[11px] uppercase">
          <Link to="/tarot" className="rounded-full border-2 border-ink bg-sky px-3 py-1.5">sacar una carta</Link>
          <Link to="/amigah" className="rounded-full border-2 border-ink bg-white px-3 py-1.5">amigaaaah</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-ink bg-white px-3 py-1.5">
            @pragmagicka
          </a>
        </div>
      </div>
    </div>
    <p className="font-display text-[34px] self-end -rotate-2">— Lorena</p>
  </Chapter>
);
