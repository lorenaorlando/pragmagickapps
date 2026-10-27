import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { KOFI_GOAL_URL } from '../config/links';
import { TestimonialList } from './Testimonials';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, icon, children }) => {
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] max-h-[88dvh] bg-white border-2 border-ink rounded-[14px] shadow-hard-lg flex flex-col overflow-hidden"
          >
            <div className="bg-sky dots border-b-2 border-ink px-4 py-2.5 flex items-center gap-2 shrink-0">
              {icon}
              <span className="font-display text-lg uppercase flex-1">{title}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="w-8 h-8 rounded-full border-2 border-ink bg-white flex items-center justify-center"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const GoalModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useLanguage();
  return (
    <Modal open={open} onClose={onClose} title={t.goal.title}>
      <iframe
        src={`${KOFI_GOAL_URL}&hidefeed=true&widget=true&embed=true&preview=true`}
        title={t.goal.title}
        className="w-full h-[560px] border-0 bg-[#f9f9f9]"
      />
      <a
        href={KOFI_GOAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border-t-2 border-ink py-2.5 font-mono text-[11px] uppercase tracking-wide hover:bg-yellow"
      >
        {t.goal.fallback} <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </Modal>
  );
};

export const TestimonialsModal: React.FC<{ open: boolean; onClose: () => void; footer?: React.ReactNode }> = ({
  open,
  onClose,
  footer,
}) => {
  const { t } = useLanguage();
  return (
    <Modal open={open} onClose={onClose} title={t.about.testimonials}>
      <div className="p-4">
        <TestimonialList />
      </div>
      {footer}
    </Modal>
  );
};
