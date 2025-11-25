-- ============================================
-- VIRTUAL TRY-ON LEADS - VERSIÓN SIMPLE
-- Solo captura: nombre y WhatsApp
-- ============================================

-- Eliminar tabla anterior si existe (CUIDADO: esto borra datos)
DROP TABLE IF EXISTS virtual_tryon_leads CASCADE;

-- Crear tabla super simple
CREATE TABLE virtual_tryon_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas
CREATE INDEX idx_vto_leads_created ON virtual_tryon_leads(created_at DESC);

-- DESHABILITAR RLS completamente
ALTER TABLE virtual_tryon_leads DISABLE ROW LEVEL SECURITY;

-- ============================================
-- FIN - Listo para usar
-- ============================================
