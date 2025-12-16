import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Zap, Eye, Play, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import ImageCarousel from './ImageCarousel';
import ProductDetailModal from './ProductDetailModal';
import ShareButton from './ShareButton';

const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [showQuickView, setShowQuickView] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoActivated, setVideoActivated] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState(null);
  const videoRef = useRef(null);

  const { addToCart, toggleFavorite, favorites, addNotification } = useStore();
  const isFavorite = favorites.includes(product.id);
  // Solo habilitar video si existe un flag explícito en el producto
  const hasVideoPreview = Boolean(product.videoUrl && product.videoPreview);

  // Obtener imágenes del primer color disponible para la tarjeta
  const getCardImages = () => {
    if (product.imagesByColor && Object.keys(product.imagesByColor).length > 0) {
      const firstColorKey = Object.keys(product.imagesByColor)[0];
      return product.imagesByColor[firstColorKey];
    }
    return product.images || [];
  };

  const cardImages = getCardImages();

  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product.sizes]);

  // Detectar dispositivo móvil por ancho de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint de Tailwind
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Control de reproducción del video
  useEffect(() => {
    if (videoRef.current && hasVideoPreview) {
      // En desktop: hover controla el video
      // En móvil: videoActivated controla el video
      if ((isHovered && !isMobile) || (videoActivated && isMobile)) {
        videoRef.current.play().catch(e => console.log('Video autoplay:', e));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, videoActivated, isMobile, hasVideoPreview, product.videoUrl]);

  // Reset video activation after timeout
  useEffect(() => {
    if (videoActivated && isMobile) {
      const timeout = setTimeout(() => {
        setVideoActivated(false);
      }, 5000); // Reset después de 5 segundos
      return () => clearTimeout(timeout);
    }
  }, [videoActivated, isMobile]);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!product.sizes || product.sizes.length === 0) {
      addNotification?.({
        type: 'error',
        message: 'Este producto no tiene tallas disponibles en este momento.'
      });
      return;
    }

    if (!selectedSize || !product.sizes.includes(selectedSize)) {
      addNotification?.({
        type: 'warning',
        message: 'Selecciona una talla disponible antes de agregar al carrito.'
      });
      return;
    }

    const productWithSize = { ...product, size: selectedSize };
    addToCart(productWithSize);

    addNotification?.({
      type: 'success',
      message: `${product.name} agregado al carrito 🎉`
    });
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  // Manejo de touch para móviles con video
  const handleMobileTouch = (e) => {
    if (!isMobile || !hasVideoPreview) {
      // Si no es móvil o no hay video, abrir modal directamente
      setShowQuickView(true);
      return;
    }

    e.stopPropagation();

    if (!videoActivated) {
      // Primer toque: activar video
      setVideoActivated(true);
      // Clear any existing timeout
      if (touchTimeout) clearTimeout(touchTimeout);

      // Set new timeout to reset after 5 seconds
      const timeout = setTimeout(() => {
        setVideoActivated(false);
      }, 5000);
      setTouchTimeout(timeout);
    } else {
      // Segundo toque: abrir modal
      setShowQuickView(true);
      setVideoActivated(false);
      if (touchTimeout) clearTimeout(touchTimeout);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="card-product relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMobileTouch}
      >
        {/* Badges */}
        {product.hot && (
          <div className="badge-hot">
            <Zap className="w-3 h-3 inline" /> PREMIUM
          </div>
        )}

        {product.discount && (
          <div className="absolute top-14 right-2 text-white text-sm font-body font-semibold px-2 py-1 rounded-lg z-10" style={{ backgroundColor: '#F88379' }}>
            -{product.discount}%
          </div>
        )}

        {/* Image Container with Carousel or Video */}
        <div className="relative h-[420px] md:h-[500px] overflow-hidden bg-white rounded-t-2xl">
          {/* Video para productos - Versión REDUCIDA */}
          {hasVideoPreview && ((isHovered && !isMobile) || (videoActivated && isMobile)) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-900/95 rounded-t-2xl p-4"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={product.videoUrl}
                  className="max-w-[85%] max-h-[85%] object-contain rounded-lg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={cardImages?.[0] || product.image}
                  onLoadedData={() => setIsVideoLoaded(true)}
                >
                  <source src={product.videoUrl} type="video/mp4" />
                </video>
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              {cardImages && cardImages.length > 0 ? (
                <ImageCarousel
                  images={cardImages}
                  autoPlay={false}
                  interval={7000}
                  fillContainer
                  objectFit="cover"
                />
              ) : (
                <motion.img
                  animate={{ scale: isHovered && !hasVideoPreview ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          )}

          {/* Indicador de video disponible - Desktop */}
          {hasVideoPreview && !isMobile && (
            <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs z-10">
              <Play className="w-3 h-3 fill-current" />
              <span>Video</span>
            </div>
          )}

          {/* Indicador "Toca para ver video" - Móvil */}
          {hasVideoPreview && isMobile && !videoActivated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1
              }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="bg-black/70 text-white px-4 py-3 rounded-xl flex flex-col items-center gap-2">
                <Play className="w-8 h-8 fill-current" />
                <span className="text-sm font-medium">Toca para ver video</span>
              </div>
            </motion.div>
          )}

          {/* Indicador "Toca para ver detalles" - Móvil con video activo */}
          {hasVideoPreview && isMobile && videoActivated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-0 right-0 flex justify-center z-20 pointer-events-none"
            >
              <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-medium">
                Video activo • Toca para ver detalles
              </div>
            </motion.div>
          )}

          {/* Botón para cerrar video - Brandeado Esbelta */}
          {hasVideoPreview && ((isHovered && !isMobile) || (videoActivated && isMobile)) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, type: "spring" }}
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile) {
                  setVideoActivated(false);
                  if (touchTimeout) clearTimeout(touchTimeout);
                } else {
                  setIsHovered(false);
                }
              }}
              className="absolute top-3 right-3 z-[60] bg-rose hover:bg-rose-hover text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-90 hover:scale-110 border-2 border-paper"
              aria-label="Cerrar video"
              title="Cerrar video"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          )}

          {/* Quick Actions Overlay - Solo en desktop o móvil sin video activo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: (isHovered && !isMobile) || (isMobile && !hasVideoPreview && !videoActivated) ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-3"
            style={{ pointerEvents: (isHovered && !isMobile) ? 'auto' : 'none' }}
          >
            <button
              onClick={handleFavorite}
              className={`p-3 rounded-full ${
                isFavorite ? 'bg-rose text-white' : 'bg-white text-ink'
              } hover:scale-110 transition-transform`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <ShareButton
              productName={product.name}
              productImage={product.image}
              productId={product.id}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="p-3 bg-white text-chocolate rounded-full hover:scale-110 transition-transform border border-line"
            >
              <Eye className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-chocolate fill-current'
                    : 'text-line'
                }`}
              />
            ))}
            <span className="text-xs font-body text-chocolate-light">({product.reviews})</span>
          </div>

          {/* Title */}
          <h3 className="font-body font-semibold text-[15px] text-chocolate mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm font-body text-chocolate-light mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[23px] font-body font-bold text-chocolate">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm font-body text-chocolate-light opacity-50 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div className="flex gap-1 mb-3">
            {product.sizes.slice(0, 4).map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-3 py-1 text-xs font-body rounded-lg border transition-all ${
                  selectedSize === size
                    ? 'border-chocolate bg-white text-chocolate font-semibold'
                    : 'border-line hover:border-chocolate/40'
                }`}
              >
                {size}
              </button>
            ))}
            {product.sizes.length > 4 && (
              <span className="px-2 py-1 text-xs font-body text-chocolate-light">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar al Carrito
          </motion.button>

          {/* Urgency Message */}
          {product.stock < 10 && (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs text-orange-600 text-center mt-2"
            >
              ⚡ {Math.floor(Math.random() * 10) + 5} personas viendo este producto
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Nueva versión con tabs - ProductDetailModal */}
      <ProductDetailModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />

      {/* Versión anterior comentada para respaldo
      {showQuickView && (
        <QuickViewModal
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          onClose={() => setShowQuickView(false)}
          onAddToCart={handleAddToCart}
        />
      )}
      */}
    </>
  );
};

const QuickViewModal = ({ product, selectedSize, setSelectedSize, onClose, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Images with Carousel */}
          <div>
            {product.images && product.images.length > 0 ? (
              <ImageCarousel 
                images={product.images}
                autoPlay={true}
                interval={7000}
              />
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg"
              />
            )}
          </div>

          {/* Details */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-chocolate mb-4">{product.name}</h2>
            <p className="font-body text-chocolate-light mb-4">{product.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h3 className="font-body font-semibold text-chocolate mb-2">Características:</h3>
              <ul className="space-y-1">
                {product.features?.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-body">
                    <span className="text-rose">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <h3 className="font-body font-semibold text-chocolate mb-2">Talla:</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 font-body rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'border-chocolate bg-white text-chocolate font-semibold'
                        : 'border-line hover:border-chocolate/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-body font-bold text-chocolate">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                {product.originalPrice && (
                  <span className="text-lg font-body text-chocolate-light opacity-50 line-through">
                    ${product.originalPrice.toLocaleString('es-CO')}
                  </span>
                )}
              </div>

              <button
                onClick={onAddToCart}
                className="w-full btn-primary"
              >
                Agregar al Carrito
              </button>

              <button
                onClick={onClose}
                className="w-full font-body text-chocolate-light hover:text-chocolate transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
