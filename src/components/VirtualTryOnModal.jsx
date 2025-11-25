import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import VirtualTryOnApp from './VirtualTryOn/VirtualTryOnApp';

const VirtualTryOnModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="relative w-full max-w-7xl bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta rounded-xl shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 border-2 border-white"
                  aria-label="Cerrar Probador Virtual"
                  title="Cerrar Probador Virtual"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                </button>

                {/* Virtual Try-On App */}
                <div className="h-[90vh] overflow-y-auto">
                  <VirtualTryOnApp onCloseVirtualTryOn={onClose} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VirtualTryOnModal;