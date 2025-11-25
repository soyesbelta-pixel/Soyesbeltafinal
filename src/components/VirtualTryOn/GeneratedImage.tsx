
import React from 'react';
import type { GeneratedResult } from '../types';

interface GeneratedImageProps {
    result: GeneratedResult | null;
}

const SparkleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gray-500">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ result }) => {
    if (!result || !result.image) {
        return (
            <div className="w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500">
                <SparkleIcon />
                <p className="mt-4 font-semibold">Your generated image will appear here</p>
                <p className="text-sm">Upload a photo and select an item to get started</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-teal-300">Your Virtual Try-On</h2>
            <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                <img src={result.image} alt="Generated try-on" className="w-full h-full object-contain" />
            </div>
            <div className="mt-4 text-center bg-gradient-to-r from-teal-500 to-purple-600 p-4 rounded-lg shadow-lg">
                <p className="text-lg font-semibold text-white mb-1">
                    ¡Te queda increíble! ✨
                </p>
                <p className="text-sm text-white">
                    Realza tu figura de forma natural y elegante
                </p>
            </div>
        </div>
    );
};

export default GeneratedImage;
