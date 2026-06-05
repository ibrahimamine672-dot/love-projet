import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import futureDreams from '../data/futureDreams';
import revesFuturs from '../data/futureDreams-fr';
import './FutureDreams.css';

const TimelineItem = ({ dream, index, isExpanded, onToggle }) => {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      className={`timeline-item ${isLeft ? 'left' : 'right'}`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <motion.div
        className="timeline-dot"
        whileHover={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="timeline-dot-icon">{dream.icon}</span>
      </motion.div>

      <motion.div
        className={`timeline-card glass ${isExpanded ? 'expanded' : ''}`}
        onClick={() => onToggle(index)}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="timeline-year">
          <span className="year-badge">{dream.year}</span>
        </div>

        <h3 className="timeline-card-title">{dream.title}</h3>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="timeline-dreams"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="dreams-list">
                {dream.dreams.map((dreamItem, i) => (
                  <motion.li
                    key={i}
                    className="dream-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="dream-bullet">💫</span>
                    <span>{dreamItem}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="timeline-expand-hint">
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const dreamsData = {
  en: futureDreams,
  fr: revesFuturs,
};

const FutureDreams = () => {
  const { language, t } = useLanguage();
  const currentDreams = dreamsData[language] || futureDreams;
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="dreams-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">{t.dreams.title}</h1>
        <p className="page-subtitle">{t.dreams.subtitle}</p>
      </motion.div>

      <div className="timeline">
        <div className="timeline-line">
          <motion.div
            className="timeline-progress"
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>

        {currentDreams.map((dream, index) => (
          <TimelineItem
            key={index}
            dream={dream}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={handleToggle}
          />
        ))}

        <motion.div
          className="timeline-end"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
        >
          <span className="timeline-end-icon">💍</span>
          <p className="timeline-end-text">{t.dreams.endText}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default FutureDreams;
