import { X, ArrowLeft, ArrowRight, Package, Truck, ShoppingCart, CreditCard, Camera, Sparkles } from 'lucide-react';
import { getDepartments } from '../data/colombianLocations';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
const AVAILABLE_COLORS = [
  {
    value: 'negro',
    label: 'Negro',
    colorClass: 'bg-black',
    modelImage: '/landing-short-invisible/images/productos/modelo-negro.jpg'
  },
  {
    value: 'beige',
    label: 'Beige',
    colorClass: 'bg-[#F5E6D3]',
    modelImage: '/landing-short-invisible/images/productos/modelo-beige.png'
  },
  {
    value: 'cocoa',
    label: 'Cocoa',
    colorClass: 'bg-[#8B4513]',
    modelImage: '/landing-short-invisible/images/productos/modelo-cocoa.jpg'
  }
];

const CartLandingModal = ({
  showCart,
  onClose,
  cartStep,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  confirmarSeleccion,
  shippingInfo,
  setShippingInfo,
  shippingErrors,
  availableCities,
  isMedellin,
  isAntioquia,
  shippingCost,
  handleContinueToPayment,
  handleConfirmContraEntrega,
  isProcessingOrder,
  orderSuccess,
  orderError,
  setCartStep,
  cart,
  calcularTotal,
  calcularTotalConEnvio,
  onProceedToCheckout,
  onOpenVirtualTryOn
}) => {
  if (!showCart) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = calcularTotal();
  const costoEnvioFinal = subtotal > 200000 ? 0 : shippingCost;
  const total = calcularTotalConEnvio();

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-heading text-esbelta-chocolate flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-esbelta-terracotta" />
              {cartStep === 1 && 'Selecciona tu Kit'}
              {cartStep === 2 && 'Información de Envío'}
              {cartStep === 3 && 'Resumen de Compra'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Paso {cartStep} de 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-esbelta-cream rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step <= cartStep
                    ? 'bg-esbelta-terracotta text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* PASO 1: Selección de Talla y Color */}
          {cartStep === 1 && (
            <div className="space-y-6">
              {/* Producto */}
              <div className="bg-esbelta-cream p-6 rounded-xl">
                <div className="flex gap-4 items-center mb-4">
                  <img
                    src="/landing-short-invisible/images/productos/short-invisible.jpg"
                    alt="Kit Short Invisible Completo"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-heading text-xl text-esbelta-chocolate font-bold">
                      Kit Short Invisible Completo
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Short + Exfoliante + Aceite de Fenogreco
                    </p>
                    <p className="text-2xl font-bold text-esbelta-coral mt-2">
                      {formatPrice(89990)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selección de Talla */}
              <div>
                <label className="block text-sm font-semibold text-esbelta-chocolate mb-3">
                  Selecciona tu talla
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-esbelta-terracotta bg-esbelta-terracotta text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-esbelta-terracotta'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selección de Color con Imágenes de Modelos */}
              <div>
                <label className="block text-sm font-semibold text-esbelta-chocolate mb-3">
                  Selecciona tu color
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`p-2 rounded-lg border-2 transition-all overflow-hidden ${
                        selectedColor === color.value
                          ? 'border-esbelta-terracotta bg-gray-50 ring-2 ring-esbelta-terracotta'
                          : 'border-gray-300 bg-white hover:border-esbelta-terracotta'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={color.modelImage}
                          alt={`Short ${color.label}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          {color.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Probador Virtual */}
              <div className="bg-[#FEF5F6] p-4 rounded-xl border-2 border-[#E64A7B]">
                <div className="flex items-center gap-3 mb-3">
                  <Camera className="w-6 h-6 text-[#E64A7B]" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#C93D62]">¿Quieres ver cómo te queda?</h4>
                    <p className="text-xs text-[#E64A7B]">Prueba el short virtualmente con IA</p>
                  </div>
                </div>
                <button
                  onClick={onOpenVirtualTryOn}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-[#E64A7B] hover:bg-[#C93D62] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Probar Virtualmente
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: Formulario de Envío */}
          {cartStep === 2 && (
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
                  <p className="text-red-600 text-xs mt-1">{shippingErrors.fullName}</p>
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
                  <p className="text-red-600 text-xs mt-1">{shippingErrors.email}</p>
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
                  <p className="text-red-600 text-xs mt-1">{shippingErrors.phone}</p>
                )}
              </div>

              {/* Departamento y Ciudad en Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="text-red-600 text-xs mt-1">{shippingErrors.department}</p>
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
                    <p className="text-red-600 text-xs mt-1">{shippingErrors.city}</p>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-semibold text-esbelta-chocolate mb-2">
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  value={shippingInfo.fullAddress}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullAddress: e.target.value })}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta transition-all ${
                    shippingErrors.fullAddress ? 'border-red-400' : 'border-line'
                  }`}
                  placeholder="Calle 123 #45-67, Apto 801"
                />
                {shippingErrors.fullAddress && (
                  <p className="text-red-600 text-xs mt-1">{shippingErrors.fullAddress}</p>
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
                  <p className="text-red-600 text-xs mt-1">{shippingErrors.postalCode}</p>
                )}
              </div>

              {/* Banner Envío Gratis */}
              {subtotal > 200000 && (
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F88379' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-white" />
                    <span className="text-lg font-bold text-white">¡Envío GRATIS!</span>
                  </div>
                  <p className="text-sm text-white font-semibold">
                    En compras superiores a $200,000 COP
                  </p>
                </div>
              )}

              {/* Info de Envío según Ciudad */}
              {shippingInfo.city && (
                <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                  isAntioquia
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-esbelta-cream text-esbelta-chocolate border border-esbelta-sand'
                }`}>
                  <Truck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    {isAntioquia ? (
                      <>
                        <p className="font-semibold">Contra Entrega en Antioquia</p>
                        <p className="text-xs mt-1">Pagas al recibir el kit y el costo de envío es 10.000 COP más el valor del producto</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">Envío Nacional</p>
                        <p className="text-xs mt-1">Costo de envío: {formatPrice(costoEnvioFinal)}. Se incluirá en el total.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 3: Resumen */}
          {cartStep === 3 && cart.length > 0 && (
            <div className="space-y-6">
              {/* Producto Seleccionado */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Tu Pedido</h3>
                {cart.map((item, index) => (
                  <div key={index} className="bg-esbelta-cream p-4 rounded-xl flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-esbelta-chocolate">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Talla: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-esbelta-coral">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Información de Envío */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Información de Envío</h3>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                  <p><strong>Nombre:</strong> {shippingInfo.fullName}</p>
                  <p><strong>Email:</strong> {shippingInfo.email}</p>
                  <p><strong>Teléfono:</strong> {shippingInfo.phone}</p>
                  <p><strong>Dirección:</strong> {shippingInfo.fullAddress}</p>
                  <p><strong>Ciudad:</strong> {shippingInfo.city}, {shippingInfo.department}</p>
                  <p><strong>Código Postal:</strong> {shippingInfo.postalCode}</p>
                </div>
              </div>

              {/* Resumen de Pago */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Resumen de Pago</h3>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className={costoEnvioFinal === 0 ? 'text-green-600 font-semibold' : ''}>
                      {costoEnvioFinal === 0 ? 'GRATIS' : formatPrice(costoEnvioFinal)}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-esbelta-coral">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con Botones */}
        <div className="border-t p-4 space-y-2">
          {/* Botón Siguiente/Confirmar */}
          {cartStep === 1 && (
            <button
              onClick={confirmarSeleccion}
              className="w-full bg-esbelta-terracotta hover:bg-esbelta-rose text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Continuar a Información de Envío</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {cartStep === 2 && (
            <>
              {orderSuccess ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
                  <p className="font-bold">✓ ¡Pedido Confirmado!</p>
                  <p className="text-sm">Recibirás un email con los detalles...</p>
                </div>
              ) : orderError ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center text-sm">
                  {orderError}
                </div>
              ) : isAntioquia ? (
                // Antioquia: Botón Confirmar Pedido (Contra Entrega)
                <button
                  onClick={handleConfirmContraEntrega}
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
                      <Package className="w-5 h-5" />
                      <span>Confirmar Pedido (Contra Entrega)</span>
                    </>
                  )}
                </button>
              ) : (
                // Otras ciudades: Continuar al paso 3 (pago online)
                <button
                  onClick={handleContinueToPayment}
                  className="w-full bg-esbelta-terracotta hover:bg-esbelta-rose text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continuar con la Compra</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          {cartStep === 3 && (
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-esbelta-terracotta hover:bg-esbelta-rose text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceder al Pago</span>
              <CreditCard className="w-5 h-5" />
            </button>
          )}

          {/* Botón Atrás (solo en pasos 2 y 3) */}
          {cartStep > 1 && (
            <button
              onClick={() => setCartStep(cartStep - 1)}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartLandingModal;
