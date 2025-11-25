import { motion } from 'framer-motion';
import { ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 15, seconds: 0 });
  const [activeCustomers] = useState(127); // Estático para evitar re-renders
  const timeRef = useRef(timeLeft);

  // Timer optimizado - actualiza ref y solo re-renderiza cuando es necesario
  useEffect(() => {
    const timer = setInterval(() => {
      const prev = timeRef.current;
      let next;
      if (prev.seconds > 0) {
        next = { ...prev, seconds: prev.seconds - 1 };
      } else if (prev.minutes > 0) {
        next = { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      } else if (prev.hours > 0) {
        next = { hours: prev.hours - 1, minutes: 59, seconds: 59 };
      } else {
        next = prev;
      }
      timeRef.current = next;
      setTimeLeft(next);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen lg:h-screen h-auto flex items-center justify-center overflow-hidden bg-white py-32 lg:py-0">
      {/* Wordmark Decorativo de Fondo - Sin animación */}
      <div
        className="wordmark-bg absolute top-1/4 left-1/2 opacity-65"
        style={{ transform: 'translate(-50%, 0)' }}
      >
        <span style={{ display: 'block' }}>CHOCOLATES</span>
      </div>

      {/* Background Element - Estático, sin blur pesado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-beige/30 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content - Animación única para todo el bloque */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Flash Sale Badge */}
            <div
              className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: '#F88379' }}
            >
              <Clock className="w-4 h-4" />
              <span className="font-semibold font-body">OFERTA LANZAMIENTO</span>
              <span className="text-sm font-body">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <h1 className="font-heading mb-6">
              <span className="block" style={{ color: '#4E3229' }}>
                Transforma
              </span>
              <span className="block" style={{ color: '#4E3229' }}>
                Tu Silueta
              </span>
              <span className="block text-3xl lg:text-5xl font-body font-medium text-chocolate-light">
                Instantáneamente
              </span>
            </h1>

            <p className="text-lg font-body text-chocolate-light mb-8">
              Shapewear colombiano que acompaña tu movimiento y realza tu figura sin apretar.
            </p>

            {/* CTAs - Sin animaciones pesadas */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://wa.me/573147404023?text=Hola!%20Me%20interesa%20conocer%20sus%20productos%20de%20fajas%20colombianas%20🛍️"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-lg group whatsapp-button font-body font-semibold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: '#D7BFA3', color: '#2C1E1E' }}
              >
                <MessageCircle className="w-5 h-5" style={{ color: 'white' }} />
                Ver Catálogo por WhatsApp
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: 'white' }} />
              </a>

              <a
                href="https://wa.me/573147404023?text=Hola!%20Quiero%20una%20asesoría%20personalizada%20para%20elegir%20la%20faja%20perfecta%20para%20mí%20💬"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body font-semibold py-3 px-6 rounded-full transition-transform hover:scale-[1.02] active:scale-95 inline-flex items-center justify-center gap-2 group shadow-lg"
                style={{ backgroundColor: '#D7BFA3', color: '#2C1E1E' }}
              >
                <MessageCircle className="w-5 h-5" style={{ color: 'white' }} />
                Asesoría Gratis por WhatsApp
              </a>
            </div>

            {/* Social Proof - Sin animación */}
            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["/avatar-1.jpg", "/avatar-2.jpg", "/avatar-3.jpg", "/avatar-4.jpg"].map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt={`Cliente ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-paper shadow-sm object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-body font-semibold text-chocolate">
                  {activeCustomers} personas comprando ahora
                </p>
                <p className="text-xs font-body text-chocolate-light">
                  ⭐⭐⭐⭐⭐ 4.9/5 (2,847 reseñas)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image/Visual - Animación simple de entrada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="relative">
              <div className="relative z-10">
                <div className="aspect-[3/4] bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <img
                    src="/hero-image.png"
                    alt="Faja Premium Esbelta"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />

                  {/* Badges estáticos */}
                  <div
                    className="absolute top-4 right-4 text-white px-3 py-1 rounded-full font-body font-semibold shadow-lg"
                    style={{ backgroundColor: '#F88379' }}
                  >
                    -10% HOY
                  </div>

                  <div
                    className="absolute bottom-4 left-4 px-4 py-2 rounded-full shadow-lg"
                    style={{ backgroundColor: '#D7BFA3' }}
                  >
                    <span className="font-body font-semibold" style={{ color: '#4E3229' }}>+ 785 compras</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements - Estáticos */}
              <div className="absolute top-0 right-0 w-32 h-32 border-4 border-beige rounded-full -z-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose/20 rounded-full -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Animación CSS simple */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-chocolate-light rounded-full flex justify-center">
          <div className="w-1 h-3 bg-chocolate-light rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
