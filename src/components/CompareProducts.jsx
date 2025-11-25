import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, Info, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const CompareProducts = () => {
  const [selectedProducts, setSelectedProducts] = useState([0, 1, 2]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const products = [
    {
      id: 0,
      name: "Cintura Reloj de Arena",
      price: 179900,
      image: "/Cintura Reloj de Arena/Cocoa 1.png",
      compression: "Alta",
      material: "PowerNet + varillas flexibles",
      closure: "3 niveles",
      coverage: "Torso completo",
      posture: true,
      breathable: true,
      invisible: true,
      washable: true,
      warranty: "6 meses",
      ideal: "Moldeo instantáneo",
      rating: 4.9,
      reviews: 548,
      badge: "Más Popular",
      highlights: ["Efecto reloj de arena", "Refuerzo lumbar", "Incluye video"]
    },
    {
      id: 1,
      name: "Short Levanta Cola",
      price: 189900,
      image: "/short-magic-negro-1.png",
      compression: "Alta",
      material: "PowerNet + microfibra",
      closure: "Cierre frontal",
      coverage: "Cintura y muslos",
      posture: true,
      breathable: true,
      invisible: true,
      washable: true,
      warranty: "6 meses",
      ideal: "Realce glúteo con control",
      rating: 4.8,
      reviews: 500,
      badge: "Control Total",
      highlights: ["Levanta cola", "Triple compresión", "Antienrollamiento"]
    },
    {
      id: 2,
      name: "Cachetero Levanta Cola",
      price: 149900,
      image: "/Cachetero Levanta Cola/Color hueso 1.png",
      compression: "Media",
      material: "Encaje siliconado + PowerNet",
      closure: "Sin cierre",
      coverage: "Cadera",
      posture: false,
      breathable: true,
      invisible: true,
      washable: true,
      warranty: "3 meses",
      ideal: "Uso diario estilizado",
      rating: 4.9,
      reviews: 612,
      badge: "Uso Diario",
      highlights: ["Encaje antideslizante", "Sin marcas", "Realce natural"]
    },
    {
      id: 3,
      name: "Short Levanta Glúteo Invisible",
      price: 89900,
      image: "/short-negro-1.png",
      compression: "Media",
      material: "Microfibra ultra suave",
      closure: "Sin cierre",
      coverage: "Cadera/Glúteos",
      posture: false,
      breathable: true,
      invisible: true,
      washable: true,
      warranty: "3 meses",
      ideal: "Ropa ajustada",
      rating: 4.9,
      reviews: 567,
      badge: "Más Vendido",
      highlights: ["Invisible bajo vestidos", "Encaje siliconado", "Liviano"]
    }
  ];

  const features = [
    { key: 'compression', label: 'Compresión', type: 'text', important: true },
    { key: 'material', label: 'Material', type: 'text', important: true },
    { key: 'closure', label: 'Cierre', type: 'text' },
    { key: 'coverage', label: 'Cobertura', type: 'text' },
    { key: 'posture', label: 'Postura', type: 'boolean', important: true },
    { key: 'breathable', label: 'Transpirable', type: 'boolean' },
    { key: 'invisible', label: 'Invisible', type: 'boolean', important: true },
    { key: 'washable', label: 'Lavable', type: 'boolean' },
    { key: 'warranty', label: 'Garantía', type: 'text', important: true },
    { key: 'ideal', label: 'Ideal para', type: 'text', important: true }
  ];

  const handleProductChange = (index, productId) => {
    const newSelection = [...selectedProducts];
    newSelection[index] = productId;
    setSelectedProducts(newSelection);
  };

  const nextProduct = () => {
    setActiveProductIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setActiveProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Versión Móvil - Diseño de Tarjetas
  const MobileComparison = () => {
    const activeProduct = products[activeProductIndex];
    
    return (
      <div className="md:hidden">
        {/* Selector de Producto con Carousel */}
        <div className="relative mb-6">
          <motion.div
            key={activeProductIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {/* Badge */}
            {activeProduct.badge && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark text-white text-xs px-3 py-1 rounded-full font-semibold">
                {activeProduct.badge}
              </div>
            )}
            
            {/* Imagen del Producto */}
            <div className="relative mb-4">
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-48 object-cover rounded-xl"
              />
              {/* Indicadores de navegación */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveProductIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeProductIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Info del Producto */}
            <h3 className="font-bold text-lg text-esbelta-chocolate mb-2">
              {activeProduct.name}
            </h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-esbelta-terracotta">
                ${activeProduct.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(activeProduct.rating)
                          ? 'text-esbelta-terracotta fill-current'
                          : 'text-esbelta-sand-light'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-esbelta-chocolate-light">
                  ({activeProduct.reviews})
                </span>
              </div>
            </div>
            
            {/* Highlights */}
            <div className="flex flex-wrap gap-2 mb-4">
              {activeProduct.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="bg-white text-esbelta-chocolate text-xs px-3 py-1 rounded-full font-medium"
                >
                  {highlight}
                </span>
              ))}
            </div>
            
            {/* Características Principales */}
            <div className="space-y-2 mb-4">
              {features.filter(f => f.important).map((feature) => (
                <div key={feature.key} className="flex items-center justify-between text-sm">
                  <span className="text-esbelta-chocolate-light">{feature.label}:</span>
                  <span className="font-medium text-esbelta-chocolate">
                    {feature.type === 'boolean' ? (
                      activeProduct[feature.key] ? (
                        <Check className="w-4 h-4 text-esbelta-sand" />
                      ) : (
                        <X className="w-4 h-4 text-esbelta-sand" />
                      )
                    ) : (
                      activeProduct[feature.key]
                    )}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Botones de Navegación */}
            <div className="flex gap-2">
              <button
                onClick={prevProduct}
                className="flex-1 py-2 border border-esbelta-sand rounded-full flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                onClick={nextProduct}
                className="flex-1 py-2 border border-esbelta-sand rounded-full flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Botón CTA Principal */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary mb-4"
        >
          Comprar {activeProduct.name}
        </motion.button>
        
        {/* Toggle para Ver Comparación Completa */}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full py-3 bg-white rounded-full border border-esbelta-sand text-esbelta-chocolate font-medium hover:bg-white transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {showComparison ? 'Ocultar' : 'Ver'} Comparación Completa
        </button>
        
        {/* Comparación Rápida (Opcional) */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 bg-white rounded-2xl p-4 overflow-hidden"
            >
              <h4 className="font-bold text-esbelta-chocolate mb-3">
                Comparación Rápida
              </h4>
              <div className="space-y-3">
                {products.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setActiveProductIndex(product.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      activeProductIndex === product.id
                        ? 'border-esbelta-terracotta bg-white'
                        : 'border-esbelta-sand-light hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm text-esbelta-chocolate">
                          {product.name}
                        </h5>
                        <p className="text-xs text-esbelta-chocolate-light">
                          {product.ideal} • {product.compression}
                        </p>
                        <p className="text-sm font-bold text-esbelta-terracotta">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Versión Desktop - Tabla Original
  const DesktopComparison = () => (
    <div className="hidden md:block overflow-x-auto">
      <div className="min-w-[800px] bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Product Headers */}
        <div className="grid grid-cols-4 border-b border-esbelta-sand-light">
          <div className="p-6 bg-white">
            <h3 className="font-bold text-esbelta-chocolate">Características</h3>
          </div>
          {selectedProducts.map((productId, index) => {
            const product = products[productId];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 text-center border-l border-esbelta-sand-light"
              >
                {/* Product Selector */}
                <select
                  value={productId}
                  onChange={(e) => handleProductChange(index, parseInt(e.target.value))}
                  className="mb-4 px-3 py-1 border border-esbelta-sand rounded-lg text-sm focus:outline-none focus:border-esbelta-terracotta"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                {/* Product Image */}
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  {product.badge && (
                    <div className="absolute top-2 right-2 bg-esbelta-terracotta text-white text-xs px-2 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Product Name & Price */}
                <h4 className="font-bold text-esbelta-chocolate mb-2 text-sm">
                  {product.name}
                </h4>
                <div className="text-2xl font-bold text-esbelta-terracotta mb-2">
                  ${product.price.toLocaleString()}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-esbelta-terracotta fill-current'
                            : 'text-esbelta-sand-light'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-esbelta-chocolate-light">
                    ({product.reviews})
                  </span>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full btn-primary text-sm"
                >
                  Elegir Esta
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Rows */}
        {features.map((feature, featureIndex) => (
          <motion.div
            key={feature.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + featureIndex * 0.05 }}
            className={`grid grid-cols-4 border-b border-esbelta-sand-light ${
              featureIndex % 2 === 0 ? 'bg-white' : 'bg-white/30'
            }`}
          >
            <div className="p-4 font-medium text-esbelta-chocolate text-sm flex items-center gap-2">
              {feature.label}
              {feature.important && (
                <Sparkles className="w-3 h-3 text-esbelta-terracotta" />
              )}
            </div>
            {selectedProducts.map((productId, index) => {
              const product = products[productId];
              const value = product[feature.key];
              
              return (
                <div
                  key={index}
                  className="p-4 text-center border-l border-esbelta-sand-light"
                >
                  {feature.type === 'boolean' ? (
                    value ? (
                      <Check className="w-5 h-5 text-esbelta-sand mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-esbelta-sand mx-auto" />
                    )
                  ) : (
                    <span className="text-sm text-esbelta-chocolate-light">
                      {value}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="comparar" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Renderizar versión móvil o desktop */}
        {isMobile ? <MobileComparison /> : <DesktopComparison />}
      </div>
    </section>
  );
};

export default CompareProducts;