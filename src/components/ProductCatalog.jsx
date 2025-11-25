import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// NOTA: Se removió AnimatePresence para evitar conflictos DOM
import { Filter, Search, X, TrendingUp, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import { categories } from '../data/products';
import ProductService from '../services/ProductService';
import useStore from '../store/useStore';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedCategory } = useStore();

  // Load products from ProductService (Supabase or fallback to static)
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await ProductService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  if (isLoading) {
    return (
      <section id="catalogo" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando productos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Search Bar - Compact */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-esbelta-sand w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, talla, color..."
              className="w-full pl-14 pr-5 py-3 rounded-xl border-2 border-esbelta-sand focus:border-esbelta-terracotta focus:outline-none transition-all shadow-md bg-white text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-esbelta-chocolate-light hover:text-esbelta-terracotta transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Sort - Compact */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
              showFilters
                ? 'bg-esbelta-terracotta text-white shadow-lg'
                : 'bg-white text-esbelta-chocolate hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtros {showFilters && '✓'}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-esbelta-chocolate font-semibold">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3 bg-white rounded-xl border-2 border-esbelta-sand focus:border-esbelta-terracotta focus:outline-none font-medium text-esbelta-chocolate shadow-md"
            >
              <option value="popular">⭐ Más Popular</option>
              <option value="discount">💰 Mayor Descuento</option>
              <option value="price-low">💵 Menor Precio</option>
              <option value="price-high">💎 Mayor Precio</option>
              <option value="rating">🏆 Mejor Calificación</option>
            </select>
          </div>
        </div>

        {/* Filter Panel - Sin AnimatePresence */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden mb-10"
          >
            <div className="bg-white rounded-2xl p-8 border-2 border-esbelta-sand shadow-xl">
              <h3 className="font-bold text-xl text-esbelta-chocolate mb-6 flex items-center gap-2">
                <Filter className="w-6 h-6 text-esbelta-terracotta" />
                Rango de Precio
              </h3>
              <div className="flex items-center gap-6">
                <input
                  type="range"
                  min="0"
                  max="300000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 h-3 bg-esbelta-sand rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-esbelta-terracotta font-bold text-2xl min-w-[140px]">
                  ${priceRange[1].toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count - More prominent */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <p className="text-esbelta-chocolate font-bold text-xl">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Producto' : 'Productos'}
            <span className="text-esbelta-terracotta ml-2">✨</span>
          </p>

          {filteredProducts.length > 0 && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-full border-2 border-green-200">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Alta demanda</span>
            </div>
          )}
        </div>

        {/* Products Grid - Sin AnimatePresence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 mb-4">
              No encontramos productos que coincidan con tu búsqueda
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 300000]);
              }}
              className="text-gold-600 hover:text-gold-700 font-medium"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}

        {/* Load More */}
        {filteredProducts.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button className="btn-gold">
              Ver Más Productos
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;