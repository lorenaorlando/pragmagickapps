import { useLanguage } from '../lib/language';

/** Picks the Spanish or English version, following the language chosen in the app */
export const useL = () => {
  const { language } = useLanguage();
  return <T,>(es: T, en: T): T => (language === 'es' ? es : en);
};
