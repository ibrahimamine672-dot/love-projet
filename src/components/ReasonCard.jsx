import { motion } from 'framer-motion';
import './ReasonCard.css';

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
    rotateY: -60,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      duration: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    rotateY: 60,
    transition: {
      duration: 0.4,
    },
  },
};

const sparkleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i) => ({
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    transition: {
      duration: 1.5,
      delay: i * 0.2,
      repeat: Infinity,
      repeatDelay: 3,
    },
  }),
};

const ReasonCard = ({ reason, number, onFavorite, isFavorited, t: translations }) => {
  const t = translations?.reasons;
  const sparkles = [
    { x: -30, y: -30 },
    { x: 30, y: -20 },
    { x: -20, y: 30 },
    { x: 25, y: 25 },
  ];

  return (
    <motion.div
      className="reason-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div className="reason-card-glow" />

      {/* Sparkles */}
      {sparkles.map((sparkle, i) => (
        <motion.span
          key={i}
          className="sparkle"
          custom={i}
          variants={sparkleVariants}
          initial="initial"
          animate="animate"
          style={{
            top: `calc(50% + ${sparkle.y}px)`,
            left: `calc(50% + ${sparkle.x}px)`,
          }}
        >
          ✨
        </motion.span>
      ))}

      <div className="reason-card-header">
        <span className="reason-number">#{number}</span>
        <button
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={() => onFavorite?.(number)}
          aria-label={isFavorited ? (t?.removeFav || 'Remove from favorites') : (t?.addFav || 'Add to favorites')}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="reason-card-body">
        <span className="reason-quote">"</span>
        <p className="reason-text">{reason}</p>
        <span className="reason-quote end">"</span>
      </div>

      <div className="reason-card-footer">
        <span className="reason-decoration">💕</span>
      </div>
    </motion.div>
  );
};

export default ReasonCard;
