import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import FloatingHearts from '../components/FloatingHearts';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="home-page">
      <FloatingHearts count={15} />

      <div className="home-content">
        <motion.div
          className="home-hero"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="home-hearts-banner"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 12 }}
          >
            <span className="banner-heart">💖</span>
            <span className="banner-heart">💗</span>
            <span className="banner-heart">💕</span>
          </motion.div>

          <motion.h1
            className="home-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t.home.title}
            <br />
            <span className="home-title-accent">{t.home.titleAccent}</span>
            <span className="home-title-heart"> ❤️</span>
          </motion.h1>

          <motion.p
            className="home-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {t.home.subtitle.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 ? <br /> : null}</span>
            ))}
          </motion.p>

          <motion.div
            className="home-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Link to="/reasons" className="cta-button primary">
              <span>{t.home.ctaPrimary}</span>
              <span className="cta-arrow">→</span>
            </Link>
            <Link to="/letter" className="cta-button secondary">
              {t.home.ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="home-features"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <Link to="/reasons" className="feature-card">
            <span className="feature-icon">💝</span>
            <span className="feature-title">{t.home.feature1Title}</span>
            <span className="feature-desc">{t.home.feature1Desc}</span>
          </Link>

          <Link to="/letter" className="feature-card">
            <span className="feature-icon">💌</span>
            <span className="feature-title">{t.home.feature2Title}</span>
            <span className="feature-desc">{t.home.feature2Desc}</span>
          </Link>

          <Link to="/dreams" className="feature-card">
            <span className="feature-icon">✨</span>
            <span className="feature-title">{t.home.feature3Title}</span>
            <span className="feature-desc">{t.home.feature3Desc}</span>
          </Link>

          <Link to="/vault" className="feature-card">
            <span className="feature-icon">🔐</span>
            <span className="feature-title">{t.home.feature4Title}</span>
            <span className="feature-desc">{t.home.feature4Desc}</span>
          </Link>
        </motion.div>

        <motion.div
          className="home-footer-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <p className="quote-text">
            {t.home.quote}
          </p>
          <p className="quote-author">{t.home.quoteAuthor}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
