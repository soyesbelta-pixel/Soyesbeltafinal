
import React, { useState, useMemo } from 'react';
import type { Product, GeneratedResult } from './types';
import { generateTryOnImage } from './services/geminiService';
import { PRODUCTS } from './constants';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ProductSelector from './components/ProductSelector';
import GeneratedImage from './components/GeneratedImage';
import Loader from './components/Loader';

const MagicWandIcon: React.FC = () => (
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


const App: React.FC = () => {
    const [userImageFile, setUserImageFile] = useState<File | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const isButtonDisabled = useMemo(() => !userImageFile || !selectedProduct || isLoading, [userImageFile, selectedProduct, isLoading]);

    const handleGenerate = async () => {
        if (!userImageFile || !selectedProduct) {
            setError("Please upload an image and select a product first.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setGeneratedResult(null);

        try {
            const result = await generateTryOnImage(userImageFile, selectedProduct);
            setGeneratedResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            {isLoading && <Loader message="Generating your new look..." />}
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="flex flex-col gap-8">
                        <ImageUploader onImageUpload={setUserImageFile} />
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-teal-300">2. Select Product</h2>
                            <ProductSelector
                                products={PRODUCTS}
                                selectedProduct={selectedProduct}
                                onProductSelect={setSelectedProduct}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="lg:sticky lg:top-8">
                            <GeneratedImage result={generatedResult} />
                            <button
                                onClick={handleGenerate}
                                disabled={isButtonDisabled}
                                className="mt-6 w-full flex items-center justify-center px-6 py-4 bg-teal-500 text-gray-900 font-bold text-lg rounded-lg shadow-lg hover:bg-teal-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                            >
                                <MagicWandIcon />
                                {isLoading ? 'Generating...' : 'Try It On'}
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

export default App;
