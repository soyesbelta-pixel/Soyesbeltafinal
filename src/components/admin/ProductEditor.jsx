import { useState, useEffect } from 'react';
import { X, Save, Plus, Minus, Eye } from 'lucide-react';
import ImageUploader from './ImageUploader';
import VideoUploader from './VideoUploader';
import ImageService from '../../services/ImageService';

const ProductEditor = ({ product, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('basic'); // basic, images, variants, preview
  const [formData, setFormData] = useState({
    name: '',
    category: 'lenceria',
    description: '',
    price: 0,
    stock: 0,
    rating: 4.8,
    reviews: 0,
    is_hot: false,
    is_new: false,
    video_url: '',
    features: [],
    sizes: [],
    colors: []
  });
  const [images, setImages] = useState({});
  const [video, setVideo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'lenceria', name: 'Lencería' },
    { id: 'realce', name: 'Realce' },
    { id: 'fajas', name: 'Fajas' },
    { id: 'moldeadoras', name: 'Moldeadoras' }
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'lenceria',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        rating: product.rating || 4.8,
        reviews: product.reviews || 0,
        is_hot: product.hot || false,
        is_new: product.new || false,
        video_url: product.videoUrl || '',
        features: product.features || [],
        sizes: product.sizes || [],
        colors: product.colors || []
      });

      // Load existing images
      if (product.imagesByColor) {
        setImages(product.imagesByColor);
      }
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f))
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAddColor = () => {
    const colorName = prompt('Nombre del color (ej: Beige, Negro, Blanco):');
    if (colorName && colorName.trim()) {
      const normalized = colorName.trim();
      if (!formData.colors.includes(normalized)) {
        setFormData(prev => ({
          ...prev,
          colors: [...prev.colors, normalized]
        }));
        setImages(prev => ({ ...prev, [normalized.toLowerCase()]: [] }));
      }
    }
  };

  const handleRemoveColor = (color) => {
    if (confirm(`¿Eliminar color "${color}" y sus imágenes?`)) {
      setFormData(prev => ({
        ...prev,
        colors: prev.colors.filter(c => c !== color)
      }));
      setImages(prev => {
        const newImages = { ...prev };
        delete newImages[color.toLowerCase()];
        return newImages;
      });
    }
  };

  const handleImageChange = (colorName, newImages) => {
    setImages(prev => ({
      ...prev,
      [colorName.toLowerCase()]: newImages
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.features.length === 0) {
      newErrors.features = 'Agrega al menos una característica';
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = 'Selecciona al menos una talla';
    }

    if (formData.colors.length === 0) {
      newErrors.colors = 'Agrega al menos un color';
    }

    // Validate images for each color
    for (const color of formData.colors) {
      const colorImages = images[color.toLowerCase()] || [];
      if (colorImages.length === 0) {
        newErrors.images = `Falta agregar imágenes para el color "${color}"`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert('Por favor completa todos los campos requeridos');
      setActiveTab('basic');
      return;
    }

    setIsSaving(true);

    try {
      // Upload video to Supabase if it's a file
      let videoUrl = formData.video_url;

      if (video?.file) {
        console.log('📹 Uploading video file...');
        const result = await ImageService.uploadVideo(video.file, formData.name);
        videoUrl = result.url;
        console.log('✅ Video uploaded:', videoUrl);
      } else if (video?.url) {
        // External URL
        videoUrl = video.url;
      }

      // Upload images to Supabase if they are files
      const uploadedImages = {};

      for (const [colorName, colorImages] of Object.entries(images)) {
        const imageUrls = [];

        for (const img of colorImages) {
          if (img.file) {
            // New file to upload
            const result = await ImageService.uploadImage(
              img.file,
              `products/${formData.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}/${colorName}`,
              true
            );
            imageUrls.push(result.url);
          } else if (typeof img === 'string') {
            // Existing URL
            imageUrls.push(img);
          } else if (img.preview) {
            // Local preview, upload the file
            const result = await ImageService.uploadImage(
              img.file,
              `products/${formData.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}/${colorName}`,
              true
            );
            imageUrls.push(result.url);
          }
        }

        uploadedImages[colorName] = imageUrls;
      }

      // Set main image
      const firstColor = formData.colors[0].toLowerCase();
      const mainImage = uploadedImages[firstColor]?.[0] || '';

      const productData = {
        ...formData,
        main_image: mainImage,
        video_url: videoUrl
      };

      await onSave(productData, uploadedImages);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', name: 'Información Básica' },
    { id: 'images', name: 'Imágenes' },
    { id: 'variants', name: 'Variantes' },
    { id: 'preview', name: 'Vista Previa' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full h-full sm:max-w-5xl sm:h-auto sm:max-h-[95vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-esbelta-chocolate">
            {product ? 'Editar Producto' : 'Crear Producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 sm:px-6 pt-3 sm:pt-4 border-b overflow-x-auto flex-shrink-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-esbelta-terracotta border-esbelta-terracotta'
                  : 'text-gray-600 border-transparent hover:text-esbelta-chocolate'
              }`}
            >
              {tab.name}
              {errors[tab.id === 'basic' ? 'name' : tab.id] && (
                <span className="ml-2 text-red-500">•</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ minHeight: 0 }}>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-esbelta-terracotta'
                  }`}
                  placeholder="Ej: Brasier Realce Corrector de Postura"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-esbelta-terracotta'
                  }`}
                  placeholder="Describe las características principales del producto..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (COP) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.price
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-esbelta-terracotta'
                    }`}
                    placeholder="69000"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Precio con descuento del 10% aplicado
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Características *
                  </label>
                  <button
                    onClick={handleAddFeature}
                    className="flex items-center gap-1 text-sm text-esbelta-terracotta hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta"
                        placeholder="Ej: Control de abdomen completo"
                      />
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_hot}
                    onChange={(e) => handleInputChange('is_hot', e.target.checked)}
                    className="w-5 h-5 text-esbelta-terracotta focus:ring-esbelta-terracotta"
                  />
                  <span className="text-gray-700">Premium</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => handleInputChange('is_new', e.target.checked)}
                    className="w-5 h-5 text-esbelta-terracotta focus:ring-esbelta-terracotta"
                  />
                  <span className="text-gray-700">Nuevo</span>
                </label>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video del Producto (opcional)
                </label>
                <VideoUploader
                  existingVideo={formData.video_url}
                  onChange={(videoData) => setVideo(videoData)}
                />
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6 pb-4">
              {formData.colors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    Primero agrega colores en la pestaña "Variantes"
                  </p>
                  <button
                    onClick={() => setActiveTab('variants')}
                    className="text-esbelta-terracotta hover:underline"
                  >
                    Ir a Variantes
                  </button>
                </div>
              ) : (
                formData.colors.map((color, index) => (
                  <div key={color} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-base font-bold text-esbelta-chocolate mb-3 flex items-center gap-2">
                      <span className="bg-esbelta-terracotta text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      Imágenes para: {color}
                    </h3>
                    <ImageUploader
                      colorName={color}
                      existingImages={images[color.toLowerCase()] || []}
                      onChange={handleImageChange}
                    />
                  </div>
                ))
              )}

              {errors.images && (
                <p className="text-red-500 text-sm bg-red-50 p-4 rounded-lg">{errors.images}</p>
              )}
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="space-y-8">
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tallas Disponibles *
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-esbelta-terracotta text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.sizes && <p className="text-red-500 text-sm mt-2">{errors.sizes}</p>}
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Colores Disponibles *
                  </label>
                  <button
                    onClick={handleAddColor}
                    className="flex items-center gap-1 text-sm text-esbelta-terracotta hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Color
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.colors.map(color => (
                    <div
                      key={color}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-700">{color}</span>
                      <button
                        onClick={() => handleRemoveColor(color)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {formData.colors.length === 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    No hay colores agregados. Haz clic en "Agregar Color" para comenzar.
                  </p>
                )}

                {errors.colors && <p className="text-red-500 text-sm mt-2">{errors.colors}</p>}
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-esbelta-chocolate mb-4">
                  {formData.name || 'Nombre del Producto'}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div>
                    {formData.colors.length > 0 && images[formData.colors[0].toLowerCase()]?.[0] ? (
                      <img
                        src={
                          images[formData.colors[0].toLowerCase()][0].preview ||
                          images[formData.colors[0].toLowerCase()][0]
                        }
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Eye className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-esbelta-terracotta">
                        ${formData.price.toLocaleString('es-CO')}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        ${Math.round((formData.price / 0.9 / 100) * 100).toLocaleString('es-CO')}
                      </p>
                    </div>

                    <p className="text-gray-700">{formData.description}</p>

                    <div>
                      <p className="font-semibold mb-2">Características:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {formData.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tallas:</p>
                        <p className="font-medium">{formData.sizes.join(', ') || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Colores:</p>
                        <p className="font-medium">{formData.colors.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Guardando...</span>
                <span className="sm:hidden">Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Guardar Producto</span>
                <span className="sm:hidden">Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
