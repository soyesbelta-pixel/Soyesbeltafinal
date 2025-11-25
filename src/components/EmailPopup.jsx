import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// NOTA: Se removió AnimatePresence para evitar conflictos DOM
import { X, Mail, Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import useStore from '../store/useStore';
import { subscribeEmail } from '../services/supabaseClient';

const EmailPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { capturedEmails, addCapturedEmail } = useStore();

  useEffect(() => {
    // No mostrar si ya se mostró en esta sesión o si ya capturamos un email
    const popupShown = sessionStorage.getItem('emailPopupShown');
    const alreadyCaptured = capturedEmails.length > 0;

    if (popupShown || alreadyCaptured) return;

    // Mostrar después de 10 segundos
    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem('emailPopupShown', 'true');
    }, 10000);

    return () => clearTimeout(timer);
  }, [capturedEmails]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showPopup && !showSuccess) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showPopup, showSuccess]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#D27C5A', '#3B2F2F', '#7D9A86', '#C9B7A5', '#F5EFE7']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#D27C5A', '#3B2F2F', '#7D9A86', '#C9B7A5', '#F5EFE7']
      });
    }, 250);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (emailError && validateEmail(value)) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);

    // Save to Supabase
    const { error, duplicate } = await subscribeEmail(email, {
      source: 'popup',
      user_agent: navigator.userAgent
    });

    if (error && !duplicate) {
      setEmailError('Error al guardar. Intenta de nuevo.');
      setIsSubmitting(false);
      return;
    }

    // Save email to local store
    addCapturedEmail(email);

    // Show success state
    setShowSuccess(true);
    triggerConfetti();

    // Close popup after 4 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 4000);

    setIsSubmitting(false);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  // Sin AnimatePresence - renderizado condicional simple
  if (!showPopup) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
        onClick={!showSuccess ? handleClose : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 m-auto w-[90%] h-fit max-w-[420px] sm:max-w-[480px] md:max-w-[520px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden"
      >
            {!showSuccess ? (
              <>
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white hover:bg-esbelta-sand-light rounded-full transition-all z-10 shadow-md"
                >
                  <X className="w-5 h-5 text-esbelta-chocolate" />
                </button>

                {/* Header Decoration */}
                <div className="relative h-24 sm:h-28 md:h-32 bg-gradient-to-br from-esbelta-terracotta via-esbelta-terracotta-dark to-esbelta-chocolate overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl" />
                    <div className="absolute bottom-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-white"
                    >
                      <Gift className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 py-5 sm:px-10 sm:py-6 md:px-12 md:py-7">
                  <div className="text-center mb-4 sm:mb-5">
                    <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-esbelta-chocolate mb-1.5 leading-tight">
                      Ingresa a exclusivos descuentos y regalos
                    </h2>
                    <p className="text-sm sm:text-base text-esbelta-chocolate-light">
                      Únete a nuestro club VIP
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-esbelta-terracotta bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-esbelta-terracotta" />
                      </div>
                      <span className="text-sm sm:text-base text-esbelta-chocolate-light leading-snug">
                        Ofertas exclusivas antes que nadie
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-esbelta-sand bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Gift className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-esbelta-sand" />
                      </div>
                      <span className="text-sm sm:text-base text-esbelta-chocolate-light leading-snug">
                        Regalo sorpresa de bienvenida
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esbelta-sand" />
                        <input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="tu@email.com"
                          className={`w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-esbelta-chocolate placeholder-esbelta-sand ${
                            emailError
                              ? 'border-red-400 focus:ring-red-200'
                              : 'border-esbelta-sand-light focus:ring-esbelta-terracotta focus:ring-opacity-30 focus:border-esbelta-terracotta'
                          }`}
                          disabled={isSubmitting}
                        />
                      </div>
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 mt-2 ml-1"
                        >
                          {emailError}
                        </motion.p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="w-full bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark text-white font-bold py-3 sm:py-3.5 text-base sm:text-lg rounded-xl hover:from-esbelta-terracotta-dark hover:to-esbelta-chocolate transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <span>¡Quiero mis beneficios!</span>
                          <Sparkles className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-8 py-12 sm:px-10 sm:py-14 md:px-12 md:py-16 text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 bg-gradient-to-br from-esbelta-sand to-esbelta-sand-dark rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6"
                >
                  <Sparkles className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-white" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl font-bold text-esbelta-chocolate mb-3"
                >
                  ¡Gracias!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-base sm:text-lg text-esbelta-chocolate-light mb-6"
                >
                  Pronto recibirás información exclusiva en tu email
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 text-sm sm:text-base text-esbelta-terracotta font-medium"
                >
                  <Gift className="w-5 h-5 flex-shrink-0" />
                  <span>Tu regalo de bienvenida está en camino</span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
    </>
  );
};

export default EmailPopup;