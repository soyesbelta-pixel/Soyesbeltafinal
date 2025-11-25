import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Mail, Calendar, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const EmailTable = ({ data, currentPage, totalPages, onPageChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBrowser = (userAgent) => {
    if (!userAgent) return 'Desconocido';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Otro';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-esbelta-sand-light overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-esbelta-sand-light">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esbelta-sand" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por email..."
            className="w-full pl-12 pr-4 py-3 border-2 border-esbelta-sand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta focus:border-esbelta-terracotta transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-esbelta-chocolate">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-esbelta-chocolate">
                Fuente
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-esbelta-chocolate">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-esbelta-chocolate">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Navegador
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-esbelta-sand-light">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm text-esbelta-chocolate font-medium">
                      {item.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-esbelta-terracotta bg-opacity-10 text-esbelta-terracotta">
                      {item.source || 'popup'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-esbelta-chocolate-light">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-esbelta-chocolate-light">
                    {getBrowser(item.user_agent)}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-esbelta-chocolate-light">
                  No hay suscripciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-esbelta-sand-light flex items-center justify-between">
          <p className="text-sm text-esbelta-chocolate-light">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white hover:bg-esbelta-sand-light text-esbelta-chocolate rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white hover:bg-esbelta-sand-light text-esbelta-chocolate rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTable;