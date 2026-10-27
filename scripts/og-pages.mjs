// After `vite build`: write a copy of index.html for every shareable route with its own
// title, description and preview image. Link previews (WhatsApp, Instagram, search engines)
// don't run JavaScript, so each route needs these tags in static HTML.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SITE = 'https://pragmagick.app';
const DIST = 'dist';

const PAGES = [
  {
    path: '/',
    title: 'PRAGMAGICK.APP',
    description: 'Herramientas esotéricas para nuestro presente digital: tiradas de tarot escritas por una humana, un oráculo de stickers y una moneda con tres caras.',
    image: 'home',
  },
  {
    path: '/menu',
    title: 'PRAGMAGICK.APP',
    description: 'Tiradas de tarot, el oráculo de stickers AMIGAAAAAAAH y monedaire. Gratis, escritas por una humana.',
    image: 'home',
  },
  {
    path: '/tarot',
    title: 'Tiradas de tarot · PRAGMAGICK.APP',
    description: 'Una pregunta, una carta, una respuesta. Las cartas abren una conversación; la decisión es tuya.',
    image: 'tarot',
  },
  {
    path: '/tarot/no-se-que-hacer',
    title: 'No sé qué hacer · Tarot · PRAGMAGICK.APP',
    description: 'Una carta para decidir y entender cómo actuar. Sales con un próximo paso concreto.',
    image: 'no-se-que-hacer',
  },
  {
    path: '/tarot/pienso-en-alguien',
    title: 'Estoy pensando en alguien · Tarot · PRAGMAGICK.APP',
    description: 'Una carta sobre el estado actual de ese vínculo. Sin profecías: con preguntas honestas.',
    image: 'pienso-en-alguien',
  },
  {
    path: '/tarot/momento-presente',
    title: 'Momento presente · Tarot · PRAGMAGICK.APP',
    description: 'Una carta para entender dónde estás y cómo afrontarlo.',
    image: 'momento-presente',
  },
  {
    path: '/tarot/semana',
    title: 'Tarot de la semana · PRAGMAGICK.APP',
    description: 'Elige una de tres cartas boca abajo y descubre tu mensaje para estos 7 días.',
    image: 'semana',
  },
  {
    path: '/tarot/tres-cartas',
    title: 'Tirada de 3 cartas · PRAGMAGICK.APP',
    description: 'Pasado, presente y futuro; el problema, tú y la solución; mantener, reflexionar y soltar… Tú eliges cómo leerla.',
    image: 'tres-cartas',
  },
  {
    path: '/amigah',
    title: 'AMIGAAAAAAAH · Oráculo de stickers',
    description: '¿Qué te pasóooo? La señora de los stickers te aconseja con un sticker. Gratis, en pragmagick.app.',
    image: 'amigah',
  },
  {
    path: '/monedaire',
    title: 'Monedaire · Lanza una moneda · PRAGMAGICK.APP',
    description: 'Sí, no… o la tercera cara: la que de verdad te responde.',
    image: 'monedaire',
  },
];

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const setMeta = (html, attr, key, value) => {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`index.html is missing <meta ${attr}="${key}">`);
  return html.replace(re, `$1${escape(value)}$2`);
};

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

for (const page of PAGES) {
  const url = SITE + page.path;
  const image = `${SITE}/og/${page.image}.jpg`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'property', 'og:title', page.title);
  html = setMeta(html, 'property', 'og:description', page.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'name', 'twitter:title', page.title);
  html = setMeta(html, 'name', 'twitter:description', page.description);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);

  const file = page.path === '/' ? join(DIST, 'index.html') : join(DIST, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// Any other path falls back to the app (GitHub Pages serves 404.html)
writeFileSync(join(DIST, '404.html'), readFileSync(join(DIST, 'index.html')));
console.log(`og-pages: wrote ${PAGES.length} pages`);
