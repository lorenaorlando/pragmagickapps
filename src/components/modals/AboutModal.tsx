import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Instagram, Mail } from 'lucide-react';
import { Language } from '../../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, language = 'es' }) => {
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
            <div className="w-full bg-white border-b-[2px] border-black py-3 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <img
                  src="https://sandboxlandia.online/wp-content/uploads/2026/09/PRAGMAGICKA_LOGO-1.png"
                  alt="Pragmagicka"
                  className="w-5 h-5 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-viaoda text-base sm:text-lg font-normal tracking-tight text-black uppercase">
                  {isEs ? 'Sobre Pragmagicka' : 'About Pragmagicka'}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-black hover:opacity-60 transition-opacity p-1 cursor-pointer"
                aria-label={isEs ? 'Cerrar ventana' : 'Close modal'}
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body with Manifesto & Contact */}
            <div className="w-full flex-1 overflow-y-auto p-5 sm:p-6 text-black space-y-5 text-left">
              {isEs ? (
                /* SECCIÓN ESPAÑOL */
                <div className="space-y-3.5">
                  <p className="font-playfair text-[13.5px] sm:text-[14.5px] leading-relaxed text-black/90 font-normal">
                    PRAGMAGICKA es la evolución directa de mi práctica espiritual, una donde lo fundamental es la fuerza de voluntad orientada a la acción a través de símbolos, rituales y herramientas esotéricas.
                  </p>
                  <p className="font-playfair text-[13.5px] sm:text-[14.5px] leading-relaxed text-black/90 font-normal">
                    Creo que no hay destino predeterminado ni cartas que adivinen el futuro. Hay decisiones que tomar y conflictos que destrabar. Muchas veces la mente strictly racional no basta para procesar dilemas internos que no siguen una lógica lineal. Es en ese espacio donde el esoterismo actúa como una tecnología pragmática, herramientas concretas para enfocar la mente, recuperar la agencia y accionar.
                  </p>
                  <p className="font-playfair text-[13.5px] sm:text-[14.5px] leading-relaxed text-black/90 font-normal">
                    Este proyecto condensa un recorrido de investigación y práctica continuada iniciado en 2008. No surge desde una torre de marfil ni desde el optimismo tóxico de la espiritualidad privileged. Entendemos que vivimos en un mundo cruzado por crisis económicas, desastres y precariedades. Es precisamente cuando el entorno es más hostil cuando la voluntad deja de ser un concepto abstracto y se convierte en una herramienta de supervivencia.
                  </p>
                </div>
              ) : (
                /* SECCIÓN INGLÉS */
                <div className="space-y-3.5">
                  <p className="font-playfair text-[13.5px] sm:text-[14.5px] leading-relaxed text-black/90 font-normal">
                    PRAGMAGICKA is the direct evolution of my spiritual practice, where the foundation is willpower oriented toward action through symbols, rituals, and esoteric tools.
                  </p>
                  <p className="font-playfair text-[13.5px] sm:text-[14.5px] leading-relaxed text-black/90 font-normal">
                    I believe there is no predetermined destiny and no cards that predict the future. There are decisions to be made and conflicts to be unblocked. Often, the strictly rational mind is insufficient to process inner dilemmas that follow a non-linear logic. It is in that space where esotericism acts as a pragmatic technology—concrete tools to focus the mind, reclaim agency, and take action.
                  </p>
                  <p className="font-playfair text-[13.5px] sm:text-[14.5px] leading-relaxed text-black/90 font-normal">
                    This project condenses a continuous path of research and practice begun in 2008. It does not emerge from an ivory tower or the toxic optimism of privileged spirituality. We understand that we live in a world crossed by economic crises, disasters, and precarity. It is precisely when the environment is most hostile that willpower ceases to be an abstract concept and becomes a survival tool.
                  </p>
                </div>
              )}

              {/* SECCIÓN DE CONTACTO */}
              <div className="pt-4 border-t-[2px] border-black">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="font-viaoda text-sm sm:text-base font-normal tracking-tight text-black uppercase">
                    {isEs ? 'Contacto / Seguir' : 'Contact / Follow'}
                  </span>

                  <div className="flex items-center gap-2.5">
                    {/* Instagram Link */}
                    <a
                      href="https://www.instagram.com/pragmagicka/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border-[1.5px] border-black rounded hover:bg-neutral-100 transition-colors flex items-center justify-center text-black"
                      aria-label="Instagram @pragmagicka"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>

                    {/* Mail Link */}
                    <a
                      href="mailto:lorena@pragmagick.app"
                      className="p-2 border-[1.5px] border-black rounded hover:bg-neutral-100 transition-colors flex items-center justify-center text-black"
                      aria-label="Email lorena@pragmagick.app"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
