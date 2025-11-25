
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-teal-300">1. Upload Your Photo</h2>
            <div 
                onClick={handleButtonClick} 
                className="relative flex flex-col items-center justify-center w-full h-80 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:border-teal-400 transition-colors duration-300"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
                {preview ? (
                    <img src={preview} alt="User preview" className="object-cover w-full h-full rounded-lg" />
                ) : (
                    <div className="text-center text-gray-400">
                        <UploadIcon />
                        <p className="font-semibold">Click to upload</p>
                        <p className="text-sm">PNG, JPG or WEBP</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
