import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, Clock, CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';

const PaymentGateway = () => {
  // Métodos de pago disponibles con ePayco en Colombia
  const paymentMethods = [
    {
      name: 'Tarjetas de Crédito',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
      description: 'Visa, Mastercard, American Express'
    },
    {
      name: 'Tarjetas Débito',
      image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
      description: 'Débito Visa y Mastercard'
    },
    {
      name: 'PSE',
      image: 'https://multimedia.epayco.co/dashboard/btns/epayco/pse.png',
      description: 'Transferencia bancaria'
    },
    {
      name: 'Efectivo',
      image: 'https://multimedia.epayco.co/dashboard/btns/epayco/efectivo.png',
      description: 'Baloto, Efecty, Gana'
    },
    {
      name: 'Daviplata',
      image: 'https://multimedia.epayco.co/dashboard/btns/epayco/daviplata.png',
      description: 'Billetera móvil'
    },
    {
      name: 'SafetyPay',
      image: 'https://multimedia.epayco.co/dashboard/btns/epayco/safetypay.png',
      description: 'Pago seguro internacional'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Pago 100% Seguro',
      description: 'Encriptación SSL de 256 bits para proteger tus datos'
    },
    {
      icon: Clock,
      title: 'Proceso Rápido',
      description: 'Completa tu compra en menos de 2 minutos'
    },
    {
      icon: Lock,
      title: 'Privacidad Garantizada',
      description: 'Nunca almacenamos información de tarjetas'
    },
    {
      icon: CheckCircle,
      title: 'Verificación 3D Secure',
      description: 'Doble autenticación para mayor seguridad'
    }
  ];

  return (
    <section id="pagos" className="py-16 bg-gradient-to-br from-esbelta-cream to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-esbelta-chocolate mb-4">
            Pasarela de Pago Segura
          </h2>
          <p className="text-esbelta-chocolate-light max-w-2xl mx-auto">
            Realiza tus compras de forma rápida y segura con las principales tarjetas de crédito y débito
          </p>
        </motion.div>

        {/* Payment Methods */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-center gap-3 mb-8">
              <img
                src="https://multimedia.epayco.co/dashboard/epayco-logo.png"
                alt="ePayco"
                className="h-8"
              />
              <h3 className="text-xl font-bold text-esbelta-chocolate">
                Métodos de Pago Disponibles
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-white rounded-lg p-3 w-full h-16 flex items-center justify-center">
                      <img
                        src={method.image}
                        alt={method.name}
                        className="h-10 object-contain"
                      />
                    </div>
                    <h4 className="font-bold text-esbelta-chocolate text-sm">
                      {method.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ePayco Trust Badge */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Pagos procesados de forma segura por
              </p>
              <img
                src="https://multimedia.epayco.co/dashboard/epayco-logo.png"
                alt="Powered by ePayco"
                className="h-6 mx-auto opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-esbelta-terracotta to-esbelta-chocolate flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-esbelta-chocolate mb-2">{feature.title}</h3>
              <p className="text-sm text-esbelta-chocolate-light">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 bg-esbelta-sand/10 rounded-full px-6 py-3">
            <CreditCard className="w-6 h-6 text-esbelta-sand" />
            <span className="text-esbelta-chocolate font-medium">
              Procesamiento seguro con certificación PCI DSS
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentGateway;