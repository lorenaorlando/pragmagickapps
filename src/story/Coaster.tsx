// The roller coaster under the story's title: the cart rides the track as you scroll down.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionValue, useMotionValue } from 'motion/react';
import { Sticker } from '../components/Sticker';

const CART_W = 76;
const CART_H = 40;

/** Climb, big drop, a hill and a plunge off the bottom, scaled to the box */
const trackPath = (w: number, h: number) =>
  [
    `M ${-0.05 * w} ${0.55 * h}`,
    `C ${0.1 * w} ${0.55 * h} ${0.18 * w} ${0.08 * h} ${0.28 * w} ${0.08 * h}`,
    `C ${0.38 * w} ${0.08 * h} ${0.4 * w} ${0.85 * h} ${0.5 * w} ${0.85 * h}`,
    `C ${0.58 * w} ${0.85 * h} ${0.6 * w} ${0.4 * h} ${0.68 * w} ${0.4 * h}`,
    `C ${0.78 * w} ${0.4 * h} ${0.84 * w} ${1.0 * h} ${1.02 * w} ${1.12 * h}`,
  ].join(' ');

export const Coaster: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pillars, setPillars] = useState<{ x: number; y: number }[]>([]);
  const x = useMotionValue(-200);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = useMemo(() => (size.w ? trackPath(size.w, size.h) : ''), [size]);

  useEffect(() => {
    const p = path.current;
    if (!p || !d) return;
    const total = p.getTotalLength();
    const step = Math.max(34, size.w / 16);
    const posts: { x: number; y: number }[] = [];
    for (let l = step / 2; l < total; l += step) {
      const pt = p.getPointAtLength(l);
      if (pt.x > 0 && pt.x < size.w && pt.y < size.h) posts.push({ x: pt.x, y: pt.y });
    }
    setPillars(posts);

    // The cart covers the whole track while the hero is still on screen (70% of its scroll)
    const place = (v: number) => {
      const l = total * (0.17 + Math.min(Math.max(v / 0.7, 0), 1) * 0.83);
      const a = p.getPointAtLength(Math.max(l - 2, 0));
      const b = p.getPointAtLength(Math.min(l + 2, total));
      const at = p.getPointAtLength(l);
      x.set(at.x);
      y.set(at.y);
      rotate.set((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI);
    };
    place(progress.get());
    return progress.on('change', place);
  }, [d, size, progress, x, y, rotate]);

  return (
    <div ref={box} className="absolute inset-x-0 bottom-0 h-[42%] max-h-[420px] pointer-events-none" aria-hidden="true">
      <svg width={size.w} height={size.h} className="absolute inset-0 overflow-visible">
        {pillars.map((p, i) => (
          <line key={i} x1={p.x} y1={p.y + 4} x2={p.x} y2={size.h} stroke="#111" strokeWidth="2" />
        ))}
        {pillars.map((p, i) =>
          i % 2 ? null : <line key={`b${i}`} x1={p.x} y1={size.h} x2={pillars[i + 1]?.x ?? p.x} y2={pillars[i + 1]?.y ?? p.y} stroke="#111" strokeWidth="1" opacity="0.5" />,
        )}
        {/* cross ties, then the two rails */}
        <path d={d} fill="none" stroke="#111" strokeWidth="14" strokeDasharray="3 9" />
        <path ref={path} d={d} fill="none" stroke="#111" strokeWidth="9" strokeLinecap="round" />
        <path d={d} fill="none" stroke="#ffff0f" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <motion.div className="absolute left-0 top-0 w-0 h-0" style={{ x, y, rotate, transformOrigin: '0 0' }}>
        {/* the cart's wheels sit on the point of the track */}
        <div style={{ width: CART_W, height: CART_H, left: -CART_W / 2, top: -CART_H - 6 }} className="absolute">
          <Sticker slug="00-el-loco" className="absolute left-1/2 -translate-x-1/2 bottom-[18px] w-[58px] -rotate-6" />
          <div className="absolute inset-x-0 bottom-0 h-[26px] bg-sky border-2 border-ink rounded-[8px_8px_14px_14px] shadow-hard flex items-center justify-center">
            <span className="font-display text-[13px] leading-none">✦ 0 ✦</span>
          </div>
          <span className="absolute -bottom-[6px] left-[12px] w-[13px] h-[13px] rounded-full bg-white border-2 border-ink" />
          <span className="absolute -bottom-[6px] right-[12px] w-[13px] h-[13px] rounded-full bg-white border-2 border-ink" />
        </div>
      </motion.div>
    </div>
  );
};
