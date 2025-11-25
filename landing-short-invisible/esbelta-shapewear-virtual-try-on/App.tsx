
import React, { useState, useCallback } from 'react';
import { Product, Step, GeneratedImages } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadStep } from './components/UploadStep';
import { ProductSelectionStep } from './components/ProductSelectionStep';
import { ResultStep } from './components/ResultStep';
import { GeneratingStep } from './components/GeneratingStep';
import { generateTryOnImages } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('upload');
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string; url: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({ front: null, side: null });
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setUserImage({
        base64: base64String,
        mimeType: file.type,
        url: URL.createObjectURL(file),
      });
      setStep('select');
    };
    reader.onerror = () => {
      setError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleProductSelect = useCallback(async (product: Product) => {
    if (!userImage) {
      setError('No user image found. Please upload an image first.');
      setStep('upload');
      return;
    }

    setSelectedProduct(product);
    setStep('generating');
    setError(null);

    try {
      const { front, side } = await generateTryOnImages(userImage.base64, userImage.mimeType, product);
      if (front && side) {
        setGeneratedImages({ front, side });
        setStep('result');
      } else {
        throw new Error('One or more images could not be generated.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
      setStep('select'); // Go back to product selection on error
    }
  }, [userImage]);

  const handleReset = () => {
    setStep('upload');
    setUserImage(null);
    setSelectedProduct(null);
    setGeneratedImages({ front: null, side: null });
    setError(null);
    if(userImage?.url){
        URL.revokeObjectURL(userImage.url);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return <UploadStep onImageUpload={handleImageUpload} />;
      case 'select':
        return userImage && <ProductSelectionStep userImageUrl={userImage.url} onProductSelect={handleProductSelect} error={error} />;
      case 'generating':
        return selectedProduct && <GeneratingStep productName={selectedProduct.name} />;
      case 'result':
        return <ResultStep generatedImages={generatedImages} onReset={handleReset} />;
      default:
        return <UploadStep onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          {renderStep()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
