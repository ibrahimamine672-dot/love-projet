import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import reasons from '../data/reasons';
import reasonsFr from '../data/reasons-fr';
import ReasonCard from '../components/ReasonCard';
import ProgressCounter from '../components/ProgressCounter';
import './Reasons.css';

const reasonsData = { en: reasons, fr: reasonsFr };

const Reasons = () => {
  const { t, language } = useLanguage();
  const currentReasons = reasonsData[language] || reasons;

  const [currentReason, setCurrentReason] = useState(null);
  const [shownIndices, setShownIndices] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [isRevealing, setIsRevealing] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const getRandomReason = useCallback(() => {
    if (shownIndices.size >= currentReasons.length) {
      setShowCompletion(true);
      return;
    }

    setIsRevealing(true);

    const available = currentReasons
      .map((_, i) => i)
      .filter(i => !shownIndices.has(i));

    const randomIndex = available[Math.floor(Math.random() * available.length)];
    const newShown = new Set(shownIndices);
    newShown.add(randomIndex);

    setTimeout(() => {
      setCurrentReason({
        index: randomIndex,
        text: currentReasons[randomIndex],
        number: newShown.size,
      });
      setShownIndices(newShown);
      setIsRevealing(false);
    }, 300);
  }, [shownIndices, currentReasons]);

  const toggleFavorite = useCallback((number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(number)) {
      newFavorites.delete(number);
    } else {
      newFavorites.add(number);
    }
    setFavorites(newFavorites);
  }, [favorites]);

  const handleReset = () => {
    setCurrentReason(null);
    setShownIndices(new Set());
    setFavorites(new Set());
    setShowCompletion(false);
  };

  return (
    <div className="reasons-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">{t.reasons.title}</h1>
        <p className="page-subtitle">{t.reasons.subtitle}</p>
      </motion.div>

      {shownIndices.size > 0 && (
        <ProgressCounter shown={shownIndices.size} total={currentReasons.length} />
      )}

      <div className="reasons-card-container">
        <AnimatePresence mode="wait">
          {showCompletion ? (
            <motion.div
              key="completion"
              className="completion-message glass"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.span
                className="completion-icon"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.span>
              <h2>{t.reasons.completionTitle}</h2>
              <p>{t.reasons.completionText}</p>
              <button className="reset-btn" onClick={handleReset}>
                {t.reasons.reset}
              </button>
            </motion.div>
          ) : currentReason ? (
            <ReasonCard
              key={currentReason.number}
              reason={currentReason.text}
              number={currentReason.number}
              onFavorite={toggleFavorite}
              isFavorited={favorites.has(currentReason.number)}
              t={t}
            />
          ) : (
            <motion.div
              key="placeholder"
              className="reasons-placeholder glass"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className="placeholder-icon"
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                💕
              </motion.span>
              <p className="placeholder-text">{t.reasons.placeholder}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="reasons-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className={`reveal-btn ${isRevealing ? 'loading' : ''}`}
          onClick={getRandomReason}
          disabled={isRevealing || showCompletion}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRevealing ? (
            <span className="btn-loading">
              <span className="loading-spinner">❤️</span>
              {t.reasons.revealing}
            </span>
          ) : currentReason ? (
            <span>{t.reasons.revealNext}</span>
          ) : (
            <span>{t.reasons.revealFirst}</span>
          )}
        </motion.button>

        {favorites.size > 0 && (
          <motion.div
            className="favorites-count"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>⭐ {favorites.size} {t.reasons.favorited}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Reasons;
