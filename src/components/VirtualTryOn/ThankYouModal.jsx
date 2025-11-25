import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Sparkles, CheckCircle } from 'lucide-react';

/**
 * Thank You Modal
 * Shown when user exhausts all tries, encourages purchase
 */
const ThankYouModal = ({ isOpen, onClose, userName, onGoToCatalog }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition shadow-md"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-esbelta-chocolate" />
            </button>

            {/* Header with Gradient */}
            <div className="bg-gradient-to-br from-esbelta-terracotta via-esbelta-sand to-esbelta-chocolate p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4"
              >
                <Heart className="w-10 h-10 text-esbelta-terracotta fill-current" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-2"
              >
                ¡Gracias, {userName}! ✨
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90"
              >
                Has usado todos tus intentos del Probador Virtual
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Benefits Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-esbelta-chocolate flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-esbelta-terracotta" />
                  ¿Lista para el siguiente paso?
                </h3>

                <div className="space-y-2">
                  <BenefitItem
                    icon={<CheckCircle className="w-5 h-5 text-esbelta-sand" />}
                    text="Ya conoces los productos que mejor te quedan"
                  />
                  <BenefitItem
                    icon={<CheckCircle className="w-5 h-5 text-esbelta-sand" />}
                    text="Envío GRATIS en tu primera compra"
                  />
                  <BenefitItem
                    icon={<CheckCircle className="w-5 h-5 text-esbelta-sand" />}
                    text="Garantía de satisfacción 100%"
                  />
                  <BenefitItem
                    icon={<CheckCircle className="w-5 h-5 text-esbelta-sand" />}
                    text="Asesoría personalizada por WhatsApp"
                  />
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-3">
                <button
                  onClick={onGoToCatalog}
                  className="w-full py-4 px-6 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Ver Catálogo Completo
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 text-esbelta-chocolate hover:bg-white transition rounded-xl"
                >
                  Cerrar
                </button>
              </div>

              {/* Special Offer Banner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center"
              >
                <p className="text-sm font-semibold text-yellow-900 mb-1">
                  🎁 Oferta Especial para Ti
                </p>
                <p className="text-xs text-yellow-800">
                  Usa el código <span className="font-bold bg-yellow-200 px-2 py-0.5 rounded">PROBADOR10</span> para obtener 10% de descuento
                </p>
              </motion.div>

              {/* Footer Message */}
              <p className="text-xs text-center text-esbelta-chocolate/60">
                Esperamos que hayas disfrutado el Probador Virtual.
                <br />
                ¡Nos vemos pronto! 💕
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Benefit Item Component
 */
const BenefitItem = ({ icon, text }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-2"
  >
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <p className="text-sm text-esbelta-chocolate/80">{text}</p>
  </motion.div>
);

export default ThankYouModal;
