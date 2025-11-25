import React from 'react';

const Loader = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-esbelta-chocolate bg-opacity-80 flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-t-esbelta-terracotta border-esbelta-sand rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-esbelta-cream font-semibold">{message}</p>
        </div>
    );
};

export default Loader;