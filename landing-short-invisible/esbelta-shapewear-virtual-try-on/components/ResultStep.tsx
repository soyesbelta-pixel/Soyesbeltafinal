
import React from 'react';
import { GeneratedImages } from '../types';
import { RefreshCw } from 'lucide-react';
import { Spinner } from './Spinner';

interface ResultStepProps {
  generatedImages: GeneratedImages;
  onReset: () => void;
}

const ImageCard: React.FC<{ title: string; imageSrc: string | null }> = ({ title, imageSrc }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    <div className="w-64 h-96 sm:w-80 sm:h-[30rem] bg-gray-200 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
      {imageSrc ? (
        <img src={`data:image/png;base64,${imageSrc}`} alt={`${title} view`} className="w-full h-full object-cover" />
      ) : (
        <Spinner />
      )}
    </div>
  </div>
);

export const ResultStep: React.FC<ResultStepProps> = ({ generatedImages, onReset }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Virtual Try-On is Ready!</h2>
      <p className="text-gray-600 mb-8">Here is how the shapewear looks from the front and the side.</p>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 mb-10">
        <ImageCard title="Front View" imageSrc={generatedImages.front} />
        <ImageCard title="Side View" imageSrc={generatedImages.side} />
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center px-8 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Try Another Product
      </button>
    </div>
  );
};
