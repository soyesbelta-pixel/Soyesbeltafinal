import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import ImageService from '../../services/ImageService';

const ImageUploader = ({ colorName, existingImages = [], onChange }) => {
  const [images, setImages] = useState(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    try {
      setUploadError(null);
      setIsUploading(true);

      // Validate files
      const fileArray = Array.from(files);
      ImageService.validateImageFiles(fileArray);

      // Preview images locally (before upload to Supabase)
      const previews = await Promise.all(
        fileArray.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({
              file,
              preview: e.target.result,
              name: file.name
            });
            reader.readAsDataURL(file);
          });
        })
      );

      const newImages = [...images, ...previews];
      setImages(newImages);
      onChange(colorName, newImages);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(colorName, newImages);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setImages(newImages);
    onChange(colorName, newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
          isDragging
            ? 'border-esbelta-terracotta bg-esbelta-terracotta/10'
            : 'border-gray-300 hover:border-esbelta-terracotta hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="text-center">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Arrastra imágenes aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP (máx. 5MB por imagen)
          </p>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-esbelta-terracotta border-t-transparent rounded-full mx-auto mb-2 animate-spin" />
              <p className="text-sm text-gray-700 font-medium">Procesando...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-700">
              {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
            </p>
            <p className="text-xs text-gray-500">
              Arrastra para reordenar
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <AnimatePresence>
              {images.map((img, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', index.toString());
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/html'));
                    handleReorder(fromIndex, index);
                  }}
                  className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move"
                >
                  <img
                    src={img.preview || img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Number Badge */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Primary Image Indicator */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 right-2 bg-esbelta-terracotta text-white text-xs font-bold px-2 py-1 rounded text-center">
                      Imagen Principal
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {images.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          No hay imágenes para {colorName}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
