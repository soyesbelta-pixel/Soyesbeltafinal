-- =============================================
-- ESBELTA E-COMMERCE - ORDERS SCHEMA
-- =============================================
-- Tablas para gestionar pedidos, items y envíos
-- Especialmente diseñado para pedidos contra entrega en Medellín
-- =============================================

-- Tabla principal de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL, -- Referencia única del pedido (ej: ORD-20240110-001)

  -- Información del cliente
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Montos
  subtotal DECIMAL(10,2) NOT NULL, -- Subtotal de productos
  shipping_cost DECIMAL(10,2) NOT NULL, -- Costo de envío
  total DECIMAL(10,2) NOT NULL, -- Total a pagar

  -- Estado y tipo de pedido
  status TEXT NOT NULL DEFAULT 'pendiente', -- pendiente, enviado, entregado, cancelado
  shipping_type TEXT NOT NULL, -- 'medellin_contra_entrega' o 'standard'
  payment_method TEXT NOT NULL, -- 'contra_entrega' o 'online'

  -- Metadatos
  notes TEXT, -- Notas adicionales
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE -- Fecha de entrega
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_type ON orders(shipping_type);

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Información del producto
  product_id TEXT NOT NULL, -- ID del producto en el sistema
  product_name TEXT NOT NULL, -- Nombre del producto
  product_image TEXT, -- URL de la imagen del producto

  -- Variantes
  size TEXT, -- Talla (XS, S, M, L, XL, 2XL)
  color TEXT, -- Color (negro, beige, cocoa, etc.)

  -- Cantidades y precios
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL, -- Precio unitario
  subtotal DECIMAL(10,2) NOT NULL, -- quantity * unit_price

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Tabla de información de envío
CREATE TABLE IF NOT EXISTS shipping_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,

  -- Datos del destinatario
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Dirección completa
  full_address TEXT NOT NULL,
  department TEXT NOT NULL, -- Departamento de Colombia
  city TEXT NOT NULL, -- Ciudad
  postal_code TEXT,

  -- Detalles de envío
  is_medellin BOOLEAN DEFAULT FALSE, -- Indica si es envío en Medellín
  shipping_cost DECIMAL(10,2) NOT NULL,
  tracking_number TEXT, -- Número de guía de envío (para standard)

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE -- Fecha de entrega
);

-- Índices para shipping_info
CREATE INDEX IF NOT EXISTS idx_shipping_info_order_id ON shipping_info(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_info_is_medellin ON shipping_info(is_medellin);

-- Tabla de pagos (para integración con ePayco)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Información de ePayco
  epayco_reference TEXT UNIQUE, -- Referencia de ePayco
  epayco_transaction_id TEXT, -- ID de transacción de ePayco
  approval_code TEXT, -- Código de aprobación

  -- Detalles del pago
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'COP',
  status TEXT NOT NULL, -- 'approved', 'rejected', 'pending', 'failed'
  payment_method TEXT, -- Método de pago usado (tarjeta, PSE, efectivo, etc.)
  transaction_date TIMESTAMP WITH TIME ZONE,

  -- Respuesta completa de ePayco para auditoría
  raw_response JSONB,

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para payments
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_epayco_reference ON payments(epayco_reference);

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Habilitar Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política: Admins pueden ver y modificar todo
CREATE POLICY "Admins can do everything on orders" ON orders
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on order_items" ON order_items
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on shipping_info" ON shipping_info
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on payments" ON payments
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Servicio (service_role) puede hacer todo sin autenticación
-- Esto es necesario para que la aplicación pueda insertar órdenes desde el frontend
CREATE POLICY "Service role can do everything on orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on order_items" ON order_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on shipping_info" ON shipping_info
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on payments" ON payments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE orders IS 'Tabla principal de pedidos del e-commerce Esbelta';
COMMENT ON TABLE order_items IS 'Items individuales de cada pedido';
COMMENT ON TABLE shipping_info IS 'Información detallada de envío para cada pedido';
COMMENT ON TABLE payments IS 'Registro de pagos procesados por ePayco';

COMMENT ON COLUMN orders.shipping_type IS 'Tipo de envío: medellin_contra_entrega (pago al recibir) o standard (envío nacional)';
COMMENT ON COLUMN orders.payment_method IS 'Método de pago: contra_entrega (efectivo al recibir) o online (pagado por ePayco)';
COMMENT ON COLUMN orders.status IS 'Estado del pedido: pendiente, enviado, entregado, cancelado';
COMMENT ON COLUMN shipping_info.is_medellin IS 'TRUE si el pedido es para Medellín con contra entrega';

-- =============================================
-- DATOS DE EJEMPLO (OPCIONAL - COMENTADO)
-- =============================================

/*
-- Ejemplo de pedido contra entrega en Medellín
INSERT INTO orders (reference, customer_email, customer_name, customer_phone, subtotal, shipping_cost, total, status, shipping_type, payment_method)
VALUES ('ORD-20240110-001', 'cliente@ejemplo.com', 'María García', '3001234567', 89990.00, 10000.00, 99990.00, 'pendiente', 'medellin_contra_entrega', 'contra_entrega');

-- Obtener el ID del pedido creado
WITH last_order AS (
  SELECT id FROM orders WHERE reference = 'ORD-20240110-001'
)
INSERT INTO order_items (order_id, product_id, product_name, size, color, quantity, unit_price, subtotal)
SELECT id, 'kit-short-invisible', 'Kit Short Invisible Completo', 'M', 'negro', 1, 89990.00, 89990.00
FROM last_order;

-- Información de envío
WITH last_order AS (
  SELECT id FROM orders WHERE reference = 'ORD-20240110-001'
)
INSERT INTO shipping_info (order_id, full_name, email, phone, full_address, department, city, postal_code, is_medellin, shipping_cost)
SELECT id, 'María García', 'cliente@ejemplo.com', '3001234567', 'Calle 123 #45-67, Apto 801', 'Antioquia', 'Medellín', '050001', TRUE, 10000.00
FROM last_order;
*/

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
