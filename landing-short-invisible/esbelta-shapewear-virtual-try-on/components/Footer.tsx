
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} soyesbelta. All rights reserved. AI-Powered Virtual Try-On.
        </p>
      </div>
    </footer>
  );
};
