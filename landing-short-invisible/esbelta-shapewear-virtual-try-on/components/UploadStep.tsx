
import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadStepProps {
  onImageUpload: (file: File) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onImageUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    setError(null);
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        setError('Please select a valid image file (PNG, JPG, etc.).');
      }
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onImageUpload]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-center transform transition-all hover:scale-[1.01] duration-300">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Virtual Try-On</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">Upload a full-body photo to see how our shapewear looks on you. For best results, use a clear, well-lit photo.</p>
      
      <label
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 ${dragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}`}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <div className="flex flex-col items-center text-gray-500">
          <UploadCloud className={`w-12 h-12 mb-4 transition-colors duration-200 ${dragging ? 'text-pink-600' : 'text-gray-400'}`} />
          <span className="font-semibold text-pink-600">Click to upload</span>
          <span className="mt-1 text-sm">or drag and drop</span>
          <p className="text-xs text-gray-400 mt-4">PNG, JPG, WEBP up to 10MB</p>
        </div>
      </label>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
};
