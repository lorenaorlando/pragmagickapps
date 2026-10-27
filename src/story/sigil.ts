// Chaos-magick style sigil: drop the vowels and repeated letters of an intention,
// then join the letters that remain on a wheel of the alphabet.

const WHEEL = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

export const sigilLetters = (intention: string) => {
  const clean = intention
    .toUpperCase()
    .normalize('NFD')
    .replace(/Ñ/g, 'Ñ')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-ZÑ]/g, '')
    .replace(/[AEIOU]/g, '');
  return [...new Set(clean)];
};

/** Points (0–100 box) for each letter on the alphabet wheel */
export const sigilPoints = (letters: string[], radius = 38) =>
  letters.map((l) => {
    const i = WHEEL.indexOf(l);
    const angle = (i / WHEEL.length) * Math.PI * 2 - Math.PI / 2;
    return { letter: l, x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
  });

/** SVG path joining the points, with gentle curves so it reads as drawn by hand */
export const sigilPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1];
    const q = points[i];
    // control point pulled toward the centre
    const cx = (p.x + q.x) / 2 + (50 - (p.x + q.x) / 2) * 0.35;
    const cy = (p.y + q.y) / 2 + (50 - (p.y + q.y) / 2) * 0.35;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  }
  return d;
};

export const WHEEL_LETTERS = WHEEL.split('');
