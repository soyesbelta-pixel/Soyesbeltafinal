
import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-t-teal-400 border-gray-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-white font-semibold">{message}</p>
        </div>
    );
};

export default Loader;
