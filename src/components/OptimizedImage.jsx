/**
 * OptimizedImage - Componente que carga WebP con fallback automático a PNG/JPG
 *
 * Beneficios:
 * - Carga WebP (30-50% más ligero) cuando el navegador lo soporta
 * - Fallback automático a PNG/JPG en navegadores antiguos
 * - Lazy loading por defecto
 * - Mismo API que <img> nativo
 *
 * Uso:
 * <OptimizedImage
 *   src="/short-magic-negro-1.png"
 *   alt="Short Magic Negro"
 *   className="w-full h-full object-cover"
 * />
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  // Generar ruta WebP (agregar /webp/ folder y reemplazar extensión)
  const webpSrc = src.replace(/^\//, '/webp/').replace(/\.(png|jpg|jpeg)$/i, '.webp');

  // El navegador maneja automáticamente el fallback de <picture>
  // Si WebP no existe o no es soportado, usa el <img> del fallback
  return (
    <picture>
      {/* Intentar cargar WebP primero */}
      <source
        srcSet={webpSrc}
        type="image/webp"
      />

      {/* Fallback automático a PNG/JPG original */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
