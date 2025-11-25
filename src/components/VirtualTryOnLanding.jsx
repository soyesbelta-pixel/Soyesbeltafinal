import { useState, useCallback, useEffect } from 'react';
import { generateTryOnImages } from '../services/landing/geminiImageService';
import VirtualTryOnLeadsService from '../services/VirtualTryOnLeadsService';
import { UploadCloud, X, Loader2, Camera, Sparkles, Star, CheckCircle, AlertCircle } from 'lucide-react';

// Productos de Esbelta
const PRODUCTS = [
  {
    id: 1,
    name: 'Short Magic Beige',
    description: 'Short levanta glúteos invisible con diseño especial que realza tu figura naturalmente',
    imageUrl: '/landing-short-invisible/images/productos/short-beige-front.jpg',
    referenceImageUrl: '/landing-short-invisible/images/productos/short-beige-reference.jpg',
    color: 'beige'
  },
  {
    id: 2,
    name: 'Short Magic Cocoa',
    description: 'Short levanta glúteos invisible en tono cocoa, ideal para combinar con cualquier look',
    imageUrl: '/landing-short-invisible/images/productos/short-cocoa-reference.jpg',
    referenceImageUrl: '/landing-short-invisible/images/productos/short-cocoa-reference.jpg',
    color: 'cocoa'
  },
  {
    id: 3,
    name: 'Short Magic Negro',
    description: 'Short levanta glúteos invisible en negro, perfecto para uso diario bajo cualquier ropa',
    imageUrl: '/landing-short-invisible/images/productos/short-negro-front.jpg',
    referenceImageUrl: '/landing-short-invisible/images/productos/short-negro-reference.jpg',
    color: 'negro'
  }
];

export const VirtualTryOn = ({ onClose, apiKey }) => {
  // Estados principales
  const [step, setStep] = useState('contact'); // contact, upload, select, generating, result
  const [userImage, setUserImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [generatedImages, setGeneratedImages] = useState({ front: null, side: null });
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Estados de contacto
  const [contactData, setContactData] = useState({
    name: '',
    whatsapp: ''
  });
  const [contactErrors, setContactErrors] = useState({});

  // Estados de generación
  const [generationCount, setGenerationCount] = useState(0);
  const maxGenerations = 2;

  // Cargar datos desde localStorage al montar
  useEffect(() => {
    const savedContact = localStorage.getItem('esbelta_contact');
    const savedCount = localStorage.getItem('esbelta_generation_count');

    if (savedContact) {
      try {
        const contact = JSON.parse(savedContact);
        setContactData(contact);
        setStep('upload'); // Si ya tiene contacto guardado, ir directo a upload
      } catch (e) {
        console.error('Error parsing saved contact:', e);
      }
    }

    if (savedCount) {
      setGenerationCount(parseInt(savedCount, 10));
    }
  }, []);

  // Validación de formulario de contacto
  const validateContact = () => {
    const errors = {};

    // Validar nombre
    if (!contactData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (contactData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar WhatsApp (formato colombiano flexible)
    const whatsappClean = contactData.whatsapp.replace(/\s/g, '');
    const whatsappRegex = /^(\+?57)?3\d{9}$/;
    if (!contactData.whatsapp.trim()) {
      errors.whatsapp = 'El número de WhatsApp es requerido';
    } else if (!whatsappRegex.test(whatsappClean)) {
      errors.whatsapp = 'Número inválido. Formato: 3XX XXX XXXX';
    }

    return errors;
  };

  // Manejar envío de formulario de contacto
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const errors = validateContact();

    if (Object.keys(errors).length === 0) {
      // Guardar en localStorage
      localStorage.setItem('esbelta_contact', JSON.stringify(contactData));

      // Guardar en Supabase
      try {
        await VirtualTryOnLeadsService.saveLead(contactData.name, contactData.whatsapp);
        console.log('✅ Lead guardado en Supabase:', contactData);
      } catch (error) {
        console.error('⚠️ Error al guardar lead en Supabase:', error);
        // Continuar aunque falle el guardado en Supabase (no bloqueamos al usuario)
      }

      setContactErrors({});
      setStep('upload');
    } else {
      setContactErrors(errors);
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setUserImage({
        base64: base64String,
        mimeType: file.type,
        url: URL.createObjectURL(file),
      });
      setStep('select');
    };
    reader.onerror = () => {
      setError('Error al leer la imagen.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (files) => {
    setError(null);
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else {
        setError('Por favor selecciona una imagen válida (PNG, JPG, etc.).');
      }
    }
  };

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleProductSelect = async (product) => {
    // Verificar límite ANTES de generar
    if (generationCount >= maxGenerations) {
      setError(`Has alcanzado el límite de ${maxGenerations} pruebas gratuitas. ¡Compra ahora para obtener más!`);
      return;
    }

    if (!userImage) {
      setError('No se encontró imagen. Por favor sube una imagen primero.');
      setStep('upload');
      return;
    }

    setSelectedProduct(product);
    setStep('generating');
    setError(null);

    try {
      const { front, side } = await generateTryOnImages(apiKey, userImage.base64, userImage.mimeType, product);
      if (front && side) {
        setGeneratedImages({ front, side });

        // Incrementar contador y guardar en localStorage
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        localStorage.setItem('esbelta_generation_count', newCount.toString());

        setStep('result');
      } else {
        throw new Error('No se pudieron generar una o más imágenes.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido durante la generación.');
      setStep('select');
    }
  };

  const handleReset = () => {
    if (generationCount >= maxGenerations) {
      setError(`Has usado tus ${maxGenerations} pruebas gratuitas. Contáctanos para más.`);
      return;
    }

    setStep('upload');
    setUserImage(null);
    setSelectedProduct(null);
    setGeneratedImages({ front: null, side: null });
    setError(null);
    if (userImage?.url) {
      URL.revokeObjectURL(userImage.url);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'contact':
        return (
          <div className="bg-gradient-to-br from-esbelta-cream to-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-esbelta-coral to-esbelta-terracotta rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-esbelta-chocolate mb-2">
                ¡Prueba Virtual GRATIS!
              </h2>
              <p className="text-gray-600 text-sm">
                Déjanos tus datos para enviarte ofertas exclusivas
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-esbelta-coral transition-all ${
                    contactErrors.name ? 'border-red-400' : 'border-esbelta-sand'
                  }`}
                  placeholder="María García"
                />
                {contactErrors.name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {contactErrors.name}
                  </p>
                )}
              </div>

              {/* Campo WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={contactData.whatsapp}
                  onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-esbelta-coral transition-all ${
                    contactErrors.whatsapp ? 'border-red-400' : 'border-esbelta-sand'
                  }`}
                  placeholder="3XX XXX XXXX"
                />
                {contactErrors.whatsapp && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {contactErrors.whatsapp}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Formato colombiano: 3XX XXX XXXX</p>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-esbelta-coral to-esbelta-terracotta text-white font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Empezar Prueba Virtual
              </button>

              {/* Mensaje de seguridad */}
              <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Tus datos están seguros con nosotros
              </p>
            </form>
          </div>
        );

      case 'upload':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative">
            {/* Badge de contador */}
            <div className="absolute top-4 left-4 bg-esbelta-coral text-white px-4 py-2 rounded-full font-semibold shadow-lg text-sm">
              {generationCount}/{maxGenerations} pruebas usadas
            </div>

            <div className="mb-6 mt-8">
              <Camera className="w-16 h-16 mx-auto text-esbelta-chocolate mb-4" />
              <h2 className="text-2xl font-bold text-esbelta-chocolate mb-2">Sube tu Foto</h2>
              <p className="text-gray-600">Sube una foto de cuerpo completo para ver cómo te quedan nuestras fajas</p>
            </div>

            <label
              htmlFor="file-upload"
              className={`block border-4 border-dashed rounded-2xl p-12 cursor-pointer transition-all ${
                dragging ? 'border-esbelta-chocolate bg-esbelta-cream scale-105' : 'border-esbelta-sand hover:border-esbelta-chocolate'
              }`}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <UploadCloud className="w-16 h-16 mx-auto text-esbelta-chocolate mb-4" />
              <p className="text-lg font-semibold text-esbelta-chocolate mb-2">
                Arrastra tu foto aquí o haz click para seleccionar
              </p>
              <p className="text-sm text-gray-500">PNG, JPG hasta 10MB</p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </label>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8 relative">
            {/* Badge de contador */}
            <div className="absolute top-4 left-4 bg-esbelta-coral text-white px-4 py-2 rounded-full font-semibold shadow-lg text-sm z-10">
              {generationCount}/{maxGenerations} pruebas usadas
            </div>

            <h2 className="text-2xl font-bold text-esbelta-chocolate mb-6 text-center mt-8">
              Selecciona tu Faja Favorita
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Preview de la foto subida */}
              <div className="bg-esbelta-cream rounded-xl p-4">
                <p className="text-sm font-semibold text-esbelta-chocolate mb-2">Tu Foto</p>
                <img
                  src={userImage?.url}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Selección de productos */}
              <div className="space-y-4">
                {PRODUCTS.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="w-full p-4 rounded-xl border-2 border-esbelta-sand hover:border-esbelta-coral hover:shadow-xl transition-all group bg-white"
                  >
                    <div className="relative bg-gray-50 rounded-lg mb-3 overflow-hidden">
                      <div className="w-full h-48 flex items-center justify-center">
                        <img
                          src={product.displayImage || product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="absolute top-2 right-2 bg-esbelta-coral text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {product.color}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-esbelta-chocolate group-hover:text-esbelta-coral transition-colors mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex items-center justify-center gap-2 text-esbelta-coral font-semibold">
                      <Sparkles className="w-5 h-5" />
                      <span>Probar Ahora</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        );

      case 'generating':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto text-esbelta-chocolate mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-esbelta-chocolate mb-2">
              Generando tu Prueba Virtual
            </h2>
            <p className="text-gray-600 mb-4">
              Estamos creando imágenes realistas con {selectedProduct?.name}
            </p>
            <p className="text-sm text-gray-500">Esto puede tomar 30-60 segundos...</p>
          </div>
        );

      case 'result':
        const hasReachedLimit = generationCount >= maxGenerations;
        const whatsappMessage = encodeURIComponent(
          `¡Hola Esbelta! 👋\n\nAcabo de usar el probador virtual y me encantó el ${selectedProduct?.name}.\n\n📱 WhatsApp: ${contactData.whatsapp}\n👤 Nombre: ${contactData.name}\n\n¿Podemos hablar sobre mi compra?`
        );

        return (
          <div className="bg-gradient-to-br from-esbelta-cream to-white rounded-2xl shadow-2xl p-8">
            {/* Header con branding */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-heading font-bold text-esbelta-chocolate mb-2">
                ¡Te ves increíble! ✨
              </h2>
              <p className="text-lg text-gray-700">
                Así te queda nuestro <span className="font-bold text-esbelta-coral">{selectedProduct?.name}</span>
              </p>
            </div>

            {/* Imágenes generadas */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-esbelta-chocolate">Vista Frontal</p>
                  <span className="bg-esbelta-coral text-white text-xs px-3 py-1 rounded-full">Prueba Virtual</span>
                </div>
                <img
                  src={`data:image/png;base64,${generatedImages.front}`}
                  alt="Vista frontal"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-esbelta-chocolate">Vista Lateral</p>
                  <span className="bg-esbelta-coral text-white text-xs px-3 py-1 rounded-full">Prueba Virtual</span>
                </div>
                <img
                  src={`data:image/png;base64,${generatedImages.side}`}
                  alt="Vista lateral"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Beneficios breves */}
            <div className="bg-esbelta-cream rounded-xl p-6 mb-6">
              <h3 className="font-bold text-esbelta-chocolate mb-4 text-center">
                ¿Por qué nuestras clientas lo aman? 💖
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-esbelta-coral text-xl">✓</span>
                  <span>Levanta glúteos naturalmente</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-esbelta-coral text-xl">✓</span>
                  <span>100% invisible bajo la ropa</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-esbelta-coral text-xl">✓</span>
                  <span>Tejido transpirable y cómodo</span>
                </div>
              </div>
            </div>

            {/* Testimonios breves */}
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="font-bold text-esbelta-chocolate mb-4 text-center">
                Lo que dicen nuestras clientas 🌟
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <img src="/landing-short-invisible/images/cliente1.jpeg" alt="Cliente" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                  <p className="text-xs italic text-gray-600">"¡La mejor inversión! Me siento hermosa"</p>
                  <div className="flex justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-esbelta-coral text-esbelta-coral" />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <img src="/landing-short-invisible/images/cliente2.jpeg" alt="Cliente" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                  <p className="text-xs italic text-gray-600">"Totalmente invisible, súper cómodo"</p>
                  <div className="flex justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-esbelta-coral text-esbelta-coral" />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <img src="/landing-short-invisible/images/cliente3.jpeg" alt="Cliente" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                  <p className="text-xs italic text-gray-600">"Mi figura se ve increíble ahora"</p>
                  <div className="flex justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-esbelta-coral text-esbelta-coral" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              {/* CTA Principal de WhatsApp */}
              <a
                href={`https://wa.me/573147404023?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>¡QUIERO COMPRARLO! 💚</span>
                </div>
              </a>

              {/* Botones secundarios */}
              <div className="flex gap-4">
                {!hasReachedLimit ? (
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 px-6 rounded-full border-2 border-esbelta-chocolate text-esbelta-chocolate font-semibold hover:bg-esbelta-cream transition-colors"
                  >
                    Probar Otra Faja ({maxGenerations - generationCount} restante{maxGenerations - generationCount !== 1 ? 's' : ''})
                  </button>
                ) : (
                  <div className="flex-1 text-center py-3 px-6 bg-gray-100 rounded-full text-gray-500 font-semibold">
                    Sin pruebas restantes
                  </div>
                )}
              </div>
            </div>

            {/* Badge de intentos */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Has usado {generationCount} de {maxGenerations} pruebas virtuales gratuitas
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-50"
        title="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Contenido */}
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
};
