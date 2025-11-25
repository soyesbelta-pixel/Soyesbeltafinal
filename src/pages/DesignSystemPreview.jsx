import React from 'react';
import { motion } from 'framer-motion';

const DesignSystemPreview = () => {
  return (
    <div className="min-h-screen bg-[#F9F7F5] py-12 px-4 sm:px-6 lg:px-8 font-body text-chocolate">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-chocolate tracking-tighter">
            Laboratorio de Diseño
          </h1>
          <p className="text-xl text-chocolate/70">Comparativa Visual: Actual vs. Propuesta 2025</p>
        </div>

        {/* 1. EXPERIMENTO DE COLOR: ROSA */}
        <section className="space-y-6">
          <div className="border-b border-chocolate/10 pb-2">
            <h2 className="text-2xl font-heading font-bold">1. Refinamiento del color 'Rose'</h2>
            <p className="text-chocolate/60">El tono actual es intenso. El propuesto es más pastel y "boutique".</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Actual */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center space-y-4">
              <span className="text-sm font-bold uppercase tracking-widest text-chocolate/50">Actual (#C96F7B)</span>
              <div className="w-32 h-32 rounded-full shadow-lg bg-[#C96F7B] flex items-center justify-center text-white font-bold">
                Intenso
              </div>
              <button className="px-6 py-3 rounded-full bg-[#C96F7B] text-white font-semibold">
                Ver Detalles
              </button>
              <div className="bg-[#C96F7B]/10 text-[#C96F7B] px-3 py-1 rounded-full text-sm font-bold">
                Badge Oferta
              </div>
            </div>

            {/* Propuesta */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center space-y-4 border-2 border-[#D4A5A5]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
              <span className="text-sm font-bold uppercase tracking-widest text-chocolate/50">Propuesta (#D4A5A5)</span>
              <div className="w-32 h-32 rounded-full shadow-lg bg-[#D4A5A5] flex items-center justify-center text-white font-bold">
                Sofisticado
              </div>
              <button className="px-6 py-3 rounded-full bg-[#D4A5A5] text-white font-semibold hover:bg-[#C69595] transition-colors">
                Ver Detalles
              </button>
              <div className="bg-[#D4A5A5]/15 text-[#C28F8F] px-3 py-1 rounded-full text-sm font-bold">
                Badge Oferta
              </div>
            </div>
          </div>
        </section>

        {/* 2. EXPERIMENTO: BOTONES CON SHIMMER */}
        <section className="space-y-6">
          <div className="border-b border-chocolate/10 pb-2">
            <h2 className="text-2xl font-heading font-bold">2. Botones con 'Shimmer' (Brillo)</h2>
            <p className="text-chocolate/60">Animación sutil para aumentar el CTR sin ser intrusiva.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center justify-items-center bg-white p-10 rounded-2xl">
            {/* Estático */}
            <div className="text-center space-y-3">
              <p className="text-sm font-bold text-chocolate/40">BOTÓN ESTÁTICO</p>
              <button className="bg-chocolate text-beige px-8 py-4 rounded-full font-bold text-lg shadow-lg">
                Comprar Ahora
              </button>
            </div>

            {/* Con Shimmer */}
            <div className="text-center space-y-3">
              <p className="text-sm font-bold text-chocolate/40">CON EFECTO SHIMMER</p>
              <button className="relative overflow-hidden bg-chocolate text-beige px-8 py-4 rounded-full font-bold text-lg shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                <span className="relative z-10">Comprar Ahora</span>
                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                {/* CSS inline para la demo si no está en tailwind */}
                <style>{`
                  @keyframes shimmer {
                    100% { transform: translateX(100%); }
                  }
                  .group:hover .group-hover\:animate-\[shimmer_1\.5s_infinite\] {
                    animation: shimmer 1.5s infinite;
                  }
                `}</style>
              </button>
            </div>
          </div>
        </section>

        {/* 3. EXPERIMENTO: SOMBRAS DE COLOR (GLOW) */}
        <section className="space-y-6">
          <div className="border-b border-chocolate/10 pb-2">
            <h2 className="text-2xl font-heading font-bold">3. Sombras 'Glow' vs. Estándar</h2>
            <p className="text-chocolate/60">Las sombras del mismo color del objeto se ven más limpias y modernas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 p-8">
            {/* Sombra Negra */}
            <div className="bg-white p-6 rounded-2xl text-center space-y-4">
              <p className="text-sm font-bold text-chocolate/40">SOMBRA NEGRA (ACTUAL)</p>
              <div className="mx-auto w-full max-w-xs bg-chocolate text-beige py-4 rounded-xl shadow-lg shadow-black/20">
                Sombra Sucia
              </div>
              <div className="mx-auto w-full max-w-xs bg-[#D4A5A5] text-white py-4 rounded-xl shadow-lg shadow-black/20">
                Rosa con Sombra Gris
              </div>
            </div>

            {/* Sombra Color */}
            <div className="bg-white p-6 rounded-2xl text-center space-y-4">
              <p className="text-sm font-bold text-chocolate/40">SOMBRA GLOW (PROPUESTA)</p>
              <div className="mx-auto w-full max-w-xs bg-chocolate text-beige py-4 rounded-xl shadow-xl shadow-chocolate/30">
                Sombra Chocolate
              </div>
              <div className="mx-auto w-full max-w-xs bg-[#D4A5A5] text-white py-4 rounded-xl shadow-xl shadow-[#D4A5A5]/50">
                Rosa con Glow Rosa
              </div>
            </div>
          </div>
        </section>

         {/* 4. EXPERIMENTO: TIPOGRAFÍA HERO */}
         <section className="space-y-6 pb-12">
          <div className="border-b border-chocolate/10 pb-2">
            <h2 className="text-2xl font-heading font-bold">4. Tipografía Editorial</h2>
            <p className="text-chocolate/60">Ajuste de 'tracking' (espaciado) en títulos grandes.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl space-y-8">
            <div>
              <p className="text-xs font-bold text-chocolate/40 mb-2 uppercase">Normal (Tracking 0)</p>
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-chocolate leading-tight">
                Nueva Colección
              </h1>
            </div>
            
            <div>
              <p className="text-xs font-bold text-chocolate/40 mb-2 uppercase">Tight (Tracking -0.04em) - Look Revista</p>
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-chocolate leading-tight tracking-tighter">
                Nueva Colección
              </h1>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DesignSystemPreview;
