import React from 'react';

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full max-w-[380px] h-[calc(100dvh-24px)] max-h-[740px] min-h-[600px]">
    <div className="relative w-full h-full rounded-[20px] overflow-hidden flex flex-col border-2 border-ink bg-white">
      {children}
    </div>
  </div>
);
