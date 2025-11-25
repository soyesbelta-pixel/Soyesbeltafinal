import { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import VirtualTryOnService from '../../services/VirtualTryOnService';

const VirtualTryOnEditor = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    display_image_url: '',
    reference_image_url: '',
    ai_prompt: '',
    is_active: true,
    display_order: 0,
    product_id: null
  });

  const [displayImage, setDisplayImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const displayInputRef = useRef(null);
  const referenceInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        display_name: product.display_name || '',
        display_image_url: product.display_image_url || '',
        reference_image_url: product.reference_image_url || '',
        ai_prompt: product.ai_prompt || '',
        is_active: product.is_active ?? true,
        display_order: product.display_order ?? 0,
        product_id: product.product_id || null
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleDisplayImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDisplayImage(file);
      setErrors(prev => ({ ...prev, display_image: null }));
    }
  };

  const handleReferenceImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      setErrors(prev => ({ ...prev, reference_image: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'El nombre a mostrar es requerido';
    }

    // AI Prompt validation removed - it's read-only and kept from original

    if (!product && !displayImage) {
      newErrors.display_image = 'La imagen de display es requerida';
    }

    if (!product && !referenceImage) {
      newErrors.reference_image = 'La imagen de referencia es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      let displayImageUrl = formData.display_image_url;
      let referenceImageUrl = formData.reference_image_url;

      // Upload display image if new file selected
      if (displayImage) {
        const result = await VirtualTryOnService.uploadImage(displayImage, 'display');
        displayImageUrl = result.url;
      }

      // Upload reference image if new file selected
      if (referenceImage) {
        const result = await VirtualTryOnService.uploadImage(referenceImage, 'reference');
        referenceImageUrl = result.url;
      }

      const productData = {
        ...formData,
        display_image_url: displayImageUrl,
        reference_image_url: referenceImageUrl
      };

      await onSave(productData, { displayImage, referenceImage });
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const defaultPrompt = `prenda de compresión profesional como se muestra exactamente en la imagen de referencia, diseño anatómico deportivo de alta calidad`;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full h-full sm:max-w-4xl sm:h-auto sm:max-h-[95vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-esbelta-chocolate">
            {product ? 'Editar Producto' : 'Agregar Producto al Probador Virtual'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ minHeight: 0 }}>
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Interno *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-esbelta-terracotta'
                }`}
                placeholder="Ej: Professional Shaping Waist Trainer"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre a Mostrar *
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.display_name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-esbelta-terracotta'
                }`}
                placeholder="Ej: Cintura Reloj de Arena"
              />
              {errors.display_name && (
                <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>
              )}
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Display Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de Display * <span className="text-xs text-gray-500">(Para el selector)</span>
                </label>
                <div className="space-y-3">
                  {(formData.display_image_url || displayImage) && (
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={
                          displayImage
                            ? URL.createObjectURL(displayImage)
                            : formData.display_image_url
                        }
                        alt="Display preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={displayInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDisplayImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => displayInputRef.current?.click()}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                      errors.display_image
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-esbelta-terracotta hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    {displayImage || formData.display_image_url ? 'Cambiar' : 'Subir'} Imagen
                  </button>
                  {errors.display_image && (
                    <p className="text-red-500 text-sm">{errors.display_image}</p>
                  )}
                </div>
              </div>

              {/* Reference Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de Referencia * <span className="text-xs text-gray-500">(Para la IA)</span>
                </label>
                <div className="space-y-3">
                  {(formData.reference_image_url || referenceImage) && (
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={
                          referenceImage
                            ? URL.createObjectURL(referenceImage)
                            : formData.reference_image_url
                        }
                        alt="Reference preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={referenceInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReferenceImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => referenceInputRef.current?.click()}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                      errors.reference_image
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-esbelta-terracotta hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    {referenceImage || formData.reference_image_url ? 'Cambiar' : 'Subir'} Imagen
                  </button>
                  {errors.reference_image && (
                    <p className="text-red-500 text-sm">{errors.reference_image}</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Prompt - READ ONLY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt para IA <span className="text-xs text-gray-500">(No editable - se mantiene el original)</span>
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {formData.ai_prompt || defaultPrompt}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                El prompt de IA es fijo y no puede modificarse para mantener la consistencia del sistema
              </p>
            </div>

            {/* Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden de Visualización
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-8">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-5 h-5 text-esbelta-terracotta focus:ring-esbelta-terracotta rounded"
                  />
                  <span className="text-gray-700">Producto Activo</span>
                </label>
              </div>
            </div>
          </div>
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
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Guardar Producto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnEditor;
