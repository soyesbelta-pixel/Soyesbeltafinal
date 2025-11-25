import React, { useState, useMemo, useEffect } from 'react';
import { generateTryOnImage } from './services/geminiService';
import VirtualTryOnService from '../../services/VirtualTryOnService';
import VirtualTryOnUserService from '../../services/VirtualTryOnUserService';
import Header from './Header';
import InfoBanner from './InfoBanner';
import ImageUploader from './ImageUploader';
import ProductSelector from './ProductSelector';
import GeneratedImage from './GeneratedImage';
import Loader from './Loader';
import ContactCaptureModal from './ContactCaptureModal';
import LimitReachedModal from './LimitReachedModal';
import SimpleTriesCounter from './SimpleTriesCounter';

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <path d="M15 4V2" />
        <path d="M15 10V8" />
        <path d="M12.5 7H17.5" />
        <path d="M20 9.5V4.5" />
        <path d="m11.5 2-2 4-4-2" />
        <path d="M3 12.5 5 15l-3 4" />
        <path d="M8.5 22l2.5-4 4.5 2.5" />
        <path d="M18 12.5 16 15l3 4" />
        <path d="M12 22v-4.5" />
    </svg>
);

const VirtualTryOnApp = ({ onCloseVirtualTryOn }) => {
    const [userImageFile, setUserImageFile] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Lead Capture System State (simplified with limit)
    const [showContactModal, setShowContactModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [remainingTries, setRemainingTries] = useState(5);

    // Check if user is registered on component mount
    useEffect(() => {
        const isRegistered = VirtualTryOnUserService.isRegistered();
        if (!isRegistered) {
            setShowContactModal(true);
        } else {
            // Update remaining tries
            setRemainingTries(VirtualTryOnUserService.getRemainingTries());
        }
    }, []);

    // Load products from Supabase
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoadingProducts(true);
                const data = await VirtualTryOnService.getProducts(false); // Only active products

                // Transform Supabase data to match expected format
                const transformedProducts = data.map(product => ({
                    id: product.id,
                    name: product.name,
                    displayName: product.display_name,
                    image: product.display_image_url,
                    localImagePath: product.reference_image_url,
                    prompt: product.ai_prompt
                }));

                setProducts(transformedProducts);
            } catch (err) {
                console.error('Error loading products:', err);
                setError('No se pudieron cargar los productos. Por favor, recarga la página.');
            } finally {
                setLoadingProducts(false);
            }
        };

        loadProducts();
    }, []);

    const isButtonDisabled = useMemo(() => {
        return !userImageFile || !selectedProduct || isLoading;
    }, [userImageFile, selectedProduct, isLoading]);

    const handleContactSuccess = () => {
        setShowContactModal(false);
        setRemainingTries(5); // Reset tries after registration
    };

    const handleGenerate = async () => {
        // Check if user has tries remaining
        if (!VirtualTryOnUserService.canGenerate()) {
            setShowLimitModal(true);
            return;
        }

        if (!userImageFile || !selectedProduct) {
            setError("Por favor sube una imagen y selecciona un producto primero.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedResult(null);

        try {
            const result = await generateTryOnImage(userImageFile, selectedProduct);
            setGeneratedResult(result);

            // Use one try and update counter
            const newRemainingTries = VirtualTryOnUserService.useTry();
            setRemainingTries(newRemainingTries);

            // Show limit modal if this was the last try
            if (newRemainingTries === 0) {
                setTimeout(() => setShowLimitModal(true), 2000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-esbelta-chocolate">
            {isLoading && <Loader message="Generando tu nuevo look..." />}
            {loadingProducts && <Loader message="Cargando productos..." />}

            {/* Contact Capture Modal */}
            <ContactCaptureModal
                isOpen={showContactModal}
                onClose={() => {}} // No hace nada - el formulario solo se cierra después de registrarse
                onSuccess={handleContactSuccess}
                onCloseVirtualTryOn={onCloseVirtualTryOn} // Cierra TODO el probador virtual
            />

            {/* Limit Reached Modal */}
            <LimitReachedModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
            />

            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Header />
                </div>
            </div>
            {/* Contenido con fondo blanco */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tries Counter */}
                {remainingTries > 0 && VirtualTryOnUserService.isRegistered() && (
                    <div className="mb-6">
                        <SimpleTriesCounter remainingTries={remainingTries} />
                    </div>
                )}

                <InfoBanner />
                <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="flex flex-col gap-8">
                        <ImageUploader onImageUpload={setUserImageFile} />
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-esbelta-terracotta">2. Selecciona Producto</h2>
                            {loadingProducts ? (
                                <div className="text-center py-8 text-gray-500">Cargando productos...</div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No hay productos disponibles</div>
                            ) : (
                                <ProductSelector
                                    products={products}
                                    selectedProduct={selectedProduct}
                                    onProductSelect={setSelectedProduct}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="lg:sticky lg:top-8">
                            <GeneratedImage result={generatedResult} />
                            <button
                                onClick={handleGenerate}
                                disabled={isButtonDisabled}
                                className="mt-6 w-full flex items-center justify-center px-6 py-4 bg-esbelta-terracotta text-esbelta-cream font-bold text-lg rounded-lg shadow-lg hover:bg-esbelta-terracotta-light disabled:bg-esbelta-sand disabled:text-esbelta-chocolate disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                            >
                                <MagicWandIcon />
                                {isLoading ? 'Generando...' : 'Pruébatelo'}
                            </button>
                             {error && (
                                <div className="mt-4 text-center p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VirtualTryOnApp;