# 🎬 Guía de Subida de Videos

## ✅ Funcionalidad Completada

Ahora puedes subir videos de dos formas en el dashboard de productos:

### **1. Subir Archivo Local (Recomendado)**
- Arrastra un video directamente o haz clic para seleccionar
- Formatos soportados: MP4, WEBM, OGG
- Tamaño máximo: 50MB
- El video se sube automáticamente a Supabase Storage
- Vista previa antes de guardar

### **2. URL Externa**
- Ingresa la URL de un video alojado en YouTube, Vimeo, u otro servicio
- Ideal para videos muy grandes
- No consume espacio en Supabase

## 📋 Pasos para Activar

### **1. Ejecutar SQL en Supabase**

1. Ve a: https://supabase.com/dashboard/project/kynogljhbbvagneiydrk/sql
2. Click en "New Query"
3. Copia el contenido del archivo `supabase/add-video-storage.sql`
4. Click en "Run"

Esto creará el bucket `product-videos` y las políticas de seguridad.

### **2. Probar la Funcionalidad**

1. Ve al dashboard: http://localhost:5173/admin
2. Click en "Productos" tab
3. Click en "Crear Producto" o "Editar" en cualquier producto
4. En la pestaña "Información Básica", baja hasta "Video del Producto"
5. Verás dos opciones:
   - **Subir Archivo**: Arrastra tu video aquí
   - **URL Externa**: Pega una URL de video

## 🎯 Características

### **Subida de Archivo**
- ✅ Drag and drop
- ✅ Vista previa del video antes de guardar
- ✅ Muestra nombre y tamaño del archivo
- ✅ Validación de formato y tamaño
- ✅ Indicador de progreso durante la subida
- ✅ Se sube a Supabase Storage automáticamente

### **URL Externa**
- ✅ Validación de URL
- ✅ Soporta cualquier URL pública de video
- ✅ No consume espacio en Supabase
- ✅ Ideal para YouTube, Vimeo, etc.

## 📝 Ejemplo de Uso

### **Crear Producto con Video Local**

1. **Pestaña 1 - Información Básica**
   - Llena nombre, categoría, descripción, precio
   - Baja hasta "Video del Producto"
   - Haz clic en "Subir Archivo"
   - Arrastra tu video MP4
   - Verás la vista previa

2. **Pestañas 2 y 3**
   - Agrega imágenes y variantes como siempre

3. **Guardar**
   - Click en "Guardar Producto"
   - El video se subirá automáticamente a Supabase
   - El producto se guardará con la URL del video

### **Crear Producto con URL de YouTube**

1. **Pestaña 1 - Información Básica**
   - Llena nombre, categoría, descripción, precio
   - Baja hasta "Video del Producto"
   - Haz clic en "URL Externa"
   - Pega: `https://www.youtube.com/watch?v=...`
   - Click en "Agregar"

2. **Guardar**
   - El producto se guardará con la URL de YouTube

## 🔍 Dónde se Muestra el Video

El video aparecerá en:
- ✅ ProductDetailModal (modal de detalle del producto)
- ✅ ProductCard (tarjeta de producto al hacer hover)
- ✅ Vista previa en el dashboard

## ⚙️ Configuración del Bucket

El bucket `product-videos` en Supabase Storage tiene:

**Políticas de Seguridad**:
- 🟢 **Lectura Pública**: Cualquiera puede ver los videos
- 🔐 **Escritura Autenticada**: Solo usuarios autenticados pueden subir/editar/eliminar
- 📁 **Organización**: `/products/{nombre-producto}/{timestamp}-{random}.mp4`

**Límites**:
- Tamaño máximo por archivo: 50MB (configurable en VideoUploader.jsx)
- Formatos: MP4, WEBM, OGG

## 🛠️ Personalización

### Cambiar Tamaño Máximo

En `src/components/admin/VideoUploader.jsx`:

```javascript
validateVideoFile(file, maxSizeMB = 100) // Cambia a 100MB
```

### Agregar Más Formatos

En `src/services/ImageService.js`:

```javascript
const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'];
```

### Cambiar Ubicación de Almacenamiento

En `src/services/ImageService.js`, función `uploadVideo`:

```javascript
const filePath = `custom-folder/${sanitizedProductName}/${fileName}`;
```

## 🐛 Troubleshooting

### Video no se sube
- ✅ Verifica que ejecutaste el SQL para crear el bucket
- ✅ Verifica que el archivo sea MP4, WEBM o OGG
- ✅ Verifica que el tamaño sea menor a 50MB
- ✅ Revisa la consola del navegador para errores

### Video no aparece en el catálogo
- ✅ Verifica que el producto se guardó correctamente
- ✅ Verifica que `video_url` tenga valor en la base de datos
- ✅ Revisa que ProductCard y ProductDetailModal estén usando `videoUrl`

### Error de permisos
- ✅ Verifica las políticas RLS en Supabase Storage
- ✅ Asegúrate de estar autenticado en el dashboard

## 💡 Mejoras Futuras

- [ ] Compresión automática de videos grandes
- [ ] Generación de thumbnails automática
- [ ] Soporte para múltiples videos por producto
- [ ] Preview de YouTube/Vimeo embebido
- [ ] Progress bar durante la subida
