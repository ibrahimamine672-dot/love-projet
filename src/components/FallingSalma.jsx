import { useMemo } from 'react';
import './FallingSalma.css';

const FALL_COUNT = 20;

const SIZES = ['0.8rem', '1rem', '1.2rem', '1.4rem', '1.6rem', '1.8rem', '2rem'];

const LABELS = ['Salma', 'Salma ❤️', '❤️ Salma', 'Salma 💕', '💕 Salma'];

const generateItems = () => {
  const items = [];
  for (let i = 0; i < FALL_COUNT; i++) {
    items.push({
      id: i,
      label: LABELS[i % LABELS.length],
      left: Math.random() * 100,                    // percent
      duration: 12 + Math.random() * 18,             // seconds (12–30)
      delay: -(Math.random() * 30),                  // negative delay = starts mid-animation
      size: SIZES[Math.floor(Math.random() * SIZES.length)],
      peakOpacity: 0.06 + Math.random() * 0.1,       // 0.06–0.16
    });
  }
  return items;
};

const FallingSalma = () => {
  const items = useMemo(() => generateItems(), []);

  return (
    <div className="falling-salma" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="falling-salma__item"
          style={{
            left: `${item.left}%`,
            fontSize: item.size,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            '--fall-peak-opacity': item.peakOpacity,
          }}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
};

export default FallingSalma;
