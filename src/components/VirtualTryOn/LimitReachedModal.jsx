import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';

/**
 * Limit Reached Modal - Simple version
 * Shows when user has used all 5 free tries
 * Redirects to products page
 */
const LimitReachedModal = ({ isOpen, onClose }) => {
  const handleGoToProducts = () => {
    onClose();
    // Redirect to products section on homepage
    window.location.href = '/#productos';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-esbelta-terracotta to-esbelta-terracotta p-8 text-white text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">¡Te encantó!</h2>
              <p className="text-white/90">Has usado tus 5 pruebas gratuitas</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-center text-esbelta-chocolate">
                ¡Es hora de hacer realidad tu transformación!
                <span className="block mt-2 font-semibold">
                  Compra ahora y luce espectacular 💃✨
                </span>
              </p>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-esbelta-terracotta rounded-lg p-4">
                <p className="text-center font-bold text-esbelta-chocolate text-lg">
                  Usa el cupón: <span className="text-2xl text-esbelta-terracotta">PROBADOR10</span>
                </p>
                <p className="text-center text-sm text-esbelta-chocolate/70 mt-1">
                  ¡10% de descuento en tu primera compra!
                </p>
              </div>

              <button
                onClick={handleGoToProducts}
                className="w-full py-4 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105"
              >
                <ShoppingBag className="inline w-5 h-5 mr-2" />
                Ver Productos y Comprar
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-esbelta-chocolate hover:text-esbelta-terracotta transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LimitReachedModal;
