// Share image of the sticker chat, drawn like a screenshot of the conversation.
import {
  W, H, INK, GREEN, HEADER_H, FOOTER_H,
  loadImage, loadFonts, wrapLines, createCanvas, fillGrid, drawHeader, drawFooter, shareCanvas,
} from '../lib/storyCanvas';
import { stickerSrc } from './StickerImage';
import { GREETING_QUESTION, ASK_LABEL } from './copy';
import { StickerOracleItem } from './stickers';

const PAD = 70;

const bubble = (ctx: CanvasRenderingContext2D, text: string, y: number, mine: boolean) => {
  ctx.font = '44px "Playfair Display"';
  const lines = wrapLines(ctx, text, 680);
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 72;
  const h = lines.length * 58 + 44;
  const x = mine ? W - PAD - w : PAD;
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(x + 8, y + 8, w, h, 36);
  ctx.fill();
  ctx.fillStyle = mine ? '#3ee04e' : '#ffffff';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, mine ? [36, 36, 8, 36] : [36, 36, 36, 8]);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, x + 36, y + 24 + i * 58));
  return y + h;
};

const stickerTile = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number, angle: number) => {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(-size / 2 + 14, -size / 2 + 14, size, size, 50);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(-size / 2, -size / 2, size, size, 50);
  ctx.fill();
  ctx.stroke();
  const inner = size - 70;
  const scale = Math.min(inner / img.width, inner / img.height);
  ctx.drawImage(img, (-img.width * scale) / 2, (-img.height * scale) / 2, img.width * scale, img.height * scale);
  // Peeled corner
  const c = 70;
  ctx.fillStyle = '#dcdcdc';
  ctx.beginPath();
  ctx.moveTo(size / 2 - c, -size / 2);
  ctx.lineTo(size / 2, -size / 2 + c);
  ctx.lineTo(size / 2 - c, -size / 2 + c);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};

export const renderChat = async (sticker: StickerOracleItem) => {
  await loadFonts();
  const img = await loadImage(stickerSrc(sticker.id));
  const { canvas, ctx } = createCanvas();

  fillGrid(ctx, 0, HEADER_H, W, H - HEADER_H - FOOTER_H);
  drawHeader(ctx, 'AMIGAAAAAAAH', 'en línea ●', GREEN);

  let y = HEADER_H + 70;
  y = bubble(ctx, GREETING_QUESTION, y, false) + 40;
  y = bubble(ctx, ASK_LABEL, y, true) + 70;
  const size = 620;
  stickerTile(ctx, img, (W - size) / 2 - 40, y, size, -4);
  y += size + 80;
  bubble(ctx, sticker.message, y, false);

  await drawFooter(ctx, 'pragmagick.app/amigah');
  return canvas;
};

export const shareChat = async (sticker: StickerOracleItem) => shareCanvas(await renderChat(sticker), 'pragmagick.app/amigah');
