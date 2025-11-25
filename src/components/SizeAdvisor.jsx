import { motion } from 'framer-motion';
import { X, Ruler, Info, Check } from 'lucide-react';
import { useState } from 'react';

const SizeAdvisor = ({ onClose }) => {
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    weight: '',
    height: ''
  });
  
  const [recommendedSize, setRecommendedSize] = useState(null);

  const calculateSize = () => {
    const { waist, hips } = measurements;
    
    if (!waist || !hips) return;
    
    const waistNum = parseInt(waist);
    const hipsNum = parseInt(hips);
    
    let size = '';
    
    if (waistNum <= 65 && hipsNum <= 90) {
      size = 'XS';
    } else if (waistNum <= 70 && hipsNum <= 95) {
      size = 'S';
    } else if (waistNum <= 75 && hipsNum <= 100) {
      size = 'M';
    } else if (waistNum <= 80 && hipsNum <= 105) {
      size = 'L';
    } else if (waistNum <= 85 && hipsNum <= 110) {
      size = 'XL';
    } else {
      size = 'XXL';
    }
    
    setRecommendedSize(size);
  };

  const sizeChart = [
    { size: 'XS', bust: '80-85', waist: '60-65', hips: '85-90' },
    { size: 'S', bust: '85-90', waist: '65-70', hips: '90-95' },
    { size: 'M', bust: '90-95', waist: '70-75', hips: '95-100' },
    { size: 'L', bust: '95-100', waist: '75-80', hips: '100-105' },
    { size: 'XL', bust: '100-105', waist: '80-85', hips: '105-110' },
    { size: 'XXL', bust: '105-110', waist: '85-90', hips: '110-115' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-chocolate flex items-center gap-2">
                <Ruler className="w-6 h-6 text-gold-500" />
                Asesor de Tallas Inteligente
              </h2>
              <p className="text-gray-600 mt-1">
                Encuentra tu talla perfecta en 3 sencillos pasos
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calculator */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Calculadora de Talla</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cintura (cm)
                  </label>
                  <input
                    type="number"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gold-400 focus:outline-none"
                    placeholder="70"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cadera (cm)
                  </label>
                  <input
                    type="number"
                    value={measurements.hips}
                    onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gold-400 focus:outline-none"
                    placeholder="95"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Peso (kg) - Opcional
                  </label>
                  <input
                    type="number"
                    value={measurements.weight}
                    onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gold-400 focus:outline-none"
                    placeholder="60"
                  />
                </div>
                
                <button
                  onClick={calculateSize}
                  className="w-full btn-gold"
                >
                  Calcular Mi Talla
                </button>
              </div>

              {/* Result */}
              {recommendedSize && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-gold-100 to-gold-50 rounded-lg"
                >
                  <p className="text-sm text-gray-600 mb-2">Tu talla recomendada es:</p>
                  <p className="text-4xl font-bold text-gold-600">{recommendedSize}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    <Check className="w-4 h-4 inline text-green-500" />
                    Basado en tus medidas
                  </p>
                </motion.div>
              )}

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Consejos para medir
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Usa una cinta métrica flexible</li>
                  <li>• Mide sobre ropa interior ajustada</li>
                  <li>• Mantén la cinta paralela al suelo</li>
                  <li>• No aprietes demasiado la cinta</li>
                </ul>
              </div>
            </div>

            {/* Size Chart */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Tabla de Tallas</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gold-50">
                      <th className="px-4 py-2 text-left">Talla</th>
                      <th className="px-4 py-2 text-left">Busto (cm)</th>
                      <th className="px-4 py-2 text-left">Cintura (cm)</th>
                      <th className="px-4 py-2 text-left">Cadera (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((row) => (
                      <tr
                        key={row.size}
                        className={`border-b ${
                          recommendedSize === row.size
                            ? 'bg-gold-100 font-bold'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-2">{row.size}</td>
                        <td className="px-4 py-2">{row.bust}</td>
                        <td className="px-4 py-2">{row.waist}</td>
                        <td className="px-4 py-2">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual Guide */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Cómo tomar tus medidas</h4>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="aspect-video bg-gradient-to-br from-gold-200 to-gold-300 rounded-lg flex items-center justify-center">
                    <p className="text-gray-700">
                      Ilustración de medidas corporales
                    </p>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✅ Garantía de Talla Perfecta
                </p>
                <p className="text-xs text-green-700">
                  Si la talla no es la correcta, te la cambiamos sin costo adicional
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              ¿Aún tienes dudas? Nuestros asesores están listos para ayudarte
            </p>
            <button className="btn-gold">
              Hablar con un Asesor
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SizeAdvisor;