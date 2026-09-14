import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`relative w-full max-w-[360px] h-[calc(100dvh-20px)] max-h-[710px] min-h-[580px] bg-white rounded-[24px] sm:rounded-[30px] p-2.5 sm:p-3 border-0 shadow-none flex flex-col justify-between select-none overflow-visible transition-all ${className}`}
    >
      {/* Inner Screen Canvas with clean, intact 2px border and rounded corners */}
      <div className="relative w-full h-full rounded-[16px] sm:rounded-[20px] overflow-hidden flex flex-col border-[2px] border-black bg-white">
        {children}
      </div>
    </div>
  );
};
