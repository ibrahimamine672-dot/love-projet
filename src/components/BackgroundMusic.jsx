import { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BackgroundMusic.css';

const YOUTUBE_ID = 'sElE_BfQ67s';
const SPOTIFY_URL = 'https://open.spotify.com/intl-fr/track/1oAwsWBovWRIp7qLMGPIet';

const BackgroundMusic = forwardRef((_props, ref) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const playerRef = useRef(null);
  const playerReadyRef = useRef(false);
  const containerRef = useRef(null);
  const apiReadyRef = useRef(false);
  const pendingCommands = useRef([]);

  // ── Load YouTube IFrame API only once ──
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      apiReadyRef.current = true;
      return;
    }
    if (document.querySelector('#youtube-iframe-api')) return;

    const tag = document.createElement('script');
    tag.id = 'youtube-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = () => {
      apiReadyRef.current = true;
      // Flush any pending player creation
      if (containerRef.current) {
        createPlayer();
      }
    };

    // Note: intentionally not cleaning up onYouTubeIframeAPIReady
    // because the script tag persists across re-mounts (StrictMode, HMR)
  }, []);

  const createPlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player) return;
    if (playerRef.current) return;

    const player = new window.YT.Player(containerRef.current, {
      height: '1',
      width: '1',
      videoId: YOUTUBE_ID,
      playerVars: {
        autoplay: 0,
        mute: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        loop: 1,
        playlist: YOUTUBE_ID,
      },
      events: {
        onReady: () => {
          playerReadyRef.current = true;
          // Flush queued commands
          pendingCommands.current.forEach(cmd => cmd());
          pendingCommands.current = [];
        },
      },
    });
    playerRef.current = player;
  }, []);

  // ── Create player once container and API are ready ──
  useEffect(() => {
    if (apiReadyRef.current) {
      createPlayer();
    }

    return () => {
      // Clean up the player on unmount
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
        playerReadyRef.current = false;
      }
    };
  }, [createPlayer]);

  const runOrQueue = useCallback((fn) => {
    if (playerReadyRef.current && playerRef.current) {
      fn(playerRef.current);
    } else {
      pendingCommands.current.push(() => fn(playerRef.current));
    }
  }, []);

  /* ── Exposed imperative method: called on click inside the user gesture ── */
  useImperativeHandle(ref, () => ({
    start: () => {
      setIsPlaying(true);
      setIsMuted(false);
      runOrQueue((player) => {
        player.unMute();
        player.playVideo();
      });
    },
  }), [runOrQueue]);

  const handleToggleMute = useCallback(() => {
    runOrQueue((player) => {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
    });
    setIsMuted(!isMuted);
  }, [isMuted, runOrQueue]);

  const handleTogglePlay = useCallback(() => {
    runOrQueue((player) => {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });
    setIsPlaying(!isPlaying);
  }, [isPlaying, runOrQueue]);

  const handleToggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  return (
    <div className="bg-music-wrapper">
      {/* Hidden YouTube player container */}
      <div className="bg-music-iframe-container" ref={containerRef} />

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
                    &ldquo;Apocalypse&rdquo; <span className="bg-music-artist">— Cigarettes After Sex</span>
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
