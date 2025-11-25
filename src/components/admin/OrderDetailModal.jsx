/**
 * ORDER DETAIL MODAL - Modal de Detalles de Pedido
 *
 * Muestra toda la información de un pedido:
 * - Datos del cliente
 * - Lista de productos
 * - Información de envío
 * - Totales
 * - Cambio de estado
 */

import { X, Package, User, MapPin, DollarSign, Calendar, Truck, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const OrderDetailModal = ({ order, onClose, onStatusChange, onUpdate }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) {
      alert('Selecciona un estado diferente');
      return;
    }

    if (!confirm(`¿Confirmas cambiar el estado a "${newStatus}"?`)) {
      return;
    }

    setIsUpdatingStatus(true);

    try {
      await onStatusChange(order.id, newStatus);
      onUpdate();
      alert('Estado actualizado correctamente');
      onClose();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Manejar tanto array como objeto
  const shippingInfo = Array.isArray(order.shipping_info) ? order.shipping_info[0] : order.shipping_info;
  const isMedellin = order.shipping_type === 'medellin_contra_entrega';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-esbelta-chocolate to-esbelta-sand p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Pedido {order.reference}
                </h2>
                <p className="text-white text-sm opacity-90 mt-1">
                  Creado el {formatDate(order.created_at)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Estado y Tipo de Envío */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Estado Actual
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-esbelta-terracotta focus:border-transparent"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  {newStatus !== order.status && (
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-esbelta-terracotta text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isUpdatingStatus ? 'Actualizando...' : 'Actualizar'}
                    </button>
                  )}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${isMedellin ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Tipo de Envío
                </h3>
                <p className={`text-lg font-bold ${isMedellin ? 'text-blue-700' : 'text-gray-700'}`}>
                  {isMedellin ? 'Contra Entrega - Medellín' : 'Envío Nacional'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.payment_method === 'contra_entrega' ? 'Pago al recibir' : 'Pago en línea'}
                </p>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-esbelta-cream p-6 rounded-xl">
              <h3 className="text-lg font-bold text-esbelta-chocolate mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Información del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-semibold text-gray-900">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha del Pedido</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>
            </div>

            {/* Dirección de Envío */}
            {shippingInfo && (
              <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-esbelta-chocolate mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dirección de Envío
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <strong>Destinatario:</strong> {shippingInfo.full_name || 'No especificado'}
                  </p>
                  <p className="text-gray-900">
                    <strong>Dirección:</strong> {shippingInfo.full_address || 'No especificada'}
                  </p>
                  <p className="text-gray-900">
                    <strong>Ciudad:</strong> {shippingInfo.city || 'No especificada'}, {shippingInfo.department || 'N/A'}
                  </p>
                  <p className="text-gray-900">
                    <strong>Código Postal:</strong> {shippingInfo.postal_code || 'No especificado'}
                  </p>
                  <p className="text-gray-900">
                    <strong>Teléfono:</strong> {shippingInfo.phone || 'No especificado'}
                  </p>
                </div>
              </div>
            )}
            {!shippingInfo && (
              <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl">
                <p className="text-sm text-yellow-800">
                  ⚠️ No hay información de envío disponible para este pedido
                </p>
              </div>
            )}

            {/* Productos */}
            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-esbelta-chocolate mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Productos del Pedido
              </h3>
              <div className="space-y-3">
                {order.order_items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">
                        Talla: {item.size} | Color: {item.color || 'N/A'} | Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Precio unitario</p>
                      <p className="font-bold text-esbelta-terracotta">{formatPrice(item.unit_price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="font-bold text-esbelta-chocolate">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Pago */}
            <div className="bg-gradient-to-br from-esbelta-cream to-esbelta-sand p-6 rounded-xl">
              <h3 className="text-lg font-bold text-esbelta-chocolate mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Resumen de Pago
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Envío:</span>
                  <span className="font-semibold">
                    {order.shipping_cost === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      formatPrice(order.shipping_cost)
                    )}
                  </span>
                </div>
                <div className="border-t-2 border-esbelta-chocolate pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-esbelta-chocolate">Total:</span>
                    <span className="text-2xl font-bold text-esbelta-terracotta">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
                {isMedellin && (
                  <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800 font-semibold">
                      💵 Pago Contra Entrega - El cliente pagará al recibir el pedido
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notas */}
            {order.notes && (
              <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-yellow-800 mb-2">Notas</h3>
                <p className="text-sm text-yellow-900">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <Calendar className="w-4 h-4 inline mr-1" />
              Última actualización: {formatDate(order.updated_at)}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
