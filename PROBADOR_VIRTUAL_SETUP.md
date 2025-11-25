# Configuración del Dashboard del Probador Virtual

## ✅ Archivos Creados

### 1. Base de Datos
- **`supabase/virtual-tryon-schema.sql`** - Schema completo con tablas, políticas RLS y storage bucket

### 2. Servicios
- **`src/services/VirtualTryOnService.js`** - Servicio para CRUD de productos del probador virtual

### 3. Componentes Admin
- **`src/components/admin/VirtualTryOnManager.jsx`** - Interfaz principal de gestión
- **`src/components/admin/VirtualTryOnEditor.jsx`** - Modal para crear/editar productos

### 4. Scripts
- **`scripts/migrate-virtual-tryon-products.js`** - Migración de productos existentes a Supabase

## 📋 Pasos de Configuración

### Paso 1: Ejecutar el Schema SQL en Supabase

1. Abre Supabase Dashboard: https://supabase.com/dashboard
2. Ve a tu proyecto
3. En el menú lateral, selecciona **SQL Editor**
4. Haz clic en **New Query**
5. Copia y pega el contenido completo de `supabase/virtual-tryon-schema.sql`
6. Haz clic en **Run** (o presiona `Ctrl + Enter`)

✅ Esto creará:
- Tabla `virtual_tryon_products`
- Políticas RLS (público puede ver activos, admin puede editar)
- Storage bucket `virtual-tryon-images`
- Políticas de storage
- Trigger para `updated_at`

### Paso 2: Verificar Variables de Entorno

Asegúrate de tener en tu archivo `.env`:

```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### Paso 3: Migrar Productos Existentes

Ejecuta el script de migración para cargar los 4 productos actuales del probador virtual:

```bash
npm run migrate:virtual-tryon
```

✅ Esto insertará:
- Cintura Reloj de Arena
- Cachetero Levanta Cola
- Short Levanta Gluteo Invisible
- Short Levanta Cola

### Paso 4: Verificar en Admin Dashboard

1. Ejecuta `npm run dev`
2. Ve a `http://localhost:5173/admin/dashboard`
3. Haz clic en la pestaña **"Probador Virtual"** (ícono ✨)
4. Deberías ver los 4 productos cargados

## 🎨 Funcionalidades del Dashboard

### Vista Principal (VirtualTryOnManager)
- **Grid de productos** con imágenes de display
- **Estadísticas**: Total, Activos, Inactivos
- **Búsqueda** por nombre
- **Filtro** mostrar/ocultar inactivos
- **Acciones**:
  - ✏️ Editar producto
  - 🗑️ Eliminar producto
  - ✅/❌ Activar/Desactivar
  - ➕ Agregar nuevo producto

### Modal de Edición (VirtualTryOnEditor)

#### Campos Editables:
- ✅ **Nombre Interno**: Identificador técnico del producto
- ✅ **Nombre a Mostrar**: Texto que ve el usuario final
- ✅ **Imagen de Display**: Para el selector del probador (cuadrada, PNG/JPG)
- ✅ **Imagen de Referencia**: Para procesamiento de IA (alta calidad)
- ✅ **Orden de Visualización**: Número para ordenar productos
- ✅ **Estado Activo**: Toggle para mostrar/ocultar del probador

#### Campo NO Editable:
- 🔒 **Prompt para IA**: Se mantiene fijo como está en el código original
  - Los prompts NO se pueden modificar desde el dashboard
  - Se preservan exactamente como están para consistencia del sistema
  - Se muestran en modo solo lectura

## 🔄 Flujo de Trabajo

### Agregar Nuevo Producto
1. Clic en **"+ Agregar Producto"**
2. Llenar formulario:
   - Nombre interno (ej: "Professional Shaping Waist Trainer")
   - Nombre a mostrar (ej: "Cintura Reloj de Arena")
   - Subir imagen de display (para el selector)
   - Subir imagen de referencia (para IA)
   - El prompt de IA se usa el por defecto (no editable)
   - Definir orden de visualización
   - Marcar como activo
3. Guardar
4. Las imágenes se suben automáticamente a Supabase Storage
5. El producto aparece en el probador virtual público

### Editar Producto Existente
1. Clic en **"✏️ Editar"** en cualquier producto
2. Modificar campos deseados (excepto prompt de IA)
3. Cambiar imágenes si es necesario
4. Guardar cambios

### Desactivar Temporalmente
1. Clic en el toggle ✅ del producto
2. El producto se oculta del probador virtual público
3. Sigue visible en el admin con estado ❌ Inactivo

### Eliminar Producto
1. Clic en **"🗑️"**
2. Confirmar eliminación
3. El producto se elimina de la base de datos
4. Las imágenes en Storage permanecen (puedes limpiarlas manualmente si quieres)

## 🔐 Seguridad (RLS Policies)

### Tabla `virtual_tryon_products`
- **Público (no autenticado)**: Solo puede VER productos activos (`is_active = true`)
- **Autenticado (admin)**: Puede hacer TODO (crear, editar, eliminar)

### Storage `virtual-tryon-images`
- **Público**: Solo puede VER imágenes
- **Autenticado (admin)**: Puede subir, actualizar y eliminar imágenes

## 📁 Estructura de Archivos de Imágenes

Las imágenes subidas se guardan en Supabase Storage con esta estructura:

```
virtual-tryon-images/
├── display/
│   ├── 1234567890-abc123.png
│   ├── 1234567891-def456.png
│   └── ...
└── reference/
    ├── 1234567890-xyz789.png
    ├── 1234567891-uvw012.png
    └── ...
```

- Nombres únicos con timestamp + ID aleatorio
- Públicamente accesibles vía URL
- URLs guardadas en la base de datos

## 🚀 Próximos Pasos

### 1. Actualizar VirtualTryOn Público (Pendiente)
Modificar `src/components/VirtualTryOn/VirtualTryOnApp.jsx` para:
- Cargar productos desde Supabase en lugar de `constants.ts`
- Usar `VirtualTryOnService.getProducts()` para obtener productos activos
- Mantener la misma interfaz de usuario

### 2. Testing
- Probar creación de productos
- Probar edición de productos
- Probar activación/desactivación
- Verificar que los prompts NO se modifican
- Validar que solo productos activos aparecen en el probador público

## ❓ Solución de Problemas

### Error: "Failed to resolve import supabase"
- ✅ Ya corregido: `VirtualTryOnService.js` ahora usa `./supabaseClient` correctamente

### Error: Política ya existe
- ✅ Ya corregido: El SQL ahora hace `DROP POLICY IF EXISTS` antes de crear

### No aparecen productos en el dashboard
1. Verifica que ejecutaste el schema SQL en Supabase
2. Verifica variables de entorno en `.env`
3. Ejecuta `npm run migrate:virtual-tryon`
4. Revisa la consola del navegador para errores

### Productos no aparecen en probador virtual público
- Verifica que `is_active = true`
- Verifica que ejecutaste la migración
- Actualiza `VirtualTryOnApp.jsx` para usar datos de Supabase (pendiente)

## 📝 Notas Importantes

1. **Prompts de IA NO editables**: Esto es intencional para mantener consistencia en cómo la IA procesa los productos
2. **Dos imágenes por producto**:
   - Display (para mostrar en selector)
   - Referencia (para procesamiento de IA)
3. **Cache de 5 minutos**: VirtualTryOnService tiene cache, se limpia automáticamente después de cambios
4. **Product_id opcional**: Puedes vincular con productos del catálogo pero no es requerido
