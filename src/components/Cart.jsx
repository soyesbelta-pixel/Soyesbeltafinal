import { motion } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { useState, useEffect } from 'react';
import EPaycoCheckout from './EPaycoCheckout';
import { getDepartments, getCitiesByDepartment, isMedellinCity, isAntioquiaCity, SHIPPING_COSTS } from '../data/colombianLocations';
import { createOrder } from '../services/orderService';

const Cart = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  const [discount, setDiscount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Sistema de pasos multi-step
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart Review, 2: Shipping Info

  // Información de envío
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    fullAddress: '',
    department: '',
    city: '',
    postalCode: ''
  });

  const [shippingErrors, setShippingErrors] = useState({});
  const [shippingCost, setShippingCost] = useState(0);
  const [isMedellin, setIsMedellin] = useState(false); // Legacy - mantener por compatibilidad
  const [isAntioquia, setIsAntioquia] = useState(false); // Nueva variable para Antioquia
  const [availableCities, setAvailableCities] = useState([]);

  const cartTotalWithTax = getCartTotal(); // Total del carrito con impuesto incluido (precio de productos)

  // Calcular el subtotal sin impuesto (precio base)
  // Los precios de productos ya incluyen 4% de impuesto, entonces: precio = base * 1.04
  // Para obtener base: base = precio / 1.04
  const subtotal = cartTotalWithTax / 1.04;
  const taxAmount = cartTotalWithTax - subtotal; // 4% de impuesto

  // Calcular descuento por volumen (sobre el total con impuesto)
  useEffect(() => {
    if (cartTotalWithTax > 500000) {
      setDiscount(0.15); // 15% descuento
    } else if (cartTotalWithTax > 300000) {
      setDiscount(0.10); // 10% descuento
    } else if (cartTotalWithTax > 200000) {
      setDiscount(0.05); // 5% descuento
    } else {
      setDiscount(0);
    }
  }, [cartTotalWithTax]);

  const discountAmount = cartTotalWithTax * discount;
  const total = cartTotalWithTax - discountAmount + shippingCost;

  // Actualizar ciudades disponibles cuando cambia el departamento
  useEffect(() => {
    if (shippingInfo.department) {
      const cities = getCitiesByDepartment(shippingInfo.department);
      setAvailableCities(cities);
      // Resetear ciudad si cambia departamento
      setShippingInfo(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [shippingInfo.department]);

  // Actualizar costo de envío cuando cambia la ciudad
  useEffect(() => {
    if (shippingInfo.city) {
      if (isAntioquiaCity(shippingInfo.city, shippingInfo.department)) {
        setShippingCost(SHIPPING_COSTS.ANTIOQUIA_CONTRA_ENTREGA);
        setIsAntioquia(true);
        setIsMedellin(isMedellinCity(shippingInfo.city)); // Legacy compatibility
      } else {
        setShippingCost(SHIPPING_COSTS.OTRAS_CIUDADES);
        setIsAntioquia(false);
        setIsMedellin(false);
      }
    } else {
      setShippingCost(0);
      setIsAntioquia(false);
      setIsMedellin(false);
    }
  }, [shippingInfo.city, shippingInfo.department]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Pago exitoso:', paymentData);
    setPaymentSuccess(true);
    setPaymentError(null);

    // Mostrar notificación de éxito
    useStore.getState().addNotification({
      type: 'success',
      message: `¡Pago exitoso! Referencia: ${paymentData.transactionId}`,
    });

    // Limpiar carrito después del pago
    setTimeout(() => {
      clearCart();
      onClose();
    }, 3000);
  };

  const handlePaymentError = (errorData) => {
    console.error('Error en el pago:', errorData);
    setPaymentError(errorData.message);
    setPaymentSuccess(false);

    // Mostrar notificación de error
    useStore.getState().addNotification({
      type: 'error',
      message: `Error en el pago: ${errorData.message}`,
    });
  };

  // Validar formulario de envío
  const validateShippingInfo = () => {
    const errors = {};

    if (!shippingInfo.fullName.trim()) {
      errors.fullName = 'El nombre completo es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingInfo.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!emailRegex.test(shippingInfo.email)) {
      errors.email = 'Email inválido';
    }

    const phoneRegex = /^3\d{9}$/;
    if (!shippingInfo.phone.trim()) {
      errors.phone = 'El teléfono es requerido';
    } else if (!phoneRegex.test(shippingInfo.phone.replace(/\s/g, ''))) {
      errors.phone = 'Formato: 3XX XXX XXXX (10 dígitos)';
    }

    if (!shippingInfo.fullAddress.trim()) {
      errors.fullAddress = 'La dirección es requerida';
    }

    if (!shippingInfo.department) {
      errors.department = 'El departamento es requerido';
    }

    if (!shippingInfo.city) {
      errors.city = 'La ciudad es requerida';
    }

    if (!shippingInfo.postalCode.trim()) {
      errors.postalCode = 'El código postal es requerido';
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Avanzar al paso 2
  const goToShippingStep = () => {
    setCurrentStep(2);
  };

  // Volver al paso 1
  const goToCartStep = () => {
    setCurrentStep(1);
    setShippingErrors({});
  };

  // Manejar contra entrega (Medellín)
  const handleCashOnDelivery = async () => {
    if (!validateShippingInfo()) {
      return;
    }

    setIsProcessingOrder(true);
    setPaymentError(null);

    try {
      // DEBUG: Verificar datos antes de enviar
      console.log('🛒 Cart - shippingInfo ANTES de enviar:', shippingInfo);
      console.log('🛒 Cart - isAntioquia:', isAntioquia);
      console.log('🛒 Cart - isMedellin:', isMedellin);

      // Preparar datos del pedido
      const orderData = {
        cart,
        shippingInfo,
        subtotal: cartTotalWithTax - discountAmount,
        shippingCost,
        total,
        isMedellin: isMedellin, // Legacy compatibility
        isAntioquia: isAntioquia,
        paymentMethod: 'contra_entrega'
      };

      console.log('🛒 Cart - orderData completo:', orderData);

      // Crear orden en Supabase y enviar email
      const result = await createOrder(orderData);

      if (result.success) {
        setPaymentSuccess(true);

        useStore.getState().addNotification({
          type: 'success',
          message: `¡Pedido confirmado! Referencia: ${result.reference}`,
        });

        // Limpiar carrito y cerrar después de 3 segundos
        setTimeout(() => {
          clearCart();
          onClose();
        }, 3000);
      } else {
        throw new Error(result.error || 'Error al crear el pedido');
      }

    } catch (error) {
      console.error('Error al procesar pedido:', error);
      setPaymentError(error.message || 'Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');

      useStore.getState().addNotification({
        type: 'error',
        message: 'Error al procesar el pedido',
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Manejar pago con pasarela
  const handleGatewayPayment = () => {
    if (!validateShippingInfo()) {
      return;
    }
    // El componente EPaycoCheckout manejará el pago
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-esbelta-terracotta" />
                <h2 className="text-xl font-bold text-esbelta-chocolate">
                  {currentStep === 1 ? 'Mi Carrito' : 'Información de Envío'}
                </h2>
                {cart.length > 0 && currentStep === 1 && (
                  <span className="bg-esbelta-cream text-esbelta-chocolate text-sm px-2 py-1 rounded-full">
                    {cart.length} items
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-esbelta-cream rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Indicator */}
            {cart.length > 0 && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs font-semibold ${currentStep === 1 ? 'text-esbelta-terracotta' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-esbelta-terracotta text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span>Carrito</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200"></div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${currentStep === 2 ? 'text-esbelta-terracotta' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-esbelta-terracotta text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span>Envío</span>
                </div>
              </div>
            )}
          </div>

          {/* Content - cambio dinámico según el paso */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
                <button
                  onClick={onClose}
                  className="bg-esbelta-beige hover:bg-esbelta-sand text-esbelta-chocolate font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : currentStep === 1 ? (
              // PASO 1: Revisión del Carrito
              <div className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-esbelta-cream rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-esbelta-chocolate">{item.name}</h3>
                        <p className="text-xs text-gray-600">Talla: {item.size}</p>
                        <p className="text-esbelta-terracotta font-bold mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-600">Cantidad:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-esbelta-sand hover:border-esbelta-terracotta flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-esbelta-sand hover:border-esbelta-terracotta flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // PASO 2: Formulario de Información de Envío
              <div className="space-y-4">
                {/* Nombre Completo */}
                <div>
                  <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                      shippingErrors.fullName ? 'border-red-400' : 'border-line'
                    }`}
                    placeholder="María García"
                  />
                  {shippingErrors.fullName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {shippingErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                      shippingErrors.email ? 'border-red-400' : 'border-line'
                    }`}
                    placeholder="maria@ejemplo.com"
                  />
                  {shippingErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {shippingErrors.email}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                      shippingErrors.phone ? 'border-red-400' : 'border-line'
                    }`}
                    placeholder="3XX XXX XXXX"
                  />
                  {shippingErrors.phone && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {shippingErrors.phone}
                    </p>
                  )}
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                    Departamento *
                  </label>
                  <select
                    value={shippingInfo.department}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, department: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                      shippingErrors.department ? 'border-red-400' : 'border-line'
                    }`}
                  >
                    <option value="">Selecciona un departamento</option>
                    {getDepartments().map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {shippingErrors.department && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {shippingErrors.department}
                    </p>
                  )}
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    disabled={!shippingInfo.department}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                      shippingErrors.city ? 'border-red-400' : 'border-line'
                    } ${!shippingInfo.department ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Selecciona una ciudad</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {shippingErrors.city && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {shippingErrors.city}
                    </p>
                  )}
                </div>

                {/* Dirección Completa */}
                <div>
                  <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                    Dirección Completa *
                  </label>
                  <textarea
                    value={shippingInfo.fullAddress}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullAddress: e.target.value })}
                    rows="2"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                      shippingErrors.fullAddress ? 'border-red-400' : 'border-line'
                    }`}
                    placeholder="Calle 123 #45-67, Apto 801"
                  />
                  {shippingErrors.fullAddress && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {shippingErrors.fullAddress}
                    </p>
                  )}
                </div>

                {/* Código Postal */}
                <div>
                  <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                      shippingErrors.postalCode ? 'border-red-400' : 'border-line'
                    }`}
                    placeholder="050001"
                  />
                  {shippingErrors.postalCode && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {shippingErrors.postalCode}
                    </p>
                  )}
                </div>

                {/* Llamado a la Acción - Envío Gratis */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: '#F88379' }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-white" />
                    <span className="text-lg font-bold text-white">¡Envío GRATIS!</span>
                  </div>
                  <p className="text-sm text-white font-semibold">
                    En compras superiores a $200,000 COP
                  </p>
                </motion.div>

                {/* Alert de Costo de Envío */}
                {shippingInfo.city && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                      isAntioquia
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-esbelta-cream text-esbelta-chocolate border border-esbelta-sand'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      {isAntioquia ? (
                        <>
                          <p className="font-semibold">Contra Entrega en Antioquia</p>
                          <p className="text-xs mt-1">Pagarás {formatPrice(shippingCost)} al recibir tu pedido. No necesitas pagar ahora.</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">Envío Nacional</p>
                          <p className="text-xs mt-1">Costo de envío: {formatPrice(shippingCost)}. Se incluirá en el total.</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer con totales y acciones según el paso */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Discount Badge */}
              {discount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-green-100 text-green-700 p-3 rounded-lg text-sm"
                >
                  🎉 ¡Felicidades! Tienes {(discount * 100).toFixed(0)}% de descuento por volumen
                </motion.div>
              )}

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {/* Impuesto (4%) */}
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Impuesto (4%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento por volumen ({(discount * 100).toFixed(0)}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Envío
                  </span>
                  <span className={shippingCost === 0 ? 'text-gray-400' : 'text-esbelta-chocolate font-semibold'}>
                    {shippingCost === 0 ? 'Por calcular' : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-esbelta-terracotta">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions - Paso 1: Botón para ir a envío */}
              {currentStep === 1 && (
                <div className="space-y-2">
                  <button
                    onClick={goToShippingStep}
                    className="w-full bg-esbelta-terracotta hover:bg-esbelta-rose text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Continuar a Información de Envío</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    Continuar Comprando
                  </button>
                </div>
              )}

              {/* Actions - Paso 2: Botón para finalizar (Medellín o Pasarela) */}
              {currentStep === 2 && (
                <div className="space-y-2">
                  {paymentSuccess ? (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
                      <p className="font-bold">✓ ¡Pedido Confirmado!</p>
                      <p className="text-sm">Te contactaremos pronto...</p>
                    </div>
                  ) : paymentError ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center text-sm">
                      {paymentError}
                    </div>
                  ) : isAntioquia ? (
                    // Antioquia: Contra Entrega
                    <button
                      onClick={handleCashOnDelivery}
                      disabled={isProcessingOrder}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessingOrder ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Confirmar Pedido (Contra Entrega)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    // Otras ciudades: ePayco
                    <EPaycoCheckout
                      cartItems={cart}
                      total={total}
                      customerInfo={{
                        name: shippingInfo.fullName,
                        email: shippingInfo.email,
                        phone: shippingInfo.phone,
                        address: shippingInfo.fullAddress,
                        document: ''
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onClose={onClose}
                      onBeforeOpen={validateShippingInfo}
                    />
                  )}

                  <button
                    onClick={goToCartStep}
                    className="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al Carrito</span>
                  </button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 text-xs text-gray-600">
                <span>🔒 Pago Seguro</span>
                <span>📦 Envío Express</span>
                <span>↩️ Devolución Fácil</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Cart;
