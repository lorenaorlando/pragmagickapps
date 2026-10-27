// Share image of the sticker chat, drawn like a screenshot of the conversation.
import {
  W, INK, SKY, F, CONTENT_TOP, CONTENT_BOTTOM,
  loadImage, loadFonts, wrapLines, createCanvas, closeFrame, fillGrid, drawHeader, drawFooter, shareCanvas,
} from '../lib/storyCanvas';
import { stickerSrc } from './StickerImage';
import { GREETING_QUESTION, ASK_LABEL } from './copy';
import { StickerOracleItem } from './stickers';

const PAD = F.x + 50;

const bubble = (ctx: CanvasRenderingContext2D, text: string, y: number, mine: boolean) => {
  ctx.font = '40px "Playfair Display"';
  const lines = wrapLines(ctx, text, 640);
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 64;
  const h = lines.length * 52 + 40;
  const x = mine ? W - PAD - w : PAD;
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(x + 6, y + 6, w, h, 32);
  ctx.fill();
  ctx.fillStyle = mine ? SKY : '#ffffff';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, mine ? [32, 32, 8, 32] : [32, 32, 32, 8]);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, x + 32, y + 22 + i * 52));
  return y + h;
};

/** White die-cut tile with a peeled corner, like in the chat */
const stickerTile = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number, angle: number) => {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(-size / 2 + 12, -size / 2 + 12, size, size, 46);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(-size / 2, -size / 2, size, size, 46);
  ctx.fill();
  ctx.stroke();
  const inner = size - 56;
  const scale = Math.min(inner / img.width, inner / img.height);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect((-img.width * scale) / 2, (-img.height * scale) / 2, img.width * scale, img.height * scale, 22);
  ctx.clip();
  ctx.drawImage(img, (-img.width * scale) / 2, (-img.height * scale) / 2, img.width * scale, img.height * scale);
  ctx.restore();
  const c = 64;
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

  fillGrid(ctx, F.x, CONTENT_TOP, F.w, CONTENT_BOTTOM - CONTENT_TOP);
  drawHeader(ctx, 'AMIGAAAAAAAH', 'en línea ●', SKY);

  let y = CONTENT_TOP + 50;
  y = bubble(ctx, GREETING_QUESTION, y, false) + 30;
  y = bubble(ctx, ASK_LABEL, y, true) + 50;
  // The sticker takes whatever room is left after the reply bubble
  ctx.font = '40px "Playfair Display"';
  const replyH = wrapLines(ctx, sticker.message, 640).length * 52 + 40;
  const size = Math.min(470, CONTENT_BOTTOM - 40 - y - 50 - replyH);
  stickerTile(ctx, img, PAD + 10, y, size, -4);
  y += size + 50;
  bubble(ctx, sticker.message, y, false);

  await drawFooter(ctx, 'pragmagick.app/amigah');
  closeFrame(ctx);
  return canvas;
};

export const shareChat = async (sticker: StickerOracleItem) => shareCanvas(await renderChat(sticker), 'pragmagick.app/amigah');
