// Share image of a tarot reading, drawn like a screenshot of the reading screen.
import {
  W, H, INK, YELLOW, SKY, HEADER_H, FOOTER_H,
  loadImage, loadFonts, wrapLines, createCanvas, fillDots, fillRays, hLine, drawHeader, drawFooter, pill, shareCanvas,
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
  ctx.fillRect(-w / 2 + 16, -h / 2 + 16, w, h);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.lineWidth = 8;
  ctx.strokeStyle = INK;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.restore();
};

export const renderStory = async ({ header, label, cardUrls, title, message }: StoryInput) => {
  await loadFonts();
  const cards = await Promise.all(cardUrls.map(loadImage));
  const { canvas, ctx } = createCanvas();

  fillDots(ctx, '#ffffff', 0, 0, W, H, 0.06);
  drawHeader(ctx, header, 'pragmagick.app', SKY);

  // Cards on sun rays
  const raysBottom = HEADER_H + 860;
  fillRays(ctx, 0, HEADER_H, W, raysBottom - HEADER_H);
  hLine(ctx, raysBottom);
  const mid = HEADER_H + (raysBottom - HEADER_H) / 2;
  if (cards.length === 1) {
    drawCard(ctx, cards[0], W / 2, mid, 440, -3);
  } else {
    [-6, 0, 6].forEach((angle, i) => drawCard(ctx, cards[i], W / 2 + (i - 1) * 310, mid + (i === 1 ? -14 : 14), 280, angle));
  }

  pill(ctx, label.toUpperCase(), W / 2, raysBottom + 90, YELLOW);

  // Title, shrunk until it fits
  let size = 96;
  do {
    ctx.font = `${size}px "Viaoda Libre"`;
    size -= 4;
  } while (ctx.measureText(title.toUpperCase()).width > W - 120 && size > 40);
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title.toUpperCase(), W / 2, raysBottom + 200);

  // Answer with the same left rule as the reading screen
  ctx.font = 'italic 600 50px "Playfair Display"';
  const lines = wrapLines(ctx, message, W - 220);
  const lineH = 68;
  const maxLines = Math.floor((H - FOOTER_H - (raysBottom + 290) - 40) / lineH);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] += '…';
  const top = raysBottom + 290;
  ctx.fillRect(80, top, 8, shown.length * lineH);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  shown.forEach((l, i) => ctx.fillText(l, 120, top + i * lineH + 4));

  await drawFooter(ctx, 'pragmagick.app');
  return canvas;
};

export const shareStory = async (input: StoryInput) => shareCanvas(await renderStory(input), 'pragmagick.app');
