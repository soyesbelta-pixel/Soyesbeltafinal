import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductService from '../services/ProductService';
import useStore from '../store/useStore';
import ProductCard from './ProductCard';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const { selectedCategory, setSelectedCategory } = useStore();

  useEffect(() => {
    ProductService.getProducts().then(setProducts);
  }, []);

  const filtered = selectedCategory === 'todos' ? products : products.filter(p => p.category === selectedCategory);

  const categoriesList = [
    { id: "realce", name: "Realce", video: "/videos/short levanta cola magic hombre.mov", image: "/short-magic-negro-1.png" },
    { id: "fajas", name: "Fajas", video: "/videos/cintura-cocoa.mp4", image: "/Cintura Reloj de Arena/Cocoa 1.png" },
    { id: "lenceria", name: "Lencería", video: "/videos/cachetero-control-abdomen-alto.mp4", image: "/Brasier Realce Corrector de Postura/Beige 1.png" },
    { id: "moldeadoras", name: "Moldea", video: "/videos/Short levanta glúteo invisible.mp4", image: "/waist-trainer-premium.png" }
  ];

  return (
    <section className="bg-black min-h-screen pb-20">
       {/* Full Screen Cinematic Header */}
       <div className="h-[80vh] relative overflow-hidden">
          <div className="absolute inset-0 flex">
             {categoriesList.map((cat) => (
                <motion.div 
                  key={cat.id}
                  className="relative flex-1 h-full border-r border-white/10 cursor-pointer group overflow-hidden"
                  onHoverStart={() => setSelectedCategory(cat.id)}
                  onClick={() => setSelectedCategory(cat.id)}
                  animate={{ flex: selectedCategory === cat.id ? 3 : 1 }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                >
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                   
                   {/* Fallback Image if video fails or loads slow */}
                   <img src={cat.image} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={cat.name} />
                   
                   {/* Content */}
                   <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black/90 to-transparent">
                      <h2 className={`font-heading text-white uppercase tracking-tighter transition-all duration-500 ${selectedCategory === cat.id ? 'text-5xl mb-2' : 'text-xl rotate-[-90deg] origin-bottom-left translate-x-8'}`}>
                         {cat.name}
                      </h2>
                      {selectedCategory === cat.id && (
                         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/70 text-sm max-w-xs">
                            Descubre la nueva colección diseñada para resaltar tu belleza natural.
                         </motion.p>
                      )}
                   </div>
                </motion.div>
             ))}
          </div>
       </div>

       {/* Products fade in below */}
       <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {filtered.map((product, index) => (
               <ProductCard key={product.id} product={product} index={index} />
             ))}
          </div>
       </div>
    </section>
  );
};

export default ProductCatalog;