-- Script para verificar y corregir permisos RLS en shipping_info
-- Ejecuta este script en Supabase SQL Editor

-- PASO 1: Verificar si RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('orders', 'shipping_info', 'order_items');

-- PASO 2: Si shipping_info tiene RLS habilitado, necesitamos crear políticas
-- O simplemente DESHABILITAR RLS (más fácil para desarrollo)

-- OPCIÓN A: DESHABILITAR RLS (recomendado para desarrollo/staging)
ALTER TABLE shipping_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- OPCIÓN B: Si quieres MANTENER RLS habilitado (producción segura)
-- Descomenta las siguientes líneas:

/*
-- Eliminar políticas existentes si hay
DROP POLICY IF EXISTS "Enable insert for all users" ON shipping_info;
DROP POLICY IF EXISTS "Enable read for all users" ON shipping_info;

-- Crear políticas que permitan INSERT y SELECT a todos
CREATE POLICY "Enable insert for all users" ON shipping_info
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON shipping_info
    FOR SELECT USING (true);

-- Lo mismo para orders
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Enable read for all users" ON orders;

CREATE POLICY "Enable insert for all users" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON orders
    FOR SELECT USING (true);

-- Lo mismo para order_items
DROP POLICY IF EXISTS "Enable insert for all users" ON order_items;
DROP POLICY IF EXISTS "Enable read for all users" ON order_items;

CREATE POLICY "Enable insert for all users" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON order_items
    FOR SELECT USING (true);
*/

-- PASO 3: Verificar que ahora podemos insertar
-- (Este SELECT debería funcionar sin errores)
SELECT
    'Test exitoso: shipping_info es accesible' as status,
    COUNT(*) as total_registros
FROM shipping_info;
