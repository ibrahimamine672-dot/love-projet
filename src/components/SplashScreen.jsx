import { useState, useEffect, useMemo, useCallback } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onStart, onFinish }) => {
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(true);

  /* ── 3 s countdown begins only after the user clicks ── */
  useEffect(() => {
    if (!started) return;

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setMounted(false);
        onFinish?.();
      }, 700);
    }, 2800);

    return () => clearTimeout(timer);
  }, [started, onFinish]);

  const handleEntry = useCallback(() => {
    if (started) return;
    setStarted(true);
    onStart?.();
  }, [started, onStart]);

  /* ── Petals — only generated once, but we only render them when started ── */
  const petals = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        style: {
          '--delay': `${(Math.random() * 2.8).toFixed(2)}s`,
          '--duration': `${(1.8 + Math.random() * 2.2).toFixed(2)}s`,
          '--drift-x': `${(Math.random() - 0.5) * 450}px`,
          '--fall-y': `${(100 + Math.random() * 300).toFixed(0)}px`,
          '--rotation': `${(Math.random() * 720 - 360).toFixed(0)}deg`,
          '--size': `${(16 + Math.random() * 18).toFixed(0)}px`,
          '--start-offset-x': `${(Math.random() - 0.5) * 60}px`,
          '--start-offset-y': `${(Math.random() - 0.5) * 40}px`,
        },
        petal: i % 3 === 0 ? '🌷' : i % 3 === 1 ? '🌸' : '💮',
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div
      className={`splash-screen ${!started ? 'splash-idle' : fadeOut ? 'splash-exit' : 'splash-enter'}`}
      onClick={!started ? handleEntry : undefined}
      role={!started ? 'button' : undefined}
      aria-label={!started ? 'Click anywhere to enter' : undefined}
      tabIndex={!started ? 0 : undefined}
      onKeyDown={!started ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleEntry(); } : undefined}
    >
      <div className="splash-bg" />

      {/* ── Centre content (rose always visible) ── */}
      <div className={`splash-center ${!started ? 'idle' : ''}`}>
        <div className="splash-rose-wrapper">
          <div className="splash-rose-glow" />
          <div className="splash-rose">🌹</div>
        </div>
        <h1 className="splash-title">For My Love</h1>
        <p className="splash-subtitle">With all my heart</p>
      </div>

      {/* ── Petals — only animate after click ── */}
      {started && (
        <div className="splash-petals-container" aria-hidden="true">
          {petals.map((p) => (
            <span
              key={p.id}
              className="splash-petal"
              style={p.style}
              aria-hidden="true"
            >
              {p.petal}
            </span>
          ))}
        </div>
      )}

      {/* ── Entry prompt — hidden after click ── */}
      {!started && (
        <div className="splash-entry-prompt">
          <span className="splash-entry-icon">♡</span>
          <span className="splash-entry-text">Click anywhere to enter</span>
          <span className="splash-entry-icon">♡</span>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
