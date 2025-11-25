import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import ProductEditor from './ProductEditor';
import ProductService from '../../services/ProductService';
import { products as staticProducts } from '../../data/products';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSupabaseMode, setIsSupabaseMode] = useState(ProductService.isSupabaseEnabled());

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'lenceria', name: 'Lencería' },
    { id: 'realce', name: 'Realce' },
    { id: 'fajas', name: 'Fajas' },
    { id: 'moldeadoras', name: 'Moldeadoras' }
  ];

  const loadProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      // Clear cache before loading to get fresh data
      ProductService.clearCache();
      const data = await ProductService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('Error al cargar productos', 'error');
      // Fallback to static products
      setProducts(staticProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowEditor(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditor(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!isSupabaseMode) {
      showNotification('La eliminación requiere modo Supabase activado', 'error');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await ProductService.deleteProduct(productId);
      showNotification('Producto eliminado correctamente', 'success');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Error al eliminar producto', 'error');
    }
  };

  const handleSaveProduct = async (productData, images) => {
    try {
      if (editingProduct) {
        // Update existing product
        await ProductService.updateProduct(editingProduct.id, productData, images);
        showNotification('Producto actualizado correctamente', 'success');
      } else {
        // Create new product
        await ProductService.createProduct(productData, images);
        showNotification('Producto creado correctamente', 'success');
      }

      setShowEditor(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification(error.message || 'Error al guardar producto', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const toggleSupabaseMode = () => {
    const newMode = !isSupabaseMode;
    ProductService.setSupabaseMode(newMode);
    setIsSupabaseMode(newMode);
    showNotification(
      `Modo ${newMode ? 'Supabase' : 'Estático'} activado`,
      'info'
    );
    loadProducts();
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Sin Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock < 10) return { text: 'Stock Bajo', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'En Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <div className="fixed top-4 right-4 z-50">
            <div
              className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
                notification.type === 'success'
                  ? 'bg-green-500 text-white'
                  : notification.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5" />}
              {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-esbelta-chocolate">
            Gestión de Productos
          </h2>
          <p className="text-sm text-esbelta-chocolate/70 mt-1">
            Modo: {isSupabaseMode ? '🟢 Supabase' : '🔴 Estático'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={toggleSupabaseMode}
            className="px-4 py-2 bg-white border-2 border-esbelta-sand text-esbelta-chocolate font-semibold rounded-lg hover:bg-white transition-all"
          >
            {isSupabaseMode ? 'Modo Estático' : 'Modo Supabase'}
          </button>

          <button
            onClick={handleCreateProduct}
            disabled={!isSupabaseMode}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Producto</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-esbelta-terracotta focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-esbelta-terracotta focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock || 0);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.hot && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      PREMIUM
                    </div>
                  )}
                  {product.new && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NUEVO
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-esbelta-chocolate mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-esbelta-terracotta">
                        ${product.price?.toLocaleString('es-CO')}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.originalPrice?.toLocaleString('es-CO')}
                        </p>
                      )}
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.bg} ${stockStatus.color}`}
                    >
                      {stockStatus.text}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>{product.colors?.length || 0} colores</span>
                    <span>•</span>
                    <span>{product.sizes?.length || 0} tallas</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      disabled={!isSupabaseMode}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-esbelta-chocolate text-white rounded-lg hover:bg-esbelta-chocolate/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={!isSupabaseMode}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No se encontraron productos</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-esbelta-terracotta hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {/* Product Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <ProductEditor
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => {
              setShowEditor(false);
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;
