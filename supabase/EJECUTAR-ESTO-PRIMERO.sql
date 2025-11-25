-- ============================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON virtual_tryon_leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON virtual_tryon_leads;
DROP POLICY IF EXISTS "Anyone can update leads" ON virtual_tryon_leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON virtual_tryon_leads;
DROP POLICY IF EXISTS "Public can insert leads" ON virtual_tryon_leads;
DROP POLICY IF EXISTS "Public can update leads" ON virtual_tryon_leads;
DROP POLICY IF EXISTS "Service role can manage leads" ON virtual_tryon_leads;

-- ============================================
-- PASO 2: DESHABILITAR RLS TEMPORALMENTE
-- ============================================
ALTER TABLE virtual_tryon_leads DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 3: HABILITAR RLS NUEVAMENTE
-- ============================================
ALTER TABLE virtual_tryon_leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 4: CREAR POLÍTICA SUPER PERMISIVA PARA INSERT
-- ============================================
CREATE POLICY "allow_all_insert"
  ON virtual_tryon_leads
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- PASO 5: CREAR POLÍTICA SUPER PERMISIVA PARA UPDATE
-- ============================================
CREATE POLICY "allow_all_update"
  ON virtual_tryon_leads
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- PASO 6: CREAR POLÍTICA PARA SERVICE ROLE (ADMIN)
-- ============================================
CREATE POLICY "service_role_all"
  ON virtual_tryon_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
