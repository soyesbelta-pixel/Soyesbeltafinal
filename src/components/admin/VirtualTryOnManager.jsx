import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Sparkles } from 'lucide-react';
import VirtualTryOnService from '../../services/VirtualTryOnService';
import VirtualTryOnEditor from './VirtualTryOnEditor';
import useStore from '../../store/useStore';

const VirtualTryOnManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const { addNotification } = useStore();

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      VirtualTryOnService.clearCache();
      const data = await VirtualTryOnService.getProducts(showInactive);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading virtual try-on products:', error);
      addNotification({
        type: 'error',
        message: 'Error al cargar productos del probador virtual'
      });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [showInactive, addNotification]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowEditor(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditor(true);
  };

  const handleDelete = async (product) => {
    if (!confirm(`¿Eliminar "${product.display_name}" del probador virtual?`)) {
      return;
    }

    try {
      await VirtualTryOnService.deleteProduct(product.id);
      addNotification({
        type: 'success',
        message: 'Producto eliminado del probador virtual'
      });
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      addNotification({
        type: 'error',
        message: 'Error al eliminar producto'
      });
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await VirtualTryOnService.updateProduct(product.id, {
        is_active: !product.is_active
      });
      addNotification({
        type: 'success',
        message: `Producto ${product.is_active ? 'desactivado' : 'activado'}`
      });
      loadProducts();
    } catch (error) {
      console.error('Error toggling product:', error);
      addNotification({
        type: 'error',
        message: 'Error al actualizar producto'
      });
    }
  };

  const handleSaveProduct = async (productData, images) => {
    try {
      if (editingProduct) {
        await VirtualTryOnService.updateProduct(editingProduct.id, productData);
        addNotification({
          type: 'success',
          message: 'Producto actualizado exitosamente'
        });
      } else {
        await VirtualTryOnService.createProduct(productData);
        addNotification({
          type: 'success',
          message: 'Producto agregado al probador virtual'
        });
      }
      setShowEditor(false);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Error al guardar producto'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-esbelta-chocolate flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-esbelta-terracotta" />
            Probador Virtual
          </h2>
          <p className="text-gray-600 mt-1">
            Gestiona los productos disponibles para el probador virtual con IA
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-5 h-5 text-esbelta-terracotta focus:ring-esbelta-terracotta rounded"
          />
          <span className="text-sm text-gray-700">Mostrar inactivos</span>
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-esbelta-terracotta/10 to-esbelta-terracotta/5 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Productos</p>
          <p className="text-2xl font-bold text-esbelta-chocolate">{products.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Activos</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.is_active).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-500/10 to-gray-500/5 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Inactivos</p>
          <p className="text-2xl font-bold text-gray-600">
            {products.filter(p => !p.is_active).length}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery ? 'No se encontraron productos' : 'No hay productos en el probador virtual'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreate}
              className="mt-4 text-esbelta-terracotta hover:underline"
            >
              Agregar primer producto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${
                !product.is_active ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={product.display_image_url}
                  alt={product.display_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`p-2 rounded-full transition-colors ${
                      product.is_active
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                    title={product.is_active ? 'Desactivar' : 'Activar'}
                  >
                    {product.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-esbelta-chocolate mb-1">
                  {product.display_name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.name}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Orden: {product.display_order}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    product.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-esbelta-terracotta text-white rounded-lg hover:bg-esbelta-terracotta-dark transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <VirtualTryOnEditor
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default VirtualTryOnManager;
