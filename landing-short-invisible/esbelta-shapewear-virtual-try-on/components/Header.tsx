
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
      <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            <span className="text-pink-500">soy</span>esbelta
          </h1>
          <h2 className="text-sm font-medium text-gray-500 hidden sm:block">Virtual Try-On</h2>
        </div>
      </div>
    </header>
  );
};
