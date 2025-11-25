# Instrucciones para Corregir Problema de Direcciones en Pedidos

## Problema Identificado

Los pedidos muestran "Sin dirección N/A, N/A" en el dashboard porque:

1. Falta la columna `is_antioquia` en la tabla `shipping_info` de Supabase
2. Posiblemente hay pedidos antiguos sin información de dirección guardada

## Solución Paso a Paso

### Paso 1: Conectar a Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto "Esbelta" o el que estés usando
3. Ve a la sección "SQL Editor" en el menú lateral

### Paso 2: Agregar Columna is_antioquia

1. En el SQL Editor, copia y pega el contenido del archivo:
   `scripts/add-is-antioquia-column.sql`

2. Haz clic en "Run" para ejecutar el script

3. Deberías ver un mensaje: "Columna is_antioquia agregada exitosamente"

### Paso 3: Verificar Pedidos con Datos Faltantes

1. En el SQL Editor, ejecuta el contenido de:
   `scripts/check-missing-shipping-info.sql`

2. Esto te mostrará 3 resultados:
   - **Tabla 1**: Órdenes sin registro en shipping_info
   - **Tabla 2**: Órdenes con campos vacíos
   - **Tabla 3**: Resumen general

### Paso 4: Probar con un Pedido Nuevo

1. Abre la aplicación: http://localhost:5175
2. Agrega un producto al carrito
3. Ve al checkout
4. **IMPORTANTE**: Llena TODOS los campos del formulario:
   - Nombre completo
   - Email
   - Teléfono
   - Dirección completa
   - Departamento (selecciona "Antioquia")
   - Ciudad (selecciona una ciudad de Antioquia)
   - Código postal

5. Completa el pedido

6. Abre la consola del navegador (F12) y verifica que veas logs como:
   ```
   📦 createOrder - shippingInfo recibido: {fullName: "...", email: "...", ...}
   📦 createOrder - isAntioquia: true
   📦 Datos de envío a guardar: {...}
   ✅ Información de envío guardada correctamente
   ```

7. Ve al dashboard admin y verifica que el nuevo pedido muestre:
   - Dirección completa en la columna "DIRECCIÓN / CIUDAD"
   - "Contra Entrega" en azul en la columna "TIPO"

## Explicación Técnica de los Cambios

### Cambios en `orderService.js`:
- Ahora recibe `isAntioquia` además de `isMedellin`
- Guarda `is_antioquia` en la tabla `shipping_info`
- Usa `isAntioquia` para determinar si el tipo de envío es "medellin_contra_entrega"

### Cambios en `OrdersManager.jsx`:
- Columna "DIRECCIÓN / CIUDAD" muestra dirección completa y ciudad/departamento
- Maneja valores NULL mostrando "Sin dirección" en lugar de errores

### Cambios en `OrderDetailModal.jsx`:
- Muestra valores por defecto "No especificado" si los campos están vacíos
- Mensaje de advertencia si no hay información de envío

## Si Aún No Funciona

Si después de estos pasos el problema persiste:

1. **Verifica en Supabase** que la tabla `shipping_info` tenga las columnas:
   - `full_address` (text)
   - `city` (text)
   - `department` (text)
   - `postal_code` (text)
   - `is_medellin` (boolean)
   - `is_antioquia` (boolean) ← NUEVA

2. **Revisa la consola del navegador** al crear un pedido
   - Busca errores en rojo
   - Verifica que los logs de debug aparezcan

3. **Consulta directamente en Supabase**:
   ```sql
   SELECT o.reference, si.*
   FROM orders o
   LEFT JOIN shipping_info si ON o.id = si.order_id
   ORDER BY o.created_at DESC
   LIMIT 5;
   ```

4. Si ves que `shipping_info` está vacío o NULL para pedidos nuevos, hay un problema con los permisos de Supabase (RLS - Row Level Security).

## Notas Adicionales

- Los pedidos ANTIGUOS (antes de esta corrección) seguirán mostrando "Sin dirección" porque no se guardó esa información en su momento
- Solo los pedidos NUEVOS (después de aplicar estos cambios) mostrarán la dirección correctamente
- El código ahora tiene logs de debug para facilitar identificar problemas futuros
