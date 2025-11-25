-- Script de migración: Agregar columna is_antioquia a shipping_info
-- Este script es seguro de ejecutar múltiples veces (idempotente)

-- Agregar columna is_antioquia si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='shipping_info'
        AND column_name='is_antioquia'
    ) THEN
        ALTER TABLE shipping_info
        ADD COLUMN is_antioquia BOOLEAN DEFAULT FALSE;

        RAISE NOTICE 'Columna is_antioquia agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna is_antioquia ya existe';
    END IF;
END $$;

-- Actualizar registros existentes: si is_medellin es true, entonces is_antioquia también debe ser true
UPDATE shipping_info
SET is_antioquia = TRUE
WHERE is_medellin = TRUE AND (is_antioquia IS NULL OR is_antioquia = FALSE);

-- Verificar resultado
SELECT
    COUNT(*) as total_registros,
    COUNT(CASE WHEN is_antioquia = TRUE THEN 1 END) as con_antioquia,
    COUNT(CASE WHEN is_medellin = TRUE THEN 1 END) as con_medellin
FROM shipping_info;
