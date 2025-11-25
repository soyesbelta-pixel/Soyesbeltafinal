
import React from 'react';
import type { Product } from '../types';

interface ProductSelectorProps {
    products: Product[];
    selectedProduct: Product | null;
    onProductSelect: (product: Product) => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);


const ProductSelector: React.FC<ProductSelectorProps> = ({ products, selectedProduct, onProductSelect }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => {
                    const isSelected = selectedProduct?.id === product.id;
                    return (
                        <div
                            key={product.id}
                            onClick={() => onProductSelect(product)}
                            className={`relative aspect-square bg-gray-800 rounded-lg cursor-pointer overflow-hidden border-2 transition-all duration-300 ${
                                isSelected ? 'border-teal-400 scale-105' : 'border-transparent hover:border-gray-600'
                            }`}
                        >
                            <img src={product.image || product.imageSrc} alt={product.displayName || product.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2">
                                <h3 className="text-sm font-bold text-white">{product.displayName || product.name}</h3>
                            </div>
                            {isSelected && (
                                <div className="absolute inset-0 bg-teal-500 bg-opacity-70 flex items-center justify-center">
                                    <CheckIcon />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductSelector;
