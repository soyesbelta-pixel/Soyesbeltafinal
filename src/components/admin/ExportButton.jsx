import { Download } from 'lucide-react';
import { useState } from 'react';
import { exportToExcel } from '../../utils/exportToExcel';

const ExportButton = ({ data, disabled }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    setIsExporting(true);

    try {
      const result = exportToExcel(data, 'suscripciones_esbelta');

      if (result.success) {
        // Show success message
        alert(`✅ Archivo exportado: ${result.filename}`);
      } else {
        alert(`❌ Error al exportar: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Error al exportar el archivo');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting || !data || data.length === 0}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-esbelta-sand to-esbelta-terracotta-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-5 h-5" />
      <span>{isExporting ? 'Exportando...' : 'Exportar a Excel'}</span>
    </button>
  );
};

export default ExportButton;