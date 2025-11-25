
import React from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import { AlertTriangle } from 'lucide-react';

interface ProductSelectionStepProps {
  userImageUrl: string;
  onProductSelect: (product: Product) => void;
  error: string | null;
}

export const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({ userImageUrl, onProductSelect, error }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Photo</h3>
          <div className="w-64 h-80 rounded-lg overflow-hidden shadow-lg mb-4">
             <img src={userImageUrl} alt="User upload" className="w-full h-full object-cover" />
          </div>
          <p className="text-gray-500 text-sm">Now, select a product to virtually try on.</p>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center lg:text-left">Choose Your Shapewear</h3>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-3 text-red-500"/>
              <div>
                <p className="font-bold">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[28rem] overflow-y-auto pr-2">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => onProductSelect(product)}
                className="bg-gray-50 rounded-lg p-4 text-left hover:shadow-lg hover:bg-white transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <div className="flex items-center space-x-4">
                   <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-gray-900">{product.name}</h4>
                     <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
