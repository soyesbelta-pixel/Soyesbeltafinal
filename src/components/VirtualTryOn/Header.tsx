
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-500">
                    GymFit Virtual Try-On
                </span>
            </h1>
            <p className="mt-2 text-lg text-gray-400">See your new look before you buy.</p>
        </header>
    );
};

export default Header;
