import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { products } from '../data/products';
import useStore from '../store/useStore';

const RelatedProducts = ({ excludeId = null, category = 'realce' }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { addToCart, addNotification, toggleFavorite, favorites } = useStore();

  // Filtrar productos relacionados
  const relatedProducts = products
    .filter(p => p.id !== excludeId && (category === 'all' || p.category === category))
    .slice(0, 4);

  const handleQuickAdd = (product) => {
    addToCart({
      ...product,
      size: 'M',
      color: product.colors[0],
      image: product.image
    });
    addNotification({
      type: 'success',
      message: `${product.name} agregado al carrito`
    });
  };

  const handleToggleFavorite = (productId, e) => {
    e.stopPropagation();
    toggleFavorite(productId);
    addNotification({
      type: 'info',
      message: favorites.includes(productId) ? 'Eliminado de favoritos' : 'Agregado a favoritos'
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-beige/20 text-chocolate px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="font-body font-semibold text-sm">MÁS VENDIDOS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-chocolate mb-4">
            También te Puede Interesar
          </h2>
          <p className="text-chocolate-light font-body text-lg max-w-2xl mx-auto">
            Descubre más productos premium que complementarán tu guardarropa
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-line"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.hot && (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-rose text-white px-3 py-1 rounded-full text-xs font-body font-semibold shadow-lg"
                  >
                    HOT 🔥
                  </motion.span>
                )}
                {product.new && (
                  <span className="bg-chocolate text-white px-3 py-1 rounded-full text-xs font-body font-semibold shadow-lg">
                    NUEVO ✨
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-body font-semibold shadow-lg">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  onClick={(e) => handleToggleFavorite(product.id, e)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-colors ${
                    favorites.includes(product.id)
                      ? 'bg-rose text-white'
                      : 'bg-white/90 text-chocolate hover:bg-rose hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-chocolate hover:bg-chocolate hover:text-white transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-beige/10">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredProduct === product.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.6 }}
                />

                {/* Quick Add Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    y: hoveredProduct === product.id ? 0 : 20
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-x-0 bottom-0 p-4"
                >
                  <motion.button
                    onClick={() => handleQuickAdd(product)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-chocolate text-white py-3 px-4 rounded-full font-body font-bold shadow-xl hover:bg-chocolate-light transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    AGREGAR AL CARRITO
                  </motion.button>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category */}
                <p className="text-chocolate-light font-body text-xs uppercase mb-2">
                  {product.category}
                </p>

                {/* Product Name */}
                <h3 className="font-body font-bold text-chocolate text-lg mb-2 line-clamp-2 group-hover:text-chocolate-light transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-rose fill-current'
                            : 'text-line'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-chocolate-light font-body text-sm">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Colors Available */}
                <div className="flex gap-2 mb-3">
                  {product.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-line"
                      style={{
                        backgroundColor:
                          color.toLowerCase() === 'negro'
                            ? '#1a1a1a'
                            : color.toLowerCase() === 'beige'
                            ? '#E8D5C4'
                            : color.toLowerCase() === 'cocoa'
                            ? '#8B6F47'
                            : '#E8D5C4'
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-chocolate-light font-body text-xs flex items-center">
                      +{product.colors.length - 3}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-heading text-chocolate">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-chocolate-light line-through mb-0.5">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Indicator */}
                {product.stock < 10 && (
                  <div className="mt-3 inline-flex items-center gap-1 bg-rose/10 text-rose px-3 py-1 rounded-full text-xs font-body font-semibold">
                    <span className="w-2 h-2 bg-rose rounded-full animate-pulse" />
                    Solo quedan {product.stock}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-chocolate-light font-body mb-6">
            ¿No encuentras lo que buscas?
          </p>
          <motion.a
            href="/catalogo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-chocolate px-8 py-4 rounded-full font-body font-bold border-2 border-chocolate hover:bg-chocolate hover:text-white transition-all shadow-lg"
          >
            VER CATÁLOGO COMPLETO
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default RelatedProducts;
