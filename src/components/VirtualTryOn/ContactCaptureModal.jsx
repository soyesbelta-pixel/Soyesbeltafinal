import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Sparkles } from 'lucide-react';
import { validateContactForm } from '../../utils/formValidation';
import VirtualTryOnUserService from '../../services/VirtualTryOnUserService';
import confetti from 'canvas-confetti';

/**
 * Contact Capture Modal
 * Captures user information before allowing access to Virtual Try-On
 */
const ContactCaptureModal = ({ isOpen, onClose, onSuccess, onCloseVirtualTryOn }) => {
  const [formData, setFormData] = useState({
    userName: '',
    whatsapp: ''
  });

  const [errors, setErrors] = useState({
    userName: '',
    whatsapp: ''
  });

  const [touched, setTouched] = useState({
    userName: false,
    whatsapp: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate single field on blur
    const validation = validateContactForm({ ...formData, [field]: formData[field] });
    setErrors(prev => ({ ...prev, [field]: validation.errors[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ userName: true, whatsapp: true });

    // Validate entire form
    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Register user (save to Supabase and localStorage)
      await VirtualTryOnUserService.registerUser(formData.userName, formData.whatsapp);

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D27C5A', '#7D9A86', '#C9B7A5', '#F5EFE7']
      });

      // Notify parent component
      onSuccess();

      // Close modal after brief delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error registering user:', error);
      setErrors(prev => ({
        ...prev,
        whatsapp: 'Hubo un error. Por favor intenta nuevamente.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Botón X - Cierra TODO el probador virtual */}
            <button
              onClick={onCloseVirtualTryOn}
              className="absolute top-3 right-3 z-10 p-2.5 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 border-2 border-white"
              aria-label="Cerrar Probador Virtual"
              title="Cerrar Probador Virtual"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </button>

            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-esbelta-terracotta to-esbelta-terracotta p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">¡Bienvenida!</h2>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                Para usar nuestro Probador Virtual, déjanos tus datos y disfruta probando nuestros productos. 🎨✨
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-esbelta-chocolate mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-esbelta-sand" />
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleChange('userName', e.target.value)}
                    onBlur={() => handleBlur('userName')}
                    placeholder="Ej: María García"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-esbelta-terracotta focus:border-transparent transition ${
                      touched.userName && errors.userName
                        ? 'border-red-500'
                        : 'border-esbelta-sand'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {touched.userName && errors.userName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.userName}
                  </motion.p>
                )}
              </div>

              {/* WhatsApp Input */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-esbelta-chocolate mb-1">
                  WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-esbelta-sand" />
                  <input
                    type="tel"
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    onBlur={() => handleBlur('whatsapp')}
                    placeholder="Ej: +52 55 1234 5678"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-esbelta-terracotta focus:border-transparent transition ${
                      touched.whatsapp && errors.whatsapp
                        ? 'border-red-500'
                        : 'border-esbelta-sand'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {touched.whatsapp && errors.whatsapp && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.whatsapp}
                  </motion.p>
                )}
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-esbelta-chocolate/70">
                Tus datos son confidenciales. Solo los usaremos para mejorar tu experiencia
                y enviarte ofertas exclusivas. 🔒
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Guardando...
                  </span>
                ) : (
                  '¡Comenzar a Probar! ✨'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactCaptureModal;
