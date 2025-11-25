import React from 'react';
import { Info } from 'lucide-react';

const InfoBanner = () => {
    return (
        <div className="bg-white/40 border border-esbelta-sand/30 rounded-xl p-4 sm:p-5 mb-6">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-esbelta-chocolate flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="font-bold text-esbelta-chocolate text-base sm:text-lg mb-2">
                        Tips para mejores resultados
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-base text-esbelta-chocolate/80">
                        <li className="flex items-start gap-2">
                            <span className="text-lg sm:text-xl flex-shrink-0">📸</span>
                            <span>Sube tu mejor foto natural de cuerpo completo (Sugerencia: con ropa y de perfil)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-lg sm:text-xl flex-shrink-0">🔄</span>
                            <span>Si falla la primera vez, ¡reinténtalo! La IA puede confundir el contenido ocasionalmente</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InfoBanner;