import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BackgroundMusic.css';

const YOUTUBE_ID = 'RnszjpcMKbk';
const SPOTIFY_URL = 'https://open.spotify.com/track/23ZdNaFSfH7VdSVU4U0Agb';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
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
      {/* Hidden YouTube iframe */}
      <div className="bg-music-iframe-container">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${YOUTUBE_ID}&enablejsapi=1`}
          width="0"
          height="0"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          title="Background Music"
          onLoad={() => setIsPlaying(true)}
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
          {/* Minimized: only show the music note toggle */}
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
              {/* Now playing info */}
              <div className="bg-music-info">
                <span className="bg-music-icon">🎵</span>
                <div className="bg-music-text">
                  <span className="bg-music-label">Now Playing</span>
                  <span className="bg-music-title">
                    "You Stole The Show" <span className="bg-music-artist">— SIENNA SPIRO</span>
                  </span>
                </div>
              </div>

              {/* Controls */}
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

              {/* Minimize button */}
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

      {/* Re-expand button when minimized */}
      {!isMinimized && (
        <button
          className="bg-music-drag-handle"
          onClick={handleToggleMinimize}
          aria-label="Minimize player"
        />
      )}
    </div>
  );
};

export default BackgroundMusic;
