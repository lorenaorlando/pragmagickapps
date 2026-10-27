import React from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { SpreadsScreen } from './screens/tarot/SpreadsScreen';
import { SpreadFlow } from './screens/tarot/SpreadFlow';
import { AmigaOracleScreen } from './amigah/AmigaOracleScreen';
import { MonedaireScreen } from './monedaire/MonedaireScreen';

// A fresh flow per spread, so moving between spreads never carries cards over
const KeyedSpreadFlow = () => <SpreadFlow key={useParams().spreadId} />;

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-3 overflow-x-hidden dots-soft">
      <PhoneFrame>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full"
          >
            <Routes location={location}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/menu" element={<MenuScreen />} />
              <Route path="/tarot" element={<SpreadsScreen />} />
              <Route path="/tarot/:spreadId" element={<KeyedSpreadFlow />} />
              <Route path="/amigah" element={<AmigaOracleScreen />} />
              <Route path="/monedaire" element={<MonedaireScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>
    </div>
  );
}
