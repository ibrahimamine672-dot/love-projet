import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import loveLetter from '../data/loveLetter';
import loveLetterFr from '../data/loveLetter-fr';
import './LoveLetter.css';

const TypewriterText = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </span>
  );
};

const letterData = {
  en: loveLetter,
  fr: loveLetterFr,
};

const LoveLetter = () => {
  const { language, t } = useLanguage();
  const currentLetter = letterData[language] || loveLetter;

  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const paragraphRefs = useRef([]);

  const handleParagraphComplete = () => {
    const next = currentParagraph + 1;
    if (next < currentLetter.paragraphs.length) {
      setTimeout(() => {
        setCurrentParagraph(next);
      }, 600);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <div className="letter-page">
      {/* Decorative elements */}
      <div className="letter-decorations">
        <motion.div
          className="letter-petal"
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌸
        </motion.div>
        <motion.div
          className="letter-petal"
          animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          🌷
        </motion.div>
      </div>

      <motion.div
        className="letter-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="letter-seal"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
        >
          💌
        </motion.div>

        <motion.h1
          className="letter-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {currentLetter.title}
        </motion.h1>

        <div className="letter-body">
          {currentLetter.paragraphs.slice(0, currentParagraph + 1).map((para, index) => (
            <motion.p
              key={index}
              className={`letter-paragraph ${index === currentParagraph ? 'typing' : 'revealed'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              ref={el => paragraphRefs.current[index] = el}
            >
              {index === currentParagraph ? (
                <TypewriterText
                  text={para}
                  speed={25 + para.length * 0.05}
                  onComplete={handleParagraphComplete}
                />
              ) : (
                para
              )}
            </motion.p>
          ))}
        </div>

        {isComplete && (
          <motion.div
            className="letter-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="letter-signoff">
              <p className="signoff-text">{t.letter.signoff}</p>
              <p className="signoff-name">{t.letter.signoffName}</p>
            </div>
            <div className="letter-hearts">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                💗
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                💕
              </motion.span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LoveLetter;
