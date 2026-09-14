import React from 'react';

interface SingleDeckCardProps {
  className?: string;
  onClick?: () => void;
  isShuffling?: boolean;
}

export const SingleDeckCard: React.FC<SingleDeckCardProps> = ({
  className = '',
  onClick,
  isShuffling = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-[92px] sm:w-[104px] border-[2px] border-black rounded-[2px] bg-[#d3d8dc] overflow-hidden select-none shadow-sm transition-all ${className}`}
      style={{
        aspectRatio: '1 / 1.78',
      }}
    >
      {/* Inner thin border inset matching the vintage plaid back */}
      <div className="absolute inset-[2px] border border-black/30 overflow-hidden bg-[#cfd5da] flex items-center justify-center">
        {/* SVG diagonal tartan / plaid pattern as seen in screenshot */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="tartan-pattern"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="24" height="24" fill="#cfd5da" />
              {/* Thick soft stripes */}
              <line x1="0" y1="0" x2="0" y2="24" stroke="#a0aab2" strokeWidth="6" opacity="0.6" />
              <line x1="0" y1="0" x2="24" y2="0" stroke="#a0aab2" strokeWidth="6" opacity="0.6" />
              {/* Thin crisp crossing lines */}
              <line x1="12" y1="0" x2="12" y2="24" stroke="#718096" strokeWidth="1.2" opacity="0.8" />
              <line x1="0" y1="12" x2="24" y2="12" stroke="#718096" strokeWidth="1.2" opacity="0.8" />
              <line x1="6" y1="0" x2="6" y2="24" stroke="#4a5568" strokeWidth="0.8" opacity="0.5" />
              <line x1="0" y1="6" x2="24" y2="6" stroke="#4a5568" strokeWidth="0.8" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tartan-pattern)" />
        </svg>
      </div>
    </div>
  );
};
