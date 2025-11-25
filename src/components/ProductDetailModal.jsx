import { motion } from 'framer-motion';
// NOTA: Se removió AnimatePresence para evitar conflictos DOM
import { Heart, ShoppingCart, Star, X, Package, Ruler, MessageSquare, BookOpen, Play } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import useStore from '../store/useStore';
import ImageCarousel from './ImageCarousel';

// Generador dinámico de paletas de color basado en el nombre
const generateColorPalette = (colorName) => {
  // Validar que colorName no esté vacío
  if (!colorName || typeof colorName !== 'string' || colorName.trim() === '') {
    console.warn('generateColorPalette: colorName vacío o inválido, usando Negro por defecto');
    colorName = 'Negro';
  }

  const normalized = colorName.toLowerCase().trim();

  // Mapa de colores predefinidos (casos especiales)
  const predefinedColors = {
    'negro': { hex: '#000000', light: '#2a2a2a' },
    'blanco': { hex: '#FFFFFF', light: '#F5F5F5' },
    'beige': { hex: '#FAF0E6', light: '#FFF8F0' },
    'beige claro': { hex: '#FFF8F0', light: '#FFFBF5' },
    'rosa': { hex: '#FFC0CB', light: '#FFB6B6' },
    'rosa palido': { hex: '#FBD2DB', light: '#F7B9C7' },
    'rosa pálido': { hex: '#FBD2DB', light: '#F7B9C7' },
    'rosado palido': { hex: '#F6B9C6', light: '#F2A3B8' },
    'rosado pálido': { hex: '#F6B9C6', light: '#F2A3B8' },
    'café': { hex: '#8B4513', light: '#A0522D' },
    'cafe': { hex: '#8B4513', light: '#A0522D' },
    'marrón': { hex: '#8B4513', light: '#A0522D' },
    'marron': { hex: '#8B4513', light: '#A0522D' },
    'nude': { hex: '#F5DEB3', light: '#FFE4B5' },
    'azul': { hex: '#0000FF', light: '#4169E1' },
    'rojo': { hex: '#FF0000', light: '#FF4444' },
    'verde': { hex: '#00FF00', light: '#44FF44' },
    'amarillo': { hex: '#FFD700', light: '#FFE44D' },
    'naranja': { hex: '#FF8C00', light: '#FFA500' },
    'morado': { hex: '#800080', light: '#9932CC' },
    'púrpura': { hex: '#800080', light: '#9932CC' },
    'purpura': { hex: '#800080', light: '#9932CC' },
    'gris': { hex: '#808080', light: '#A9A9A9' },
    'plateado': { hex: '#C0C0C0', light: '#D3D3D3' },
    'dorado': { hex: '#FFD700', light: '#FFED4E' },
    'color hueso': { hex: '#F2E2CE', light: '#EAD8C2' },
    'cocoa': { hex: '#7F4A2E', light: '#B1764D' },
    'chocolate': { hex: '#3B2F2F', light: '#5C4A4A' },
    'crema': { hex: '#F5EFE7', light: '#FFF8F0' },
    'arena': { hex: '#C9B7A5', light: '#D9C7B5' },
    'terracota': { hex: '#D27C5A', light: '#E28C6A' },
    'coral': { hex: '#FF7F50', light: '#FF9F70' },
    'lavanda': { hex: '#E6E6FA', light: '#F0F0FF' },
    'menta': { hex: '#98FF98', light: '#B8FFB8' },
    'turquesa': { hex: '#40E0D0', light: '#70F0E0' },
    'vino': { hex: '#722F37', light: '#8B4049' },
    'burgundy': { hex: '#800020', light: '#A00030' },
    'navy': { hex: '#000080', light: '#0000CD' },
    'oliva': { hex: '#808000', light: '#9A9A00' }
  };

  // Si está en el mapa predefinido, usar esos valores
  if (predefinedColors[normalized]) {
    const colors = predefinedColors[normalized];
    return {
      id: normalized.replace(/\s+/g, '-'),
      name: colorName,
      hex: colors.hex,
      gradient: `linear-gradient(135deg, ${colors.hex} 0%, ${colors.light} 100%)`
    };
  }

  // Si no está predefinido, generar color basado en hash del nombre
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generar color base desde el hash
  const hue = Math.abs(hash % 360);
  const saturation = 60 + (Math.abs(hash) % 40); // 60-100%
  const lightness = 50 + (Math.abs(hash >> 8) % 30); // 50-80%

  const hex = hslToHex(hue, saturation, lightness);
  const lightHex = hslToHex(hue, saturation, Math.min(lightness + 15, 95));

  return {
    id: normalized.replace(/\s+/g, '-'),
    name: colorName,
    hex: hex,
    gradient: `linear-gradient(135deg, ${hex} 0%, ${lightHex} 100%)`
  };
};

// Función auxiliar: convertir HSL a HEX
const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('producto');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('negro');
  const [previewImage, setPreviewImage] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { addToCart, toggleFavorite, favorites, addNotification, setProductModalOpen } = useStore();
  const isFavorite = favorites.includes(product.id);

  // Generar dinámicamente las paletas de color para este producto
  const colorOptions = useMemo(() => {
    if (product?.colors?.length) {
      // Manejar tanto arrays de strings (products.js) como arrays de objetos (landing pages)
      const processedColors = product.colors.map(color => {
        // Si color es un objeto (desde landing pages: {id: 'negro', name: 'Negro', hex: '...'})
        if (typeof color === 'object' && color !== null) {
          return color.name || color.id || null;
        }
        // Si color es un string (desde products.js: "Negro", "Beige")
        if (typeof color === 'string') {
          return color;
        }
        // Valor inválido
        return null;
      }).filter(color => color && typeof color === 'string' && color.trim() !== '');

      // Si después de filtrar no quedan colores válidos, usar Negro por defecto
      if (processedColors.length === 0) {
        return [generateColorPalette('Negro')];
      }

      const colorPalettes = processedColors.map(colorName => generateColorPalette(colorName));

      // Eliminar duplicados basados en el ID para evitar keys duplicados
      const uniqueColorPalettes = colorPalettes.filter((palette, index, self) =>
        index === self.findIndex(p => p.id === palette.id)
      );

      return uniqueColorPalettes;
    }
    return [generateColorPalette('Negro')];
  }, [product?.colors]);

  useEffect(() => {
    if (colorOptions.length > 0) {
      setSelectedColor(colorOptions[0].id);
    } else {
      setSelectedColor('negro');
    }
  }, [colorOptions, product?.id]);

  useEffect(() => {
    if (!isOpen) {
      setIsVideoModalOpen(false);
    }
  }, [isOpen]);

  // Prevenir scroll del body y fijar viewport cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      // Notificar al store que el modal está abierto (para ocultar header)
      setProductModalOpen(true);

      // Guardar el scroll actual
      const scrollY = window.scrollY;

      // Prevenir scroll del body y overflow horizontal
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overflowX = 'hidden';

      // Prevenir comportamiento de zoom en iOS
      document.body.style.touchAction = 'none';

      return () => {
        // Notificar al store que el modal está cerrado (para mostrar header)
        setProductModalOpen(false);

        // Restaurar scroll del body
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.overflowX = '';

        // Restaurar posición de scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, setProductModalOpen]);

  const handleAddToCart = () => {
    const selectedColorName = colorOptions.find(c => c.id === selectedColor)?.name || 'Negro';
    addToCart({ ...product, size: selectedSize, color: selectedColorName });
    addNotification({
      type: 'success',
      message: `${product.name} (${selectedSize}, ${selectedColorName}) agregado al carrito! 🎉`
    });
  };

  const handleFavorite = () => {
    toggleFavorite(product.id);
  };

  const handleSubmitReview = () => {
    if (newReview.name.trim() && newReview.comment.trim()) {
      // Reset form
      setShowReviewForm(false);
      setNewReview({ name: '', rating: 5, comment: '' });

      // Mostrar mensaje de agradecimiento
      addNotification({
        type: 'success',
        message: 'Estamos agradecidos por su comentario, lo revisaremos'
      });
    } else {
      addNotification({
        type: 'error',
        message: 'Por favor completa todos los campos'
      });
    }
  };

  const tabs = [
    { id: 'producto', label: 'Producto', icon: Package },
    { id: 'como-usar', label: 'Cómo Usar', icon: BookOpen },
    { id: 'tallas', label: 'Guía de Tallas', icon: Ruler },
    { id: 'resenas', label: 'Reseñas', icon: MessageSquare }
  ];

  // Datos de pasos de uso según el producto
  const getUsageSteps = () => {
    // Para Short Levanta Cola Magic (producto de hombre, ID 2)
    if (product.id === 2) {
      return [
        {
          number: 1,
          title: "Toma el short por la cintura",
          description: "Toma el short por la pretina con ambas manos. Asegúrate de que esté bien orientado.",
          image: "/paso-hombre-1.png"
        },
        {
          number: 2,
          title: "Introduce la primera pierna",
          description: "Introduce la primera pierna hasta pasar completamente el encaje sin enrollarse.",
          image: "/paso-hombre-2.png"
        },
        {
          number: 3,
          title: "Sube el short poco a poco",
          description: "Sube el short poco a poco hasta que quede ajustado sobre los glúteos y las caderas.",
          image: "/paso-hombre-3.png"
        },
        {
          number: 4,
          title: "Ajusta el short",
          description: "Ajusta el short en el abdomen para que cubra correctamente. Evita pliegues o enrollados.",
          image: "/paso-hombre-4.png"
        }
      ];
    }

    // Para productos de mujer (default)
    return [
      {
        number: 1,
        title: "Toma el short por la cintura",
        description: "Toma el short por la pretina con ambas manos. Asegúrate de que el cierre baje completamente al encaje sin enrollarse.",
        image: "/Paso 1.jpeg"
      },
      {
        number: 2,
        title: "Introduce la primera pierna",
        description: "Introduce la primera pierna hasta pasar completamente el encaje sin enrollarse.",
        image: "/paso 2.png"
      },
      {
        number: 3,
        title: "Sube el short poco a poco",
        description: "Sube el short poco a poco hasta que quede ajustada sobre los glúteos y las caderas.",
        image: "/paso 3.png"
      },
      {
        number: 4,
        title: "Ajusta el short",
        description: "Ajusta el short en el abdomen para que cubra desde debajo del busto hasta el vientre. Evita pliegues o enrollados.",
        image: "/paso 4.png"
      }
    ];
  };

  const usageSteps = getUsageSteps();

  // Tabla de medidas
  const sizeChart = {
    headers: ['TALLAS', 'CINTURA', 'CADERA'],
    rows: [
      { size: 'XS', waist: '62-65 cm', hip: '88-91 cm' },
      { size: 'S', waist: '66-69 cm', hip: '92-95 cm' },
      { size: 'M', waist: '70-73 cm', hip: '96-99 cm' },
      { size: 'L', waist: '74-77 cm', hip: '100-103 cm' },
      { size: 'XL', waist: '78-81 cm', hip: '104-107 cm' },
      { size: 'XXL', waist: '82-85 cm', hip: '108-111 cm' },
      { size: '3XL', waist: '86-89 cm', hip: '112-115 cm' },
      { size: '4XL', waist: '90-93 cm', hip: '116-119 cm' },
      { size: '5XL', waist: '94-97 cm', hip: '120-123 cm' },
      { size: '6XL', waist: '98-102 cm', hip: '124-128 cm' }
    ]
  };

  // Testimonios de ejemplo
  const testimonials = [
    {
      id: 1,
      name: "Sandra C.",
      rating: 5,
      date: "Hace 2 semanas",
      comment: "La faja es increíble, me moldea muy bien sin sentir molestias. La tela es suave pero firme y no se rueda para abajo. Excelente calidad!",
      verified: true
    },
    {
      id: 2,
      name: "Alejandra V.",
      rating: 5,
      date: "Hace 1 mes",
      comment: "Una buena inversión en fajas con un excelente resultado en mi figura. Se disimula muy bien bajo la ropa, volveré a comprar!",
      verified: true
    },
    {
      id: 3,
      name: "Patricia - Superventas",
      rating: 5,
      date: "Hace 3 semanas",
      comment: "La verdad perfecta, realmente hago que mi silueta se vea mucho más estilizada. También el material es cómodo y siente uno que lleva un short normal hasta que ajusta el mismo corte y la tela. Es verdad que realzan mucho.",
      verified: true
    }
  ];

  if (!isOpen || !product) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[70] flex items-center justify-center p-0 sm:p-4 overflow-hidden"
        onClick={onClose}
        style={{ touchAction: 'none', minWidth: '100vw', minHeight: '100vh' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-none sm:rounded-2xl w-full h-full sm:w-auto sm:max-w-6xl sm:h-auto sm:max-h-[90vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))' }}
        >
          {/* Botón X FIJO - Siempre visible */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-[100] p-2.5 bg-esbelta-terracotta hover:bg-esbelta-chocolate text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 border-2 border-white"
            aria-label="Cerrar"
            title="Cerrar"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>

          {/* Header con tabs */}
          <div className="border-b bg-gradient-to-r bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between p-4 pr-16">
              <h2 className="text-xl font-bold text-esbelta-chocolate">{product.name}</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 pb-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-esbelta-terracotta text-white'
                      : 'bg-white text-esbelta-chocolate hover:bg-esbelta-sand-light'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto pb-20 md:pb-16"
            style={{
              height: 'calc(100vh - 180px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
              maxHeight: 'calc(90vh - 180px)',
              WebkitOverflowScrolling: 'touch'
            }}
          >
              {/* Tab: Producto - Sin AnimatePresence */}
              {activeTab === 'producto' && (
                <motion.div
                  key="producto"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid md:grid-cols-2 gap-6 p-6"
                >
                  {/* Images */}
                  <div>
                    {(() => {
                      // Obtener las imágenes del color seleccionado
                      const imagesToShow = product.imagesByColor && product.imagesByColor[selectedColor]
                        ? product.imagesByColor[selectedColor]
                        : product.images;

                      return imagesToShow && imagesToShow.length > 0 ? (
                        <ImageCarousel
                          images={imagesToShow}
                          autoPlay={true}
                          interval={7000}
                          objectFit="cover"
                          eager={true}
                        />
                      ) : (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full rounded-lg object-cover"
                        />
                      );
                    })()}
                  </div>

                  {/* Details */}
                  <div>
                    {/* Rating - Solo visible en desktop */}
                    <div className="hidden md:flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? 'text-esbelta-terracotta fill-current'
                                : 'text-esbelta-sand-light'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-esbelta-chocolate-light">
                        {product.rating} ({product.reviews} reseñas)
                      </span>
                    </div>

                    {/* Color Selector - Solo visible en móvil, reemplaza el rating */}
                    <div className="md:hidden mb-6">
                      <div className="flex gap-3 items-center justify-center">
                        {colorOptions.map((color) => (
                          <div key={color.id} className="relative group">
                            <button
                              onClick={() => setSelectedColor(color.id)}
                              className={`w-12 h-12 rounded-full border-4 transition-all transform hover:scale-110 ${
                                selectedColor === color.id
                                  ? 'border-esbelta-terracotta shadow-lg scale-110'
                                  : 'border-gray-300 hover:border-esbelta-sand'
                              }`}
                              style={{ background: color.gradient }}
                              title={color.name}
                            />
                            <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap transition-opacity ${
                              selectedColor === color.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-esbelta-chocolate-light mb-4">{product.description}</p>

                    {product.videoUrl && (
                      <div className="mb-6">
                        <button
                          onClick={() => setIsVideoModalOpen(true)}
                          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-esbelta-terracotta text-white rounded-xl shadow-lg hover:bg-esbelta-terracotta-dark transition-colors"
                          type="button"
                        >
                          <Play className="w-5 h-5" />
                          Ver en movimiento
                        </button>
                        <p className="mt-2 text-sm text-esbelta-chocolate-light text-center md:text-left">
                          Mira cómo moldea el color Cocoa en una modelo real.
                        </p>
                      </div>
                    )}

                    {/* Sello Hecho en Colombia */}
                    <div className="flex items-center justify-center md:justify-start mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="relative"
                      >
                        <img
                          src="/hecho-en-colombia-logo.png"
                          alt="Hecho en Colombia"
                          className="w-40 md:w-48 h-auto"
                        />
                        <span className="text-sm text-esbelta-chocolate-light mt-2 block text-center font-medium">
                          Calidad 100% Garantizada
                        </span>
                      </motion.div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="font-bold mb-3 text-esbelta-chocolate">Características:</h3>
                      <ul className="space-y-2">
                        {product.features?.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-esbelta-sand">✓</span>
                            <span className="text-esbelta-chocolate-light">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sizes */}
                    <div className="mb-6">
                      <h3 className="font-bold mb-3 text-esbelta-chocolate">Talla:</h3>
                      <div className="flex gap-2 flex-wrap">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedSize === size
                                ? 'border-esbelta-terracotta bg-esbelta-terracotta text-white'
                                : 'border-esbelta-sand-light hover:border-esbelta-sand text-esbelta-chocolate'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selector - Solo visible en desktop */}
                    <div className="hidden md:block mb-6">
                      <h3 className="font-bold mb-3 text-esbelta-chocolate">Color:</h3>
                      <div className="flex gap-3 items-center">
                        {colorOptions.map((color) => (
                          <div key={color.id} className="relative group">
                            <button
                              onClick={() => setSelectedColor(color.id)}
                              className={`w-12 h-12 rounded-full border-4 transition-all transform hover:scale-110 ${
                                selectedColor === color.id
                                  ? 'border-esbelta-terracotta shadow-lg scale-110'
                                  : 'border-gray-300 hover:border-esbelta-sand'
                              }`}
                              style={{ background: color.gradient }}
                              title={color.name}
                            />
                            <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap transition-opacity ${
                              selectedColor === color.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stock Alert Only */}
                    {product.stock < 10 && (
                      <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-orange-600 text-sm font-medium animate-pulse">
                          ⚡ Solo {product.stock} unidades disponibles
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab: Cómo Usar */}
              {activeTab === 'como-usar' && (
                <motion.div
                  key="como-usar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6"
                >
                  <h3 className="text-2xl font-bold text-esbelta-chocolate mb-6 text-center">
                    Cómo ponerte tu faja correctamente
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {usageSteps.map((step) => (
                      <motion.div
                        key={step.number}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: step.number * 0.1 }}
                        className="bg-gradient-to-br bg-white rounded-xl p-6 shadow-lg"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-esbelta-terracotta text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                              {step.number}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-esbelta-chocolate mb-2">
                                Paso {step.number}: {step.title}
                              </h4>
                              <p className="text-sm text-esbelta-chocolate-light">
                                {step.description}
                              </p>
                            </div>
                          </div>
                          <div
                            className="relative w-full aspect-[4/3] bg-white rounded-lg overflow-hidden border border-esbelta-sand-light cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setPreviewImage(step.image)}
                          >
                            <img
                              src={step.image}
                              alt={`Paso ${step.number}`}
                              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-esbelta-sand/20 to-esbelta-terracotta/20 rounded-xl">
                    <h4 className="font-bold text-esbelta-chocolate mb-3">💡 Tips Importantes:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-esbelta-sand">✓</span>
                        <span className="text-sm text-esbelta-chocolate-light">
                          No tires muy fuerte de la faja para evitar dañar las costuras
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-esbelta-sand">✓</span>
                        <span className="text-sm text-esbelta-chocolate-light">
                          Comienza con el ajuste mínimo e incrementa gradualmente
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-esbelta-sand">✓</span>
                        <span className="text-sm text-esbelta-chocolate-light">
                          Evita que la pretina se enrolle o doble
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-esbelta-sand">✓</span>
                        <span className="text-sm text-esbelta-chocolate-light">
                          Asegúrate que no haya pliegues ni arrugas
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-esbelta-chocolate-light mb-4">
                      ¿Tienes dudas? Habla con nuestras asesoras
                    </p>
                    <a
                      href="https://wa.me/573147404023?text=Hola!%20Tengo%20dudas%20sobre%20cómo%20usar%20la%20faja"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Chat en WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Tab: Tallas */}
              {activeTab === 'tallas' && (
                <motion.div
                  key="tallas"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6"
                >
                  <h3 className="text-2xl font-bold text-esbelta-chocolate mb-6 text-center">
                    Encuentra tu talla perfecta
                  </h3>

                  <div className="max-w-4xl mx-auto">
                    {/* Tabla de medidas */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                      <div className="bg-gradient-to-r from-esbelta-terracotta to-esbelta-chocolate p-4">
                        <h4 className="text-white font-bold text-lg">Tabla de Medidas</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-white">
                              {sizeChart.headers.map((header) => (
                                <th key={header} className="px-4 py-3 text-left font-bold text-esbelta-chocolate">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sizeChart.rows.map((row, index) => (
                              <tr key={row.size} className={index % 2 === 0 ? 'bg-white' : 'bg-white/30'}>
                                <td className="px-4 py-3 font-bold text-esbelta-chocolate">{row.size}</td>
                                <td className="px-4 py-3 text-esbelta-chocolate-light">{row.waist}</td>
                                <td className="px-4 py-3 text-esbelta-chocolate-light">{row.hip}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Guía de medición */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br bg-white rounded-xl p-6">
                        <h4 className="font-bold text-esbelta-chocolate mb-4">¿Cómo medirte?</h4>
                        <ol className="space-y-3">
                          <li className="flex items-start gap-3">
                            <span className="bg-esbelta-terracotta text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              1
                            </span>
                            <div>
                              <p className="font-medium text-esbelta-chocolate">Cintura</p>
                              <p className="text-sm text-esbelta-chocolate-light">
                                Mide alrededor de la parte más estrecha de tu cintura
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="bg-esbelta-terracotta text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              2
                            </span>
                            <div>
                              <p className="font-medium text-esbelta-chocolate">Cadera</p>
                              <p className="text-sm text-esbelta-chocolate-light">
                                Mide alrededor de la parte más ancha de tus caderas
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="bg-esbelta-terracotta text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              3
                            </span>
                            <div>
                              <p className="font-medium text-esbelta-chocolate">Compara</p>
                              <p className="text-sm text-esbelta-chocolate-light">
                                Compara tus medidas con la tabla para encontrar tu talla
                              </p>
                            </div>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-gradient-to-br from-esbelta-sand/20 to-esbelta-terracotta/20 rounded-xl p-6">
                        <h4 className="font-bold text-esbelta-chocolate mb-4">Recomendaciones</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-esbelta-sand">•</span>
                            <span className="text-sm text-esbelta-chocolate-light">
                              Si estás entre dos tallas, elige la más grande para mayor comodidad
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-esbelta-sand">•</span>
                            <span className="text-sm text-esbelta-chocolate-light">
                              Para uso post-operatorio, consulta con tu médico la talla adecuada
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-esbelta-sand">•</span>
                            <span className="text-sm text-esbelta-chocolate-light">
                              La faja debe sentirse firme pero no restringir la respiración
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center bg-gradient-to-r bg-white rounded-xl p-6">
                      <p className="text-esbelta-chocolate mb-4">
                        ¿No estás segura de tu talla? Nuestras asesoras pueden ayudarte
                      </p>
                      <a
                        href="https://wa.me/573147404023?text=Hola!%20Necesito%20ayuda%20para%20elegir%20mi%20talla"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Asesoría Personalizada
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: Reseñas */}
              {activeTab === 'resenas' && (
                <motion.div
                  key="resenas"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6"
                >
                  <h3 className="text-2xl font-bold text-esbelta-chocolate mb-6 text-center">
                    Lo que dicen nuestras clientas
                  </h3>

                  {/* Resumen de calificaciones */}
                  <div className="bg-gradient-to-r bg-white rounded-xl p-6 mb-8 max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-esbelta-terracotta mb-2">
                          {product.rating}
                        </div>
                        <div className="flex justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 ${
                                i < Math.floor(product.rating)
                                  ? 'text-esbelta-terracotta fill-current'
                                  : 'text-esbelta-sand-light'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-esbelta-chocolate-light">
                          Basado en {product.reviews} reseñas
                        </p>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                              <span className="text-sm text-esbelta-chocolate">{stars}</span>
                              <Star className="w-4 h-4 text-esbelta-terracotta fill-current" />
                            </div>
                            <div className="flex-1 bg-esbelta-sand-light rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-esbelta-terracotta transition-all"
                                style={{
                                  width: stars === 5 ? '85%' :
                                         stars === 4 ? '10%' :
                                         stars === 3 ? '3%' :
                                         stars === 2 ? '1%' : '1%'
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lista de testimonios */}
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {testimonials.map((testimonial) => (
                      <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: testimonial.id * 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                      >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-esbelta-chocolate">
                                  {testimonial.name}
                                </h4>
                                {testimonial.verified && (
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    ✓ Compra verificada
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-esbelta-chocolate-light">
                                {testimonial.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < testimonial.rating
                                      ? 'text-esbelta-terracotta fill-current'
                                      : 'text-esbelta-sand-light'
                                  }`}
                                />
                              ))}
                            </div>

                          <p className="text-esbelta-chocolate-light">
                            {testimonial.comment}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA para dejar reseña */}
                  <div className="mt-8">
                    {!showReviewForm ? (
                      <div className="text-center">
                        <p className="text-esbelta-chocolate-light mb-4">
                          ¿Ya tienes tu faja? ¡Nos encantaría conocer tu experiencia!
                        </p>
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="btn-secondary"
                        >
                          Escribir una Reseña
                        </button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
                      >
                        <h4 className="text-xl font-bold text-esbelta-chocolate mb-4">
                          Comparte tu experiencia
                        </h4>

                        {/* Campo de nombre */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-esbelta-chocolate mb-2">
                            Tu nombre
                          </label>
                          <input
                            type="text"
                            value={newReview.name}
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                            className="w-full px-4 py-2 border border-esbelta-sand-light rounded-lg focus:outline-none focus:border-esbelta-terracotta"
                            placeholder="Ej: María G."
                          />
                        </div>

                        {/* Selector de calificación */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-esbelta-chocolate mb-2">
                            Calificación
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className="transition-transform hover:scale-110"
                                type="button"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= newReview.rating
                                      ? 'text-esbelta-terracotta fill-current'
                                      : 'text-esbelta-sand-light'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Campo de comentario */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-esbelta-chocolate mb-2">
                            Tu comentario
                          </label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full px-4 py-2 border border-esbelta-sand-light rounded-lg focus:outline-none focus:border-esbelta-terracotta resize-none"
                            rows={4}
                            placeholder="Cuéntanos tu experiencia con el producto..."
                          />
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={() => {
                              setShowReviewForm(false);
                              setNewReview({ name: '', rating: 5, comment: '' });
                            }}
                            className="px-6 py-2 text-esbelta-chocolate hover:bg-esbelta-sand-light rounded-lg transition-colors"
                            type="button"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSubmitReview}
                            className="px-6 py-2 bg-esbelta-terracotta text-white rounded-lg hover:bg-esbelta-terracotta-dark transition-colors"
                            type="button"
                          >
                            Enviar Reseña
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
          </div>

          {/* Footer con precio fijo - Más compacto y centrado */}
          <div className="border-t bg-gradient-to-r bg-white p-2 md:p-3 sticky bottom-0">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center justify-center gap-3 md:gap-8">
                {/* Precio - Más compacto */}
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-lg md:text-3xl font-bold text-esbelta-terracotta">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs md:text-xl text-esbelta-sand line-through">
                      ${product.originalPrice.toLocaleString('es-CO')}
                    </span>
                  )}
                </div>

                {/* Botones - Centrados y alejados del borde */}
                <div className="flex items-center gap-2 md:gap-3 mr-12 md:mr-0">
                  <button
                    onClick={handleFavorite}
                    className={`p-2 md:p-3 rounded-lg border-2 transition-all ${
                      isFavorite
                        ? 'border-esbelta-terracotta bg-esbelta-terracotta text-white'
                        : 'border-esbelta-sand-light hover:border-esbelta-terracotta text-esbelta-chocolate'
                    }`}
                    title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 text-sm md:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Agregar al Carrito</span>
                    <span className="sm:hidden">Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Modal - Sin AnimatePresence */}
        {isVideoModalOpen && product?.videoUrl && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="fixed inset-0 bg-black/95 z-[100] cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            >
              <div className="relative w-full max-w-3xl pointer-events-auto">
                {/* Botón X - Brandeado Esbelta */}
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="absolute -top-12 md:-top-14 right-0 bg-esbelta-terracotta hover:bg-esbelta-chocolate text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 border-2 border-esbelta-cream z-10"
                  aria-label="Cerrar video"
                >
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>

                {/* Contenedor del video */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                  <video
                    src={product.videoUrl}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm md:text-base rounded-lg px-4 py-3 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span>Observa el ajuste del color Cocoa en movimiento.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

      {/* Image Preview Modal - Sin AnimatePresence */}
        {previewImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setPreviewImage(null)}
              className="fixed inset-0 bg-black/90 z-[100] cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative max-w-4xl w-full pointer-events-auto">
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </motion.div>
          </>
        )}
    </>
  );
};

export default ProductDetailModal;
