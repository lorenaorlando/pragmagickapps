// Shared drawing helpers for the 1080×1920 share images. Each image is drawn
// like a screenshot of the app: a header band, the content, and a footer with the URL.

export const W = 1080;
export const H = 1920;
export const INK = '#111111';
export const YELLOW = '#ffff00';
export const SKY = '#b8e2ec';
export const GREEN = '#33b43c';
export const HEADER_H = 170;
export const FOOTER_H = 170;

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

export const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  return { canvas, ctx: canvas.getContext('2d')! };
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
  ctx.fillRect(0, y - 3, W, 6);
};

/** App-style header band: title on the left, a right-hand label */
export const drawHeader = (ctx: CanvasRenderingContext2D, title: string, right: string, bg: string) => {
  fillDots(ctx, bg, 0, 0, W, HEADER_H);
  hLine(ctx, HEADER_H);
  ctx.fillStyle = INK;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = '70px "Viaoda Libre"';
  ctx.fillText(title.toUpperCase(), 60, HEADER_H / 2 + 4);
  ctx.textAlign = 'right';
  ctx.font = '40px "Viaoda Libre"';
  ctx.fillText(right, W - 60, HEADER_H / 2 + 4);
};

/** Yellow footer band with the logo and the URL people can visit */
export const drawFooter = async (ctx: CanvasRenderingContext2D, url: string) => {
  const logo = await loadImage('/brand/logo-circle.webp');
  const top = H - FOOTER_H;
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, top, W, FOOTER_H);
  hLine(ctx, top);
  ctx.font = '64px "Viaoda Libre"';
  const textW = ctx.measureText(url).width;
  const logoSize = 100;
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
