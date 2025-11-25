/**
 * ORDERS MANAGER - Gestión de Pedidos para Admin Dashboard
 *
 * Componente principal para visualizar, filtrar y gestionar pedidos
 * Incluye tabla con paginación, filtros, búsqueda y acciones
 */

import { useState, useEffect } from 'react';
import {
  Package, Search, Filter, Download, Eye, Truck,
  CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import OrderDetailModal from './OrderDetailModal';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filtros
  const [filters, setFilters] = useState({
    status: '',
    shipping_type: '',
    search: ''
  });

  // Modal de detalles
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cargar órdenes
  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOrders(filters, currentPage, 20);

      if (result.success) {
        setOrders(result.orders);
        setTotalPages(result.pagination.totalPages);
        setTotalOrders(result.pagination.total);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar órdenes al montar y cuando cambien filtros o página
  useEffect(() => {
    loadOrders();
  }, [currentPage, filters]);

  // Manejar cambio de filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset a la primera página
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({ status: '', shipping_type: '', search: '' });
    setCurrentPage(1);
  };

  // Ver detalles de orden
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Cambiar estado de orden
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);

      if (result.success) {
        // Recargar órdenes para mostrar el cambio
        loadOrders();

        // Mostrar notificación de éxito
        alert('Estado actualizado correctamente');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar el estado: ' + err.message);
    }
  };

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['Referencia', 'Cliente', 'Email', 'Teléfono', 'Dirección', 'Ciudad', 'Departamento', 'Código Postal', 'Total', 'Estado', 'Fecha'];
    const rows = orders.map(order => {
      const shipInfo = Array.isArray(order.shipping_info) ? order.shipping_info[0] : order.shipping_info;
      return [
        order.reference,
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        shipInfo?.full_address || 'N/A',
        shipInfo?.city || 'N/A',
        shipInfo?.department || 'N/A',
        shipInfo?.postal_code || 'N/A',
        `$${order.total.toLocaleString('es-CO')}`,
        order.status,
        new Date(order.created_at).toLocaleDateString('es-CO')
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Badge de estado
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      enviado: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Truck },
      entregado: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      cancelado: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pendiente;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-esbelta-chocolate flex items-center gap-2">
            <Package className="w-7 h-7" />
            Gestión de Pedidos
          </h2>
          <p className="text-gray-600 mt-1">
            {totalOrders} pedido{totalOrders !== 1 ? 's' : ''} en total
          </p>
        </div>

        <button
          onClick={exportToCSV}
          disabled={orders.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-esbelta-sage text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Referencia, nombre, email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-esbelta-terracotta focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-esbelta-terracotta focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Filtro por tipo de envío */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Envío
            </label>
            <select
              value={filters.shipping_type}
              onChange={(e) => handleFilterChange('shipping_type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-esbelta-terracotta focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="medellin_contra_entrega">Medellín (Contra Entrega)</option>
              <option value="standard">Envío Nacional</option>
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {(filters.status || filters.shipping_type || filters.search) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-esbelta-terracotta hover:text-esbelta-chocolate font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla de órdenes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Cargando pedidos...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-4 px-4 py-2 bg-esbelta-terracotta text-white rounded-lg hover:bg-opacity-90"
            >
              Reintentar
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron pedidos</p>
            {(filters.status || filters.shipping_type || filters.search) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-esbelta-terracotta hover:text-esbelta-chocolate font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección / Ciudad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-esbelta-chocolate">
                          {order.reference}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-gray-500 text-xs">{order.customer_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {(() => {
                              const shipInfo = Array.isArray(order.shipping_info) ? order.shipping_info[0] : order.shipping_info;
                              return shipInfo?.full_address || 'Sin dirección';
                            })()}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {(() => {
                              const shipInfo = Array.isArray(order.shipping_info) ? order.shipping_info[0] : order.shipping_info;
                              return `${shipInfo?.city || 'N/A'}, ${shipInfo?.department || 'N/A'}`;
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-esbelta-terracotta">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.shipping_type === 'medellin_contra_entrega'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.shipping_type === 'medellin_contra_entrega' ? 'Contra Entrega' : 'Nacional'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-esbelta-terracotta hover:text-esbelta-chocolate font-medium flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
          onStatusChange={handleStatusChange}
          onUpdate={loadOrders}
        />
      )}
    </div>
  );
};

export default OrdersManager;
