import { useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import BackgroundMusic from './components/BackgroundMusic';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Reasons from './pages/Reasons';
import LoveLetter from './pages/LoveLetter';
import FutureDreams from './pages/FutureDreams';
import MemoryVault from './pages/MemoryVault';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <AnimatedPage key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/reasons" element={<Reasons />} />
              <Route path="/letter" element={<LoveLetter />} />
              <Route path="/dreams" element={<FutureDreams />} />
              <Route path="/vault" element={<MemoryVault />} />
            </Routes>
          </AnimatedPage>
        </AnimatePresence>
      </main>
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const musicRef = useRef(null);

  /* Called synchronously inside the splash click handler (user gesture) */
  const handleEnter = useCallback(() => {
    musicRef.current?.start();
  }, []);

  return (
    <Router>
      <LanguageProvider>
        {/* BackgroundMusic is always mounted — persists through splash → content transition */}
        <BackgroundMusic ref={musicRef} />

        {showSplash ? (
          <SplashScreen
            onStart={handleEnter}
            onFinish={() => setShowSplash(false)}
          />
        ) : (
          <div className="content-fade-in">
            <AppContent />
          </div>
        )}
      </LanguageProvider>
    </Router>
  );
};

export default App;
