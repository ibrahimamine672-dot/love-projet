import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BackgroundMusic.css';

const YOUTUBE_ID = 'viimfQi_pUw';
const SPOTIFY_URL = 'https://open.spotify.com/intl-fr/track/7hDVYcQq6MxkdJGweuCtl9';

const BackgroundMusic = forwardRef((_props, ref) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const iframeRef = useRef(null);

  const sendCommand = useCallback((command) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  }, []);

  /* ── Exposed imperative method: called on click inside the user gesture ── */
  useImperativeHandle(ref, () => ({
    start: () => {
      setIsPlaying(true);
      setIsMuted(false);
      sendCommand('unMute');
      sendCommand('playVideo');
    },
  }), [sendCommand]);

  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      sendCommand('unMute');
    } else {
      sendCommand('mute');
    }
    setIsMuted(!isMuted);
  }, [isMuted, sendCommand]);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      sendCommand('pauseVideo');
    } else {
      sendCommand('playVideo');
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, sendCommand]);

  const handleToggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  return (
    <div className="bg-music-wrapper">
      {/* Hidden YouTube iframe — no autoplay; start() triggers playback */}
      <div className="bg-music-iframe-container">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=0&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${YOUTUBE_ID}&enablejsapi=1`}
          width="0"
          height="0"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          title="Background Music"
        />
      </div>

      <AnimatePresence>
        <motion.div
          className={`bg-music-bar ${isMinimized ? 'minimized' : ''}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 2 }}
        >
          {isMinimized ? (
            <button
              className="bg-music-minimized-btn"
              onClick={handleToggleMinimize}
              aria-label="Show music player"
              title="Show music player"
            >
              <span className="music-equalizer">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </span>
            </button>
          ) : (
            <>
              <div className="bg-music-info">
                <span className="bg-music-icon">🎵</span>
                <div className="bg-music-text">
                  <span className="bg-music-label">Now Playing</span>
                  <span className="bg-music-title">
                    &ldquo;ocean eyes&rdquo; <span className="bg-music-artist">— Billie Eilish</span>
                  </span>
                </div>
              </div>

              <div className="bg-music-controls">
                <button
                  className="bg-music-btn"
                  onClick={handleTogglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? '⏸' : '▶️'}
                </button>

                <button
                  className={`bg-music-btn ${isMuted ? 'muted' : ''}`}
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>

                <a
                  href={SPOTIFY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-music-btn spotify-link"
                  title="Listen on Spotify"
                >
                  <span className="spotify-icon">🎧</span>
                </a>
              </div>

              <button
                className="bg-music-minimize"
                onClick={handleToggleMinimize}
                aria-label="Minimize"
                title="Minimize"
              >
                <span className="minimize-arrow">▾</span>
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {!isMinimized && (
        <button
          className="bg-music-drag-handle"
          onClick={handleToggleMinimize}
          aria-label="Minimize player"
        />
      )}
    </div>
  );
});

BackgroundMusic.displayName = 'BackgroundMusic';

export default BackgroundMusic;
