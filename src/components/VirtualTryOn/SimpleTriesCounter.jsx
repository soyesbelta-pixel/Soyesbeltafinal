import { Sparkles } from 'lucide-react';

/**
 * Simple Tries Counter
 * Shows remaining attempts in a clean, simple way
 */
const SimpleTriesCounter = ({ remainingTries }) => {
  const percentage = (remainingTries / 5) * 100;

  return (
    <div className="bg-gradient-to-br bg-white p-4 rounded-xl border-2 border-esbelta-sand shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-esbelta-chocolate">
          Te quedan <span className="text-lg font-bold text-esbelta-terracotta">{remainingTries}</span> {remainingTries === 1 ? 'intento' : 'intentos'} gratis
        </span>
        <Sparkles className="w-5 h-5 text-esbelta-terracotta" />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${
            remainingTries <= 1 ? 'bg-red-500' :
            remainingTries <= 2 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SimpleTriesCounter;
