import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import secretMessages from '../data/secretMessages';
import messagesSecrets from '../data/secretMessages-fr';
import './MemoryVault.css';

const vaultData = {
  en: secretMessages,
  fr: messagesSecrets,
};

const MemoryVault = () => {
  const { language, t } = useLanguage();
  const currentMessages = vaultData[language] || secretMessages;

  const [messages, setMessages] = useState(
    currentMessages.map(msg => ({ ...msg, unlocked: false }))
  );
  const [activeMessage, setActiveMessage] = useState(null);

  const unlockMessage = (id) => {
    const message = currentMessages.find(m => m.id === id);
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, unlocked: true } : msg
      )
    );
    setActiveMessage(message);
  };

  const closeMessage = () => {
    setActiveMessage(null);
  };

  const unlockedCount = messages.filter(m => m.unlocked).length;

  return (
    <div className="vault-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">{t.vault.title}</h1>
        <p className="page-subtitle">{t.vault.subtitle}</p>

        <motion.div
          className="vault-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="vault-progress-text">
            {t.vault.unlocked}: {unlockedCount} / {messages.length}
          </span>
          <div className="vault-progress-bar">
            <motion.div
              className="vault-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / messages.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="vault-grid">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            className={`vault-item ${message.unlocked ? 'unlocked' : 'locked'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => !message.unlocked && unlockMessage(message.id)}
          >
            {message.unlocked ? (
              <motion.div
                className="vault-item-content"
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveMessage(message)}
              >
                <span className="vault-item-unlocked-icon">💝</span>
                <span className="vault-item-title">{message.title}</span>
                <span className="vault-item-preview">
                  {message.message.slice(0, 40)}...
                </span>
                <span className="vault-item-tap">{t.vault.tapToRead}</span>
              </motion.div>
            ) : (
              <motion.div
                className="vault-item-locked"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="lock-icon"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🔒
                </motion.span>
                <span className="vault-item-number">{t.vault.secret} #{message.id}</span>
                <span className="vault-item-hint">{t.vault.tapToUnlock}</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Expanded Message Modal */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            className="vault-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMessage}
          >
            <motion.div
              className="vault-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="vault-modal-close" onClick={closeMessage}>
                ✕
              </button>

              <motion.div
                className="vault-modal-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              >
                💖
              </motion.div>

              <h2 className="vault-modal-title">{activeMessage.title}</h2>

              <motion.div
                className="vault-modal-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p>{activeMessage.message}</p>
              </motion.div>

              <motion.div
                className="vault-modal-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="vault-modal-hearts">💕</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {unlockedCount === messages.length && (
        <motion.div
          className="vault-complete"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="vault-complete-icon">🏆</span>
          <p className="vault-complete-text">{t.vault.completeText}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryVault;
