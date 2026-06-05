import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FloatingHearts.css';

const FloatingHearts = ({ count = 10 }) => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generateHearts = () => {
      const newHearts = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 20,
        opacity: Math.random() * 0.4 + 0.1,
        rotation: Math.random() * 360,
      }));
      setHearts(newHearts);
    };

    generateHearts();
    const interval = setInterval(() => {
      setHearts(prev =>
        prev.map(heart => ({
          ...heart,
          x: Math.random() * 100,
          delay: 0,
          duration: Math.random() * 15 + 10,
        }))
      );
    }, 25000);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="floating-hearts">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="heart-particle"
            initial={{
              opacity: 0,
              y: 100,
              x: `${heart.x}vw`,
              scale: 0,
              rotate: heart.rotation,
            }}
            animate={{
              opacity: heart.opacity,
              y: -100,
              x: [`${heart.x}vw`, `${heart.x + (Math.random() - 0.5) * 10}vw`],
              scale: 1,
              rotate: heart.rotation + 360,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
            style={{
              width: heart.size,
              height: heart.size,
              fontSize: heart.size,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHearts;
