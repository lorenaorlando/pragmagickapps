import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Language } from '../../types';

interface KofiModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const KofiModal: React.FC<KofiModalProps> = ({ isOpen, onClose, language = 'es' }) => {
  const isEs = language === 'es';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-md sm:max-w-lg max-h-[90vh] bg-white border-[2px] border-black rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="w-full bg-white border-b-[2px] border-black py-2.5 px-4 flex items-center justify-between shrink-0">
              <span className="font-viaoda text-base sm:text-lg font-normal tracking-tight text-black uppercase">
                {isEs ? 'Apoyar el proyecto' : 'Support the project'}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-black hover:opacity-60 transition-opacity p-1 cursor-pointer"
                aria-label={isEs ? 'Cerrar ventana' : 'Close modal'}
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body with Ko-fi Iframe */}
            <div className="w-full flex-1 overflow-y-auto bg-[#f9f9f9] p-1 flex items-center justify-center">
              <iframe
                id="kofiframe"
                src="https://ko-fi.com/pragmagicka/?hidefeed=true&widget=true&embed=true&preview=true"
                style={{ border: 'none', width: '100%', padding: '4px', background: '#f9f9f9' }}
                height="712"
                title="pragmagicka"
                className="w-full rounded"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
