# SOLUCIÓN DEFINITIVA - Direcciones No Se Guardan

## EL PROBLEMA

Los pedidos muestran "Sin dirección N/A, N/A" porque **Supabase está RECHAZANDO** los datos por permisos (RLS - Row Level Security).

## SOLUCIÓN EN 3 PASOS

### ✅ PASO 1: Ejecutar Script de Permisos en Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (menú izquierdo)
4. Copia y pega ESTE código:

```sql
-- Deshabilitar RLS para permitir insertar datos
ALTER TABLE shipping_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

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
    END IF;
END $$;

-- Verificar
SELECT 'CONFIGURACIÓN EXITOSA' as status;
```

5. Haz clic en **RUN** (botón abajo a la derecha)
6. Deberías ver: "CONFIGURACIÓN EXITOSA"

---

### ✅ PASO 2: Recargar la Aplicación

1. Cierra TODOS los navegadores abiertos
2. Abre Chrome/Firefox en modo **Incógnito** o **Privado**
3. Ve a: http://localhost:5175
4. Abre la **Consola del Navegador** (presiona F12)
5. Ve a la pestaña "Console"

---

### ✅ PASO 3: Hacer un Pedido de Prueba

1. Agrega un producto al carrito
2. Ve al checkout
3. **Llena TODOS los campos** (esto es CRÍTICO):
   ```
   Nombre: Juan Pérez
   Email: juan@example.com
   Teléfono: 3001234567
   Dirección: Calle 50 # 45-23, Apto 301
   Departamento: Antioquia
   Ciudad: Medellín
   Código Postal: 050001
   ```

4. Haz clic en "Confirmar Pedido (Contra Entrega)"

---

## QUÉ DEBES VER EN LA CONSOLA

Si TODO está funcionando correctamente, verás estos logs en la consola:

```
🛒 Cart - shippingInfo ANTES de enviar: {fullName: "Juan Pérez", email: "juan@example.com", phone: "3001234567", fullAddress: "Calle 50 # 45-23, Apto 301", department: "Antioquia", city: "Medellín", postalCode: "050001"}

🛒 Cart - isAntioquia: true

📦 createOrder - shippingInfo recibido: {fullName: "Juan Pérez", ...}

📦 Datos de envío a guardar: {order_id: "...", full_name: "Juan Pérez", full_address: "Calle 50 # 45-23, Apto 301", city: "Medellín", department: "Antioquia", ...}

✅ Información de envío guardada correctamente

✅ Datos guardados: [{order_id: "...", full_address: "Calle 50 # 45-23, Apto 301", ...}]
```

---

## SI VES UN ERROR EN LA CONSOLA

### Error de Permisos RLS

Si ves algo como:
```
❌ Error al guardar envío: {code: "42501", message: "new row violates row-level security policy"}
```

**SOLUCIÓN**: El Paso 1 no se ejecutó correctamente. Ve a Supabase y ejecuta de nuevo el script.

---

### Error de Columna No Existe

Si ves algo como:
```
❌ Error al guardar envío: {code: "42703", message: "column 'is_antioquia' does not exist"}
```

**SOLUCIÓN**: La columna `is_antioquia` no se creó. Ejecuta este SQL en Supabase:

```sql
ALTER TABLE shipping_info ADD COLUMN is_antioquia BOOLEAN DEFAULT FALSE;
```

---

### Alerta "ERROR AL GUARDAR DIRECCIÓN"

Si aparece una alerta con detalles del error:

1. **Copia el mensaje COMPLETO** de la alerta
2. **Toma screenshot** de la consola del navegador
3. Envíame esa información para diagnosticar

---

## VERIFICAR EN EL DASHBOARD

1. Ve al dashboard admin
2. Haz clic en "Pedidos"
3. Busca el pedido que acabas de crear
4. En la columna "DIRECCIÓN / CIUDAD" deberías ver:
   ```
   Calle 50 # 45-23, Apto 301
   Medellín, Antioquia
   ```
5. En la columna "TIPO" debería decir: **Contra Entrega** (en azul)

---

## SI TODAVÍA NO FUNCIONA

Si después de seguir TODOS los pasos anteriores sigue sin funcionar:

### Opción A: Verificar Directamente en Supabase

1. Ve a Supabase → Table Editor
2. Selecciona la tabla `orders`
3. Busca el pedido más reciente
4. Copia el `id` del pedido
5. Ve a SQL Editor y ejecuta:

```sql
SELECT * FROM shipping_info WHERE order_id = 'PEGA-AQUI-EL-ID';
```

6. Si NO aparece NINGÚN registro → El problema es de permisos RLS
7. Si aparece pero los campos están NULL → El problema es en el código

### Opción B: Revisar Variables de Entorno

Verifica que tu archivo `.env.local` tenga:
```
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

---

## RESUMEN DE CAMBIOS EN EL CÓDIGO

He agregado logs de debug en:
- `src/components/Cart.jsx` → logs con emoji 🛒
- `src/pages/ShortInvisibleLandingReact.jsx` → logs con emoji 🏝️
- `src/services/orderService.js` → logs con emoji 📦

También agregué:
- Alertas visibles cuando hay errores
- Más detalles de errores en la consola
- Validación de que `isAntioquia` se pase correctamente

---

## DESPUÉS DE QUE FUNCIONE

Una vez que confirmes que los nuevos pedidos SÍ guardan la dirección:

1. Los pedidos ANTIGUOS seguirán mostrando "Sin dirección" (eso es normal)
2. Los pedidos NUEVOS mostrarán toda la información correctamente
3. Puedes eliminar los logs de debug si quieres (los que tienen console.log)

---

## CONTACTO

Si después de TODO esto sigue sin funcionar:

1. Mándame screenshot de la consola del navegador
2. Mándame screenshot de la alerta de error (si aparece)
3. Ejecuta este SQL en Supabase y mándame el resultado:

```sql
-- Ver configuración de permisos
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'shipping_info';

-- Ver columnas de la tabla
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'shipping_info';

-- Ver últimos registros
SELECT * FROM shipping_info ORDER BY created_at DESC LIMIT 3;
```
