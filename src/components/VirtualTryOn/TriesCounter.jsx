import { motion } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';

/**
 * Tries Counter Component
 * Displays remaining tries with visual feedback
 */
const TriesCounter = ({ remainingTries, userName }) => {
  const getTriesColor = () => {
    if (remainingTries >= 4) return 'text-esbelta-sand';
    if (remainingTries >= 2) return 'text-yellow-600';
    return 'text-esbelta-terracotta';
  };

  const getTriesIcon = () => {
    if (remainingTries <= 1) return AlertCircle;
    return Sparkles;
  };

  const Icon = getTriesIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r bg-white rounded-xl p-4 shadow-md border border-esbelta-sand/30"
    >
      <div className="flex items-center justify-between gap-4">
        {/* User Greeting */}
        <div className="flex-1">
          <p className="text-sm text-esbelta-chocolate/70">
            ¡Hola, <span className="font-semibold">{userName}!</span>
          </p>
          <p className="text-xs text-esbelta-chocolate/60 mt-0.5">
            Te quedan <span className="font-bold">{remainingTries}</span> {remainingTries === 1 ? 'intento' : 'intentos'}
          </p>
        </div>

        {/* Tries Display */}
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${getTriesColor()}`} />
          <motion.div
            key={remainingTries}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-3xl font-bold ${getTriesColor()}`}
          >
            {remainingTries}
          </motion.div>
        </div>
      </div>

      {/* Warning Message for Low Tries */}
      {remainingTries <= 2 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-esbelta-sand/30"
        >
          <p className="text-xs text-esbelta-terracotta flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {remainingTries === 1 ? (
              <span>¡Último intento! Después podrás comprar tus favoritas 🛍️</span>
            ) : (
              <span>¡Quedan pocos intentos! Úsalos sabiamente ✨</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full h-2 bg-esbelta-sand/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(remainingTries / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              remainingTries >= 4
                ? 'bg-esbelta-chocolate'
                : remainingTries >= 2
                ? 'bg-yellow-500'
                : 'bg-esbelta-terracotta'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TriesCounter;
