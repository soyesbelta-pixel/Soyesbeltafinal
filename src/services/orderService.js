/**
 * ORDER SERVICE - Gestión de Pedidos
 *
 * Servicio para manejar todas las operaciones relacionadas con pedidos:
 * - Crear órdenes y guardar en Supabase
 * - Gestionar items y envío
 * - Actualizar estados
 * - Consultar órdenes para admin dashboard
 */

import { supabase } from './supabaseClient';
import { sendOrderConfirmation } from './emailService';

/**
 * Genera una referencia única para el pedido
 * Formato: ORD-YYYYMMDD-XXX
 */
export const generateOrderReference = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;

  // Obtener el último pedido del día para incrementar el contador
  const { data: lastOrder } = await supabase
    .from('orders')
    .select('reference')
    .like('reference', `ORD-${datePrefix}-%`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let counter = 1;
  if (lastOrder) {
    const lastCounter = parseInt(lastOrder.reference.split('-')[2]);
    counter = lastCounter + 1;
  }

  const counterStr = String(counter).padStart(3, '0');
  return `ORD-${datePrefix}-${counterStr}`;
};

/**
 * Crea una nueva orden completa
 * @param {Object} orderData - Datos completos de la orden
 * @returns {Promise<Object>} - Orden creada con su ID
 */
export const createOrder = async (orderData) => {
  const {
    cart,
    shippingInfo,
    subtotal,
    shippingCost,
    total,
    isMedellin,
    isAntioquia,
    paymentMethod = 'contra_entrega'
  } = orderData;

  try {
    if (!cart || cart.length === 0) {
      throw new Error('El carrito está vacío. Agrega productos antes de continuar.');
    }

    const invalidItem = cart.find(
      (item) => !item.id || !item.name || !item.size || !item.price || item.quantity <= 0
    );
    if (invalidItem) {
      throw new Error('Falta información de talla o precio en uno de los productos del carrito.');
    }

    // DEBUG: Ver qué datos llegan
    console.log('📦 createOrder - shippingInfo recibido:', shippingInfo);
    console.log('📦 createOrder - isAntioquia:', isAntioquia);
    console.log('📦 createOrder - isMedellin:', isMedellin);

    // 1. Generar referencia única
    const reference = await generateOrderReference();

    // 2. Crear la orden principal
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        reference,
        customer_email: shippingInfo.email,
        customer_name: shippingInfo.fullName,
        customer_phone: shippingInfo.phone,
        subtotal,
        shipping_cost: shippingCost,
        total,
        status: 'pendiente',
        shipping_type: isAntioquia ? 'medellin_contra_entrega' : 'standard',
        payment_method: paymentMethod
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error al crear orden:', orderError);
      throw new Error('No se pudo crear la orden');
    }

    console.log('✅ Orden creada:', order);

    // 3. Guardar items de la orden
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      size: item.size,
      color: item.color || null,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error al guardar items:', itemsError);
      throw new Error('No se pudieron guardar los productos');
    }

    console.log('✅ Items guardados:', orderItems.length);

    // 4. Guardar información de envío
    const shippingData = {
      order_id: order.id,
      full_name: shippingInfo.fullName,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      full_address: shippingInfo.fullAddress,
      department: shippingInfo.department,
      city: shippingInfo.city,
      postal_code: shippingInfo.postalCode,
      is_medellin: isMedellin,
      is_antioquia: isAntioquia,
      shipping_cost: shippingCost
    };

    console.log('📦 Datos de envío a guardar:', shippingData);

    const { data: shippingResult, error: shippingError } = await supabase
      .from('shipping_info')
      .insert(shippingData)
      .select();

    if (shippingError) {
      console.error('❌ Error al guardar envío:', shippingError);
      console.error('❌ Código de error:', shippingError.code);
      console.error('❌ Mensaje:', shippingError.message);
      console.error('❌ Detalles:', shippingError.details);
      console.error('❌ Hint:', shippingError.hint);

      // Mostrar alerta visible al usuario
      alert(`ERROR AL GUARDAR DIRECCIÓN:\n\n${shippingError.message}\n\nCódigo: ${shippingError.code}\n\nRevisa la consola para más detalles.`);

      throw new Error('No se pudo guardar la información de envío: ' + shippingError.message);
    }

    console.log('✅ Información de envío guardada correctamente');
    console.log('✅ Datos guardados:', shippingResult);

    // 5. Enviar email de confirmación
    const emailData = {
      reference: order.reference,
      customer_name: shippingInfo.fullName,
      customer_email: shippingInfo.email,
      order_items: orderItems,
      subtotal,
      shipping_cost: shippingCost,
      total,
      shipping_info: shippingInfo,
      is_medellin: isMedellin,
      payment_method: paymentMethod
    };

    const emailResult = await sendOrderConfirmation(emailData);

    if (!emailResult.success) {
      console.warn('⚠️ No se pudo enviar el email, pero la orden se creó correctamente');
    }

    return {
      success: true,
      order,
      reference: order.reference,
      message: 'Pedido creado exitosamente'
    };

  } catch (error) {
    console.error('❌ Error completo al crear orden:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al crear el pedido'
    };
  }
};

/**
 * Obtiene todas las órdenes (para dashboard admin)
 * @param {Object} filters - Filtros opcionales (status, shipping_type, date_from, date_to)
 * @param {Number} page - Número de página (default: 1)
 * @param {Number} limit - Items por página (default: 50)
 * @returns {Promise<Object>} - Lista de órdenes con paginación
 */
export const getOrders = async (filters = {}, page = 1, limit = 50) => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        shipping_info(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.shipping_type) {
      query = query.eq('shipping_type', filters.shipping_type);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    if (filters.search) {
      query = query.or(`reference.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }

    return {
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };

  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error);
    return {
      success: false,
      error: error.message,
      orders: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 }
    };
  }
};

/**
 * Obtiene una orden específica por ID
 * @param {String} orderId - UUID de la orden
 * @returns {Promise<Object>} - Orden con todos sus detalles
 */
export const getOrderById = async (orderId) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        shipping_info(*),
        payments(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error al obtener orden:', error);
      throw error;
    }

    return {
      success: true,
      order
    };

  } catch (error) {
    console.error('❌ Error al obtener orden:', error);
    return {
      success: false,
      error: error.message,
      order: null
    };
  }
};

/**
 * Actualiza el estado de una orden
 * @param {String} orderId - UUID de la orden
 * @param {String} newStatus - Nuevo estado (pendiente, enviado, entregado, cancelado)
 * @param {String} trackingNumber - Número de guía (opcional)
 * @returns {Promise<Object>} - Resultado de la actualización
 */
export const updateOrderStatus = async (orderId, newStatus, trackingNumber = null) => {
  try {
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (newStatus === 'entregado') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }

    // Actualizar tracking number en shipping_info si se proporciona
    if (trackingNumber) {
      await supabase
        .from('shipping_info')
        .update({ tracking_number: trackingNumber })
        .eq('order_id', orderId);
    }

    console.log('✅ Estado actualizado:', order);

    return {
      success: true,
      order,
      message: 'Estado actualizado exitosamente'
    };

  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtiene estadísticas de órdenes para el dashboard
 * @returns {Promise<Object>} - Estadísticas agregadas
 */
export const getOrderStats = async () => {
  try {
    // Total de órdenes hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: todayCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Órdenes pendientes contra entrega
    const { count: pendingContraEntrega } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendiente')
      .eq('shipping_type', 'medellin_contra_entrega');

    // Total vendido hoy
    const { data: todaySales } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', today.toISOString());

    const totalSalesToday = todaySales?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

    // Total de órdenes por estado
    const { data: statusCounts } = await supabase
      .from('orders')
      .select('status')
      .gte('created_at', today.toISOString());

    const statusBreakdown = {
      pendiente: 0,
      enviado: 0,
      entregado: 0,
      cancelado: 0
    };

    statusCounts?.forEach(order => {
      if (statusBreakdown[order.status] !== undefined) {
        statusBreakdown[order.status]++;
      }
    });

    return {
      success: true,
      stats: {
        todayCount: todayCount || 0,
        pendingContraEntrega: pendingContraEntrega || 0,
        totalSalesToday,
        statusBreakdown
      }
    };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return {
      success: false,
      error: error.message,
      stats: {
        todayCount: 0,
        pendingContraEntrega: 0,
        totalSalesToday: 0,
        statusBreakdown: { pendiente: 0, enviado: 0, entregado: 0, cancelado: 0 }
      }
    };
  }
};

/**
 * Cancela una orden
 * @param {String} orderId - UUID de la orden
 * @param {String} reason - Razón de la cancelación
 * @returns {Promise<Object>} - Resultado de la cancelación
 */
export const cancelOrder = async (orderId, reason = '') => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelado',
        notes: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error al cancelar orden:', error);
      throw error;
    }

    console.log('✅ Orden cancelada:', order);

    return {
      success: true,
      order,
      message: 'Orden cancelada exitosamente'
    };

  } catch (error) {
    console.error('❌ Error al cancelar orden:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  createOrder,
  generateOrderReference,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  cancelOrder
};
