// Share image of a tarot reading, drawn like a screenshot of the reading screen.
import {
  W, INK, YELLOW, SKY, F, CONTENT_TOP, CONTENT_BOTTOM,
  loadImage, loadFonts, wrapLines, createCanvas, closeFrame, fillRays, hLine, drawHeader, drawFooter, pill, shareCanvas,
} from './storyCanvas';

interface StoryInput {
  header: string;
  label: string;
  cardUrls: string[];
  title: string;
  message: string;
}

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

export const renderStory = async ({ header, label, cardUrls, title, message }: StoryInput) => {
  await loadFonts();
  const cards = await Promise.all(cardUrls.map(loadImage));
  const { canvas, ctx } = createCanvas();

  drawHeader(ctx, header, 'pragmagick.app', SKY);

  // Cards on sun rays
  const raysBottom = CONTENT_TOP + 560;
  fillRays(ctx, F.x, CONTENT_TOP, F.w, raysBottom - CONTENT_TOP);
  hLine(ctx, raysBottom);
  const mid = CONTENT_TOP + (raysBottom - CONTENT_TOP) / 2;
  if (cards.length === 1) {
    drawCard(ctx, cards[0], W / 2, mid, 300, -3);
  } else {
    [-6, 0, 6].forEach((angle, i) => drawCard(ctx, cards[i], W / 2 + (i - 1) * 270, mid + (i === 1 ? -10 : 10), 230, angle));
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

  // Answer with the same left rule as the reading screen
  ctx.font = 'italic 600 44px "Playfair Display"';
  const lines = wrapLines(ctx, message, F.w - 200);
  const lineH = 58;
  const top = raysBottom + 235;
  const maxLines = Math.max(1, Math.floor((CONTENT_BOTTOM - 30 - top) / lineH));
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] += '…';
  ctx.fillRect(F.x + 70, top, 7, shown.length * lineH);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  shown.forEach((l, i) => ctx.fillText(l, F.x + 105, top + i * lineH + 4));

  await drawFooter(ctx, 'pragmagick.app');
  closeFrame(ctx);
  return canvas;
};

export const shareStory = async (input: StoryInput) => shareCanvas(await renderStory(input), 'pragmagick.app');
