import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// NOTA: Se removió AnimatePresence para evitar conflictos DOM
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const ImageCarousel = ({ images = [], autoPlay = true, interval = 7000, eager = false, objectFit = 'contain', fillContainer = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Activar animaciones después del primer render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    // En móvil nunca pausar por hover, solo en desktop
    if (!autoPlay || (isHovered && !isMobile) || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, isHovered, isMobile, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-esbelta-chocolate-light">Sin imagen</span>
      </div>
    );
  }

  return (
    <div
      className="relative group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container - Sin AnimatePresence */}
      <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${fillContainer ? 'h-full' : 'aspect-[3/4]'}`}>
        <motion.div
          key={currentIndex}
          initial={mounted ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={mounted ? { duration: 0.3 } : { duration: 0 }}
          style={{ willChange: 'transform, opacity' }}
          className="w-full h-full"
        >
          <OptimizedImage
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className={`w-full h-full object-center ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
            loading={eager ? "eager" : "lazy"}
          />
        </motion.div>

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-esbelta-chocolate p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-esbelta-chocolate p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dots Indicator - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-esbelta-terracotta rounded-full'
                  : 'w-2 h-2 bg-esbelta-sand hover:bg-esbelta-sand-dark rounded-full'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails Strip (Optional - for desktop view) */}
      {images.length > 1 && images.length <= 6 && (
        <div className="hidden lg:flex gap-1 mt-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-12 h-16 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-esbelta-terracotta opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-80'
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;