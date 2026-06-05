import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './ProgressCounter.css';

const ProgressCounter = ({ shown, total }) => {
  const { t } = useLanguage();
  const percentage = Math.round((shown / total) * 100);

  return (
    <motion.div
      className="progress-counter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="progress-header">
        <span className="progress-label">{t.reasons.progressLabel}</span>
        <motion.span
          className="progress-count"
          key={shown}
          initial={{ scale: 1.4, color: '#f8a5b4' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        >
          {shown}
          <span className="progress-total"> / {total}</span>
        </motion.span>
      </div>

      <div className="progress-bar-container">
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="progress-bar-shimmer" />
        </motion.div>
        <div className="progress-heart" style={{ left: `${percentage}%` }}>
          ❤️
        </div>
      </div>

      <span className="progress-percentage">{percentage}% {t.reasons.progressComplete}</span>
    </motion.div>
  );
};

export default ProgressCounter;
