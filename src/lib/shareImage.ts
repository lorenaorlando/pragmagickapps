// Builds a 1080×1920 story image of a reading and hands it to the phone's share sheet.

const W = 1080;
const H = 1920;
const INK = '#111111';
const YELLOW = '#ffff00';
const SKY = '#b8e2ec';

interface StoryInput {
  label: string;
  cardUrls: string[];
  title: string;
  message: string;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const drawCard = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, w: number, angle: number) => {
  const h = (w * img.height) / img.width;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = INK;
  ctx.fillRect(-w / 2 + 16, -h / 2 + 16, w, h);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.lineWidth = 8;
  ctx.strokeStyle = INK;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.restore();
  return h;
};

export const renderStory = async ({ label, cardUrls, title, message }: StoryInput): Promise<Blob> => {
  await Promise.all([
    document.fonts.load('64px "Viaoda Libre"'),
    document.fonts.load('italic 600 48px "Playfair Display"'),
    document.fonts.load('32px "DM Mono"'),
  ]);
  const [cards, logo] = await Promise.all([
    Promise.all(cardUrls.map(loadImage)),
    loadImage('/brand/logo-circle.webp'),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Halftone background
  ctx.fillStyle = SKY;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0,0,0,0.13)';
  for (let y = 9; y < H; y += 18) {
    for (let x = 9; x < W; x += 18) {
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Label pill
  ctx.font = '500 34px "DM Mono"';
  const pillText = label.toUpperCase();
  const pillW = ctx.measureText(pillText).width + 72;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect((W - pillW) / 2, 150, pillW, 76, 38);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pillText, W / 2, 190);

  // Cards
  let cardsBottom: number;
  if (cards.length === 1) {
    const h = drawCard(ctx, cards[0], W / 2, 720, 480, 3);
    cardsBottom = 720 + h / 2;
  } else {
    const angles = [-6, 0, 6];
    const xs = [W / 2 - 300, W / 2, W / 2 + 300];
    let maxH = 0;
    cards.forEach((img, i) => {
      maxH = Math.max(maxH, drawCard(ctx, img, xs[i], 660 + (i === 1 ? -20 : 20), 290, angles[i]));
    });
    cardsBottom = 680 + maxH / 2;
  }

  // Title
  // Shrink long titles (three card names) until they fit the width
  let titleSize = 84;
  do {
    ctx.font = `${titleSize}px "Viaoda Libre"`;
    titleSize -= 4;
  } while (ctx.measureText(title.toUpperCase()).width > W - 120 && titleSize > 40);
  ctx.fillStyle = INK;
  ctx.fillText(title.toUpperCase(), W / 2, cardsBottom + 120);

  // Message on a tilted yellow tag
  ctx.font = 'italic 600 52px "Playfair Display"';
  const lines = wrapLines(ctx, message, 780).slice(0, 5);
  const lineH = 70;
  const boxH = lines.length * lineH + 70;
  const boxTop = cardsBottom + 200;
  ctx.save();
  ctx.translate(W / 2, boxTop + boxH / 2);
  ctx.rotate((-1.5 * Math.PI) / 180);
  ctx.fillStyle = INK;
  ctx.fillRect(-430 + 14, -boxH / 2 + 14, 860, boxH);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(-430, -boxH / 2, 860, boxH);
  ctx.lineWidth = 6;
  ctx.strokeRect(-430, -boxH / 2, 860, boxH);
  ctx.fillStyle = INK;
  lines.forEach((l, i) => ctx.fillText(l, 0, -boxH / 2 + 35 + lineH / 2 + i * lineH));
  ctx.restore();

  // Footer: logo + URL
  ctx.drawImage(logo, W / 2 - 230, H - 210, 110, 110);
  ctx.font = '64px "Viaoda Libre"';
  ctx.textAlign = 'left';
  ctx.fillText('pragmagick.app', W / 2 - 100, H - 155);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  );
};

export const shareStory = async (input: StoryInput) => {
  const blob = await renderStory(input);
  const file = new File([blob], 'pragmagick.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: 'pragmagick.app' });
    } catch {
      // user closed the share sheet
    }
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pragmagick.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
