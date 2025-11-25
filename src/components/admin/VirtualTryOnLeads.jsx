import { useState, useEffect } from 'react';
import { Users, Download, Trash2, Search } from 'lucide-react';
import VirtualTryOnLeadsService from '../../services/VirtualTryOnLeadsService';

const VirtualTryOnLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await VirtualTryOnLeadsService.getAllLeads();
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      setLeads([]);
      alert('Error al cargar leads. Verifica que la tabla existe en Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leadId) => {
    if (!confirm('¿Estás seguro de eliminar este lead?')) return;

    try {
      await VirtualTryOnLeadsService.deleteLead(leadId);
      await loadLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error al eliminar lead');
    }
  };

  const handleExportCSV = async () => {
    try {
      const csv = await VirtualTryOnLeadsService.exportLeadsToCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `leads-probador-virtual-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar CSV');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm);
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-esbelta-chocolate flex items-center gap-2">
          <Users className="w-6 h-6" />
          Leads del Probador Virtual
        </h2>
        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-esbelta-chocolate text-white rounded-lg hover:bg-esbelta-chocolate/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-esbelta-terracotta to-esbelta-terracotta/80 text-white p-6 rounded-xl shadow-lg">
        <div className="text-3xl font-bold">{leads.length}</div>
        <div className="text-sm opacity-90">Total Leads Capturados</div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron leads con ese criterio' : 'No hay leads registrados aún'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{lead.user_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 hover:underline"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar lead"
                      >
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500 text-center">
        Mostrando {filteredLeads.length} de {leads.length} leads
      </div>
    </div>
  );
};

export default VirtualTryOnLeads;
