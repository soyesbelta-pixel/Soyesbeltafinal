import { useState } from 'react';
import { Share2 } from 'lucide-react';

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-esbelta-sand">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

const GeneratedImage = ({ result }) => {
    const [isSharing, setIsSharing] = useState(false);

    const base64ToBlob = (base64) => {
        const parts = base64.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    };

    const downloadImage = async () => {
        try {
            const link = document.createElement('a');
            link.href = result.image;
            link.download = `esbelta-probador-virtual-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al descargar imagen:', error);
            alert('No se pudo descargar la imagen. Por favor intenta de nuevo.');
        }
    };

    const shareOnWhatsApp = async () => {
        try {
            setIsSharing(true);
            const text = '¡Mira cómo me queda esta faja Esbelta! 💖✨ Prueba virtual realizada con IA. Visita: https://esbelta.com';

            // En móvil, intentar compartir la imagen directamente
            if (navigator.share && navigator.canShare) {
                const blob = base64ToBlob(result.image);
                const file = new File([blob], 'esbelta-tryon.png', { type: 'image/png' });

                const shareData = {
                    files: [file],
                    text: text,
                    title: 'Mi Prueba Virtual Esbelta'
                };

                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    return;
                }
            }

            // Fallback: abrir WhatsApp con texto (el usuario puede compartir la imagen manualmente)
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error('Error al compartir en WhatsApp:', error);
        } finally {
            setIsSharing(false);
        }
    };

    const shareOnFacebook = async () => {
        try {
            setIsSharing(true);

            // Facebook no permite compartir imágenes directamente desde Web Share API
            // Abrimos el diálogo de compartir de Facebook
            const shareUrl = window.location.origin;
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent('¡Mira mi prueba virtual con Esbelta! 💖✨')}`;
            window.open(fbUrl, '_blank', 'width=600,height=400');

            // Sugerimos al usuario descargar la imagen para compartirla
            alert('💡 Tip: Descarga la imagen y súbela manualmente a Facebook para mejores resultados.');
        } catch (error) {
            console.error('Error al compartir en Facebook:', error);
        } finally {
            setIsSharing(false);
        }
    };

    const shareOnInstagram = async () => {
        try {
            setIsSharing(true);

            // Instagram no tiene API de compartir web
            // Descargamos la imagen y damos instrucciones al usuario
            await downloadImage();

            alert('📸 Instagram: La imagen se ha descargado. Abre Instagram en tu móvil y súbela como una nueva publicación o historia.\n\n💡 Tip: Usa hashtags como #Esbelta #FajasColombianas #PruebaVirtual');
        } catch (error) {
            console.error('Error al compartir en Instagram:', error);
        } finally {
            setIsSharing(false);
        }
    };

    const shareNative = async () => {
        try {
            setIsSharing(true);

            if (navigator.share && navigator.canShare) {
                const blob = base64ToBlob(result.image);
                const file = new File([blob], 'esbelta-tryon.png', { type: 'image/png' });

                const shareData = {
                    files: [file],
                    text: '¡Mira mi prueba virtual con Esbelta! 💖✨',
                    title: 'Mi Prueba Virtual Esbelta'
                };

                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                } else {
                    // Si no puede compartir archivos, compartir solo texto
                    await navigator.share({
                        text: shareData.text,
                        title: shareData.title
                    });
                }
            } else {
                // Fallback: descargar imagen
                await downloadImage();
                alert('La imagen se ha descargado. Puedes compartirla desde tu galería.');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error al compartir:', error);
            }
        } finally {
            setIsSharing(false);
        }
    };

    if (!result || !result.image) {
        return (
            <div className="w-full aspect-square bg-esbelta-sand border-2 border-dashed border-esbelta-sand-dark rounded-lg flex flex-col items-center justify-center text-esbelta-chocolate">
                <SparkleIcon />
                <p className="mt-4 font-semibold">Tu imagen generada aparecerá aquí</p>
                <p className="text-sm">Sube una foto y selecciona un producto para comenzar</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-esbelta-terracotta">Tu Probador Virtual</h2>
            <div className="w-full aspect-[3/4] bg-esbelta-sand rounded-lg overflow-hidden">
                <img src={result.image} alt="Prueba virtual generada" className="w-full h-full object-contain" />
            </div>

            {/* Success Message */}
            <div className="mt-4 text-center bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta p-4 rounded-lg shadow-lg">
                <p className="text-lg font-semibold text-white mb-1">
                    ¡Luce espectacular! 🔥
                </p>
                <p className="text-sm text-white">
                    Consigue esta transformación hoy mismo
                </p>
            </div>

            {/* Share Buttons */}
            <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold text-esbelta-chocolate text-center mb-3">
                    Comparte tu resultado
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    {/* WhatsApp */}
                    <button
                        onClick={shareOnWhatsApp}
                        disabled={isSharing}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <WhatsAppIcon />
                        WhatsApp
                    </button>

                    {/* Facebook */}
                    <button
                        onClick={shareOnFacebook}
                        disabled={isSharing}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <FacebookIcon />
                        Facebook
                    </button>

                    {/* Instagram */}
                    <button
                        onClick={shareOnInstagram}
                        disabled={isSharing}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#405DE6] via-[#E1306C] to-[#FD1D1D] hover:opacity-90 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <InstagramIcon />
                        Instagram
                    </button>

                    {/* Download */}
                    <button
                        onClick={downloadImage}
                        disabled={isSharing}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-esbelta-chocolate hover:bg-esbelta-chocolate-dark text-esbelta-cream font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <DownloadIcon />
                        Descargar
                    </button>
                </div>

                {/* Native Share (si está disponible) */}
                {navigator.share && (
                    <button
                        onClick={shareNative}
                        disabled={isSharing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-esbelta-chocolate hover:bg-esbelta-chocolate-dark text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <Share2 size={20} />
                        Compartir en más redes
                    </button>
                )}
            </div>
        </div>
    );
};

export default GeneratedImage;