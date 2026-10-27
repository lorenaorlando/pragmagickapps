// Share image of a tarot reading, drawn like a screenshot of the reading screen.
import {
  W, INK, YELLOW, SKY, F, CONTENT_TOP, CONTENT_BOTTOM,
  loadImage, loadFonts, fitText, wrapLines, createCanvas, closeFrame, fillRays, hLine, drawHeader, drawFooter, pill, shareCanvas,
} from './storyCanvas';

interface StoryInput {
  header: string;
  label: string;
  cardUrls: string[];
  title: string;
  message: string;
  /** Position names shown above each card (three-card spread) */
  positions?: string[];
}

/** White box with the position name above a card, wrapped to two lines if needed */
const positionLabel = (ctx: CanvasRenderingContext2D, text: string, cx: number, top: number) => {
  const w = 250;
  ctx.font = '34px "Viaoda Libre"';
  const lines = wrapLines(ctx, text.toUpperCase(), w - 30).slice(0, 2);
  const h = lines.length * 34 + 24;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, top, w, h, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, cx, top + 14 + i * 34));
};

const drawCard = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, w: number, angle: number) => {
  const h = (w * img.height) / img.width;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = INK;
  ctx.fillRect(-w / 2 + 14, -h / 2 + 14, w, h);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.lineWidth = 7;
  ctx.strokeStyle = INK;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.restore();
};

export const renderStory = async ({ header, label, cardUrls, title, message, positions }: StoryInput) => {
  await loadFonts();
  const cards = await Promise.all(cardUrls.map(loadImage));
  const { canvas, ctx } = createCanvas();

  drawHeader(ctx, header, 'pragmagick.app', SKY);

  // Long answers get more room: the rays band (and the cards) shrink until the whole text fits
  const fitAnswer = (raysH: number, minSize: number) =>
    fitText(ctx, message, {
      maxWidth: F.w - 200,
      maxHeight: CONTENT_BOTTOM - 30 - (CONTENT_TOP + raysH + 235),
      font: (px) => `italic 600 ${px}px "Playfair Display"`,
      maxSize: 44,
      minSize,
    });
  const raysH = [560, 480, 400].find((h) => fitAnswer(h, 34).lines.join(' ') === message.replace(/\s+/g, ' ').trim()) ?? 400;
  const scale = raysH / 560;

  // Cards on sun rays
  const raysBottom = CONTENT_TOP + raysH;
  fillRays(ctx, F.x, CONTENT_TOP, F.w, raysH);
  hLine(ctx, raysBottom);
  const mid = CONTENT_TOP + raysH / 2;
  if (cards.length === 1) {
    drawCard(ctx, cards[0], W / 2, mid, 300 * scale, -3);
  } else {
    const cardMid = positions ? mid + 40 * scale : mid;
    [-6, 0, 6].forEach((angle, i) =>
      drawCard(ctx, cards[i], W / 2 + (i - 1) * 270, cardMid + (i === 1 ? -10 : 10), 230 * scale, angle),
    );
    positions?.forEach((p, i) => positionLabel(ctx, p, W / 2 + (i - 1) * 270, CONTENT_TOP + 24));
  }

  pill(ctx, label.toUpperCase(), W / 2, raysBottom + 70, YELLOW);

  // Title, shrunk until it fits
  let size = 88;
  do {
    ctx.font = `${size}px "Viaoda Libre"`;
    size -= 4;
  } while (ctx.measureText(title.toUpperCase()).width > F.w - 120 && size > 40);
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title.toUpperCase(), W / 2, raysBottom + 165);

  // Answer with the same left rule as the reading screen; never cut mid-sentence
  const top = raysBottom + 235;
  const { lines: shown, lineH } = fitAnswer(raysH, 30);
  ctx.fillStyle = INK;
  ctx.fillRect(F.x + 70, top, 7, shown.length * lineH);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  shown.forEach((l, i) => ctx.fillText(l, F.x + 105, top + i * lineH + 4));

  await drawFooter(ctx, 'pragmagick.app');
  closeFrame(ctx);
  return canvas;
};

export const shareStory = async (input: StoryInput) => shareCanvas(await renderStory(input), 'pragmagick.app');
