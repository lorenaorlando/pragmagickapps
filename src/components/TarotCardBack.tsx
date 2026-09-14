import React from 'react';

interface TarotCardBackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'mini';
  onClick?: () => void;
  selected?: boolean;
}

export const TarotCardBack: React.FC<TarotCardBackProps> = ({
  className = '',
  size = 'md',
  onClick,
  selected = false,
}) => {
  const sizeClasses = {
    mini: 'w-10 h-16',
    sm: 'w-14 h-24',
    md: 'w-20 h-36',
    lg: 'w-24 h-40',
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-sm border-[1.5px] border-black bg-slate-200 overflow-hidden shadow-xs cursor-pointer select-none transition-all ${
        sizeClasses[size]
      } ${selected ? 'ring-2 ring-black scale-105' : ''} ${className}`}
      style={{
        aspectRatio: '1 / 1.75',
      }}
    >
      {/* Outer border inset */}
      <div className="absolute inset-[3px] border border-black/30 overflow-hidden bg-slate-300/40 flex items-center justify-center">
        {/* SVG diamond pattern */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="tarot-diamond-pattern"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="#64748b"
                strokeWidth="1.2"
              />
              <line
                x1="0"
                y1="0"
                x2="10"
                y2="0"
                stroke="#64748b"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tarot-diamond-pattern)" />
        </svg>

        {/* Central subtle diamond motif */}
        <div className="absolute w-3 h-3 border border-slate-700/60 rotate-45 bg-slate-200/90 shadow-xs pointer-events-none" />
      </div>
    </div>
  );
};
