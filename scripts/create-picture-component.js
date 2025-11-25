// Script para ayudar a crear componentes <picture> con fallback WebP

const pictureSyntax = `
// Componente OptimizedImage para usar en lugar de <img>

import { useState } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [imgError, setImgError] = useState(false);

  // Generar ruta WebP (reemplazar extensión)
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  return (
    <picture>
      {/* Intentar cargar WebP primero */}
      {!imgError && (
        <source srcSet={webpSrc} type="image/webp" />
      )}

      {/* Fallback a PNG/JPG original */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        onError={() => setImgError(true)}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;

// USO:
// import OptimizedImage from './components/OptimizedImage';
//
// <OptimizedImage
//   src="/short-magic-negro-1.png"
//   alt="Short Magic Negro"
//   className="w-full h-full object-cover"
//   loading="lazy"
// />
`;

console.log(pictureSyntax);
