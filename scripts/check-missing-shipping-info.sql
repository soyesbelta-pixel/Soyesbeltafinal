-- Script para verificar órdenes con información de envío faltante
-- Este script NO modifica datos, solo muestra diagnóstico

-- 1. Órdenes que NO tienen registro en shipping_info
SELECT
    o.id,
    o.reference,
    o.customer_name,
    o.customer_email,
    o.created_at,
    'Sin registro shipping_info' as problema
FROM orders o
LEFT JOIN shipping_info si ON o.id = si.order_id
WHERE si.order_id IS NULL
ORDER BY o.created_at DESC;

-- 2. Registros en shipping_info con campos vacíos o NULL
SELECT
    o.reference,
    si.full_address,
    si.city,
    si.department,
    si.postal_code,
    si.is_medellin,
    si.is_antioquia,
    CASE
        WHEN si.full_address IS NULL OR si.full_address = '' THEN 'Dirección vacía'
        WHEN si.city IS NULL OR si.city = '' THEN 'Ciudad vacía'
        WHEN si.department IS NULL OR si.department = '' THEN 'Departamento vacío'
        ELSE 'OK'
    END as estado
FROM orders o
INNER JOIN shipping_info si ON o.id = si.order_id
WHERE
    si.full_address IS NULL OR si.full_address = ''
    OR si.city IS NULL OR si.city = ''
    OR si.department IS NULL OR si.department = ''
ORDER BY o.created_at DESC;

-- 3. Resumen general
SELECT
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT si.order_id) as orders_with_shipping,
    COUNT(DISTINCT CASE WHEN si.full_address IS NOT NULL AND si.full_address != '' THEN si.order_id END) as with_address,
    COUNT(DISTINCT CASE WHEN si.city IS NOT NULL AND si.city != '' THEN si.order_id END) as with_city,
    COUNT(DISTINCT CASE WHEN si.department IS NOT NULL AND si.department != '' THEN si.order_id END) as with_department
FROM orders o
LEFT JOIN shipping_info si ON o.id = si.order_id;
