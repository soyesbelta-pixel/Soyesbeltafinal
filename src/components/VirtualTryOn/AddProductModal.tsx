import React, { useState } from 'react';
import type { Product } from '../types';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [showExamples, setShowExamples] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!name.trim() || !description.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        // Create new product
        const newProduct: Product = {
            id: `custom-${Date.now()}`,
            name: name.trim(),
            image: imageUrl.trim() || `https://picsum.photos/200/300?grayscale&blur=2&random=${Date.now()}`,
            prompt: description.trim()
        };

        onAdd(newProduct);

        // Reset form
        setName('');
        setImageUrl('');
        setDescription('');
        setShowExamples(false);
        onClose();
    };

    // Example descriptions for guidance
    const exampleDescriptions = [
        "pantalón deportivo profesional color negro, material técnico opaco con elastano, largo hasta el tobillo, cintura elástica alta, costuras reforzadas, diseño para running profesional",
        "camiseta técnica sin mangas color blanco, material de poliéster con tecnología moisture-wicking, corte atlético estándar, cobertura completa, apropiada para entrenamiento funcional",
        "short deportivo profesional color azul royal, largo medio muslo, material técnico respirable, cintura elástica con cordón interno, bolsillos laterales con cremallera, diseño para crossfit"
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative my-8">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white">Add Professional Catalog Product</h2>

                {/* Professional Guidelines */}
                <div className="mb-4 p-3 bg-teal-900 bg-opacity-30 border border-teal-600 rounded-lg">
                    <h3 className="text-sm font-semibold text-teal-300 mb-2">📋 Professional Catalog Guidelines:</h3>
                    <ul className="text-xs text-gray-300 space-y-1">
                        <li>• Use technical fashion terminology (e.g., "material técnico", "corte atlético")</li>
                        <li>• Specify opacity: always mention "opaco" or "cobertura completa"</li>
                        <li>• Include professional details: material, fit, length, purpose</li>
                        <li>• Avoid suggestive terms; use catalog-appropriate language</li>
                        <li>• Focus on functionality and professional sports context</li>
                    </ul>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                            placeholder="e.g., Professional Training Shorts"
                            required
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                            Image URL (optional)
                        </label>
                        <input
                            type="url"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Leave empty for automatic placeholder image
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Technical Product Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                            placeholder="Describe using professional catalog terminology: color, material (opaque), fit type, coverage, technical features..."
                            rows={4}
                            required
                        />

                        {/* Examples toggle */}
                        <button
                            type="button"
                            onClick={() => setShowExamples(!showExamples)}
                            className="text-xs text-teal-400 hover:text-teal-300 mt-2 transition-colors"
                        >
                            {showExamples ? '▼ Hide' : '▶ Show'} description examples
                        </button>

                        {showExamples && (
                            <div className="mt-2 p-3 bg-gray-700 rounded text-xs space-y-2">
                                <p className="text-teal-300 font-semibold">Professional description examples:</p>
                                {exampleDescriptions.map((example, index) => (
                                    <div key={index} className="text-gray-300">
                                        <span className="text-teal-400">Example {index + 1}:</span> {example}
                                        <button
                                            type="button"
                                            onClick={() => setDescription(example)}
                                            className="ml-2 text-teal-500 hover:text-teal-400 underline"
                                        >
                                            Use this
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Important Notes */}
                    <div className="p-3 bg-gray-700 rounded-lg">
                        <p className="text-xs text-yellow-400">
                            ⚠️ <strong>Important:</strong> Use professional, technical descriptions suitable for an e-commerce catalog.
                            Avoid informal or suggestive language. Always specify that garments are opaque with appropriate coverage.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Add to Catalog
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;