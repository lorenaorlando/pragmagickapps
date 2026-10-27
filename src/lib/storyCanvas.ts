// Shared drawing helpers for the 1080×1920 share images. Each image is drawn like a
// screenshot of the app inside the brand frame (rounded ink line), leaving 250 px free at
// the top and bottom for the Instagram story interface, with @pragmagicka signed below.

export const W = 1080;
export const H = 1920;
export const INK = '#111111';
export const YELLOW = '#ffff0f';
export const SKY = '#baeaee';
export const GRAPHITE = '#434343';

/** The framed "screen" */
export const F = { x: 48, y: 250, w: W - 96, h: 1330, r: 56 };
export const F_BOTTOM = F.y + F.h;
export const HEADER_H = 150;
export const FOOTER_H = 140;
/** Content area between the header and footer bands */
export const CONTENT_TOP = F.y + HEADER_H;
export const CONTENT_BOTTOM = F_BOTTOM - FOOTER_H;

export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const loadFonts = () =>
  Promise.all([
    document.fonts.load('64px "Viaoda Libre"'),
    document.fonts.load('italic 600 48px "Playfair Display"'),
    document.fonts.load('48px "Playfair Display"'),
    document.fonts.load('32px "DM Mono"'),
  ]);

export const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
};

/** Paper canvas, clipped to the frame until `closeFrame` is called */
export const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(F.x, F.y, F.w, F.h, F.r);
  ctx.clip();
  return { canvas, ctx };
};

/** Draw the frame line and the signature under it */
export const closeFrame = (ctx: CanvasRenderingContext2D) => {
  ctx.restore();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(F.x, F.y, F.w, F.h, F.r);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = '40px "Playfair Display"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('@pragmagicka', W / 2, F_BOTTOM + 70);
};

export const fillDots = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number, alpha = 0.13) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = `rgba(0,0,0,${alpha})`;
  for (let dy = y + 9; dy < y + h; dy += 18) {
    for (let dx = x + 9; dx < x + w; dx += 18) {
      ctx.beginPath();
      ctx.arc(dx, dy, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const fillGrid = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.fillStyle = '#f6f8ee';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,0.07)';
  ctx.lineWidth = 2;
  for (let gx = x; gx <= x + w; gx += 36) {
    ctx.beginPath();
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + h);
    ctx.stroke();
  }
  for (let gy = y; gy <= y + h; gy += 36) {
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + w, gy);
    ctx.stroke();
  }
};

export const fillRays = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = YELLOW;
  ctx.fillRect(x, y, w, h);
  const cx = x + w / 2;
  const cy = y + h * 1.15;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let a = 0; a < 360; a += 14) {
    const r = (deg: number) => (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(r(a)) * 3000, cy + Math.sin(r(a)) * 3000);
    ctx.lineTo(cx + Math.cos(r(a + 6)) * 3000, cy + Math.sin(r(a + 6)) * 3000);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

export const hLine = (ctx: CanvasRenderingContext2D, y: number) => {
  ctx.fillStyle = INK;
  ctx.fillRect(F.x, y - 3, F.w, 6);
};

/** App-style header band: title on the left, a right-hand label */
export const drawHeader = (ctx: CanvasRenderingContext2D, title: string, right: string, bg: string) => {
  fillDots(ctx, bg, F.x, F.y, F.w, HEADER_H);
  hLine(ctx, CONTENT_TOP);
  const mid = F.y + HEADER_H / 2 + 4;
  ctx.fillStyle = INK;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = '66px "Viaoda Libre"';
  ctx.fillText(title.toUpperCase(), F.x + 50, mid);
  ctx.textAlign = 'right';
  ctx.font = '38px "Viaoda Libre"';
  ctx.fillText(right, F.x + F.w - 50, mid);
};

/** Yellow footer band with the logo and the URL people can visit */
export const drawFooter = async (ctx: CanvasRenderingContext2D, url: string) => {
  const logo = await loadImage('/brand/logo-circle.webp');
  const top = CONTENT_BOTTOM;
  ctx.fillStyle = YELLOW;
  ctx.fillRect(F.x, top, F.w, FOOTER_H);
  hLine(ctx, top);
  ctx.font = '60px "Viaoda Libre"';
  const textW = ctx.measureText(url).width;
  const logoSize = 90;
  const startX = (W - (logoSize + 28 + textW)) / 2;
  ctx.drawImage(logo, startX, top + (FOOTER_H - logoSize) / 2, logoSize, logoSize);
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(url, startX + logoSize + 28, top + FOOTER_H / 2 + 2);
};

export const pill = (ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, bg = '#ffffff') => {
  ctx.font = '500 32px "DM Mono"';
  const w = ctx.measureText(text).width + 64;
  ctx.fillStyle = bg;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - 34, w, 68, 34);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy + 2);
};

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  );

/** Open the phone's share sheet with the image, or download it on desktop */
export const shareCanvas = async (canvas: HTMLCanvasElement, text: string) => {
  const blob = await toBlob(canvas);
  const file = new File([blob], 'pragmagick.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
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
