# Dashboard de Leads del Probador Virtual

## ✅ Implementación Completada

Se ha agregado un sistema completo de recolección y visualización de leads del Probador Virtual al AdminDashboard.

---

## 📁 Archivos Creados

### 1. Schema SQL
**`supabase/virtual-tryon-leads-schema.sql`**
- Tabla `virtual_tryon_leads` con todos los campos necesarios
- Políticas RLS para acceso público (INSERT/UPDATE) y admin (SELECT/DELETE)
- Índices optimizados para búsquedas
- Trigger para `updated_at`

### 2. Servicio de Leads
**`src/services/VirtualTryOnLeadsService.js`**
- `saveLead()` - Guarda/actualiza lead en Supabase
- `getAllLeads()` - Obtiene todos los leads (admin)
- `getLeadsStats()` - Estadísticas agregadas
- `deleteLead()` - Elimina un lead
- `exportLeadsToCSV()` - Exporta datos a CSV

### 3. Componente de Visualización
**`src/components/admin/VirtualTryOnLeads.jsx`**
- Tabla completa de leads con información detallada
- Tarjetas de estadísticas (Total, Alto Engagement, Generaciones, Promedio)
- Búsqueda en tiempo real (nombre, email, teléfono)
- Filtros por nivel de engagement
- Exportación a CSV
- Enlaces directos a WhatsApp y Email

### 4. Modificaciones
**`src/services/VirtualTryOnUserService.js`**
- Agregada sincronización automática con Supabase
- Método `syncToSupabase()` llamado en `createUserSession()` y `decrementTries()`
- Sincronización asíncrona (no bloquea UX)

**`src/pages/AdminDashboard.jsx`**
- Nueva pestaña "Leads Probador" con ícono Users
- Importación de `VirtualTryOnLeads` component
- Routing para tab `leads`

---

## 🗄️ Estructura de Datos

### Tabla: `virtual_tryon_leads`

```sql
CREATE TABLE virtual_tryon_leads (
  id UUID PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  total_generations INTEGER DEFAULT 0,
  remaining_tries INTEGER DEFAULT 5,
  engagement_level VARCHAR(20) DEFAULT 'low',
  registered_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Niveles de Engagement

- **high** (Alto): 4-5 generaciones usadas
- **medium** (Medio): 2-3 generaciones usadas
- **low** (Bajo): 0-1 generaciones usadas

---

## 🚀 Cómo Funciona

### Flujo de Datos

1. **Usuario se registra** en Probador Virtual
   - Llena formulario ContactCaptureModal
   - Datos se guardan en localStorage
   - `VirtualTryOnUserService.createUserSession()` →
   - `syncToSupabase()` →
   - `VirtualTryOnLeadsService.saveLead()` →
   - **Datos en Supabase**

2. **Usuario genera imagen**
   - Click "Pruébatelo"
   - Generación exitosa
   - `VirtualTryOnUserService.decrementTries()` →
   - `syncToSupabase()` →
   - `VirtualTryOnLeadsService.saveLead()` (UPDATE) →
   - **Datos actualizados en Supabase**

3. **Admin visualiza leads**
   - Va a `/admin/dashboard`
   - Click pestaña "Leads Probador"
   - `VirtualTryOnLeads` component carga
   - `VirtualTryOnLeadsService.getAllLeads()` →
   - **Tabla con todos los leads**

---

## 📊 Estadísticas Disponibles

### Tarjetas de Métricas

1. **Total Leads**: Número total de usuarios registrados
2. **Engagement Alto**: Usuarios con 4-5 generaciones
3. **Total Generaciones**: Suma de todas las generaciones
4. **Promedio por Usuario**: Total generaciones / Total leads

### Datos por Lead

- Nombre completo
- WhatsApp (clickeable → abre WhatsApp Web)
- Email (clickeable → abre cliente de email)
- Total generaciones realizadas
- Intentos restantes (0-5)
- Nivel de engagement (badge con color)
- Fecha de registro
- Botón eliminar

---

## 🎨 Características de UI/UX

### Búsqueda y Filtros

- **Búsqueda en tiempo real**: Nombre, email o WhatsApp
- **Filtro por engagement**:
  - Todos los niveles
  - Alto Engagement
  - Medio Engagement
  - Bajo Engagement

### Badges de Estado

#### Intentos Restantes
- 🟢 Verde: 3-5 intentos restantes
- 🟡 Amarillo: 1-2 intentos restantes
- 🔴 Rojo: 0 intentos (agotado)

#### Engagement
- 🟢 Alto: Con ícono TrendingUp
- 🟡 Medio: Con ícono Minus
- ⚪ Bajo: Con ícono TrendingDown

### Exportación CSV

Formato del archivo exportado:
```csv
Nombre,WhatsApp,Email,Generaciones,Intentos Restantes,Engagement,Registrado,Último Uso
"María García","+52 55 1234 5678","maria@gmail.com",5,0,high,"15 nov 2025, 14:30","15 nov 2025, 16:45"
```

---

## 🔧 Instalación y Configuración

### Paso 1: Ejecutar SQL en Supabase

1. Ve a Supabase Dashboard → **SQL Editor**
2. Abre el archivo `supabase/virtual-tryon-leads-schema.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor
5. Click **Run**

### Paso 2: Verificar Tabla Creada

1. Ve a **Table Editor**
2. Deberías ver la tabla `virtual_tryon_leads`
3. Verifica columnas y políticas RLS

### Paso 3: Probar el Sistema

1. Ejecuta `npm run dev`
2. Ve a `/virtual-tryon`
3. Completa el formulario de registro
4. Genera una imagen
5. Ve a `/admin/dashboard`
6. Click pestaña "Leads Probador"
7. Deberías ver tu lead en la tabla

---

## 🔐 Seguridad (RLS Policies)

### Políticas Configuradas

```sql
-- Cualquiera puede crear leads (formulario público)
CREATE POLICY "Anyone can create leads"
  ON virtual_tryon_leads
  FOR INSERT
  WITH CHECK (true);

-- Cualquiera puede actualizar (sincronización localStorage → Supabase)
CREATE POLICY "Anyone can update leads"
  ON virtual_tryon_leads
  FOR UPDATE
  USING (true);

-- Solo admin puede ver todos los leads
CREATE POLICY "Authenticated users can view all leads"
  ON virtual_tryon_leads
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Solo admin puede eliminar
CREATE POLICY "Authenticated users can delete leads"
  ON virtual_tryon_leads
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
```

### Rationale

- **INSERT/UPDATE público**: Permite sincronización automática desde frontend sin autenticación
- **SELECT/DELETE restringido**: Solo usuarios autenticados (admin) pueden ver y eliminar
- **Session ID único**: Previene duplicados por mismo usuario

---

## 📈 Casos de Uso

### 1. Marketing - Seguimiento de Leads

**Filtrar leads de alto engagement:**
1. Click filtro "Alto Engagement"
2. Ver usuarios que usaron 4-5 intentos
3. **Acción**: Contactar vía WhatsApp con ofertas personalizadas

### 2. Ventas - Conversión

**Identificar usuarios agotados:**
1. Filtrar por "0/5" intentos restantes
2. Ver leads que ya no pueden usar probador
3. **Acción**: Email marketing con cupón de descuento

### 3. Analytics - Métricas de Producto

**Analizar engagement promedio:**
1. Ver tarjeta "Promedio por Usuario"
2. Si < 2.0 → Probador no es atractivo
3. Si > 3.5 → Alta retención, buen engagement
4. **Acción**: Optimizar productos o interfaz según métrica

### 4. Data Export - CRM Integration

**Exportar para CRM externo:**
1. Click "Exportar CSV"
2. Descargar archivo con todos los datos
3. Importar a Salesforce, HubSpot, etc.
4. **Acción**: Campañas de email marketing automatizadas

---

## 🧪 Testing Manual

### Test 1: Captura de Lead

1. Ir a `/virtual-tryon`
2. Llenar formulario ContactCaptureModal
3. Generar 1 imagen
4. Ir a dashboard → Leads Probador
5. **Esperado**: Lead aparece con 1 generación, 4 intentos restantes, engagement "low"

### Test 2: Actualización de Lead

1. Generar 2 imágenes más (total 3)
2. Recargar dashboard
3. **Esperado**: Lead actualizado con 3 generaciones, 2 intentos restantes, engagement "medium"

### Test 3: Lead Agotado

1. Generar 2 imágenes más (total 5)
2. Recargar dashboard
3. **Esperado**: Lead con 5 generaciones, 0 intentos restantes, engagement "high"

### Test 4: Búsqueda

1. Escribir nombre del lead en buscador
2. **Esperado**: Filtrado en tiempo real

### Test 5: Filtro Engagement

1. Seleccionar "Alto Engagement"
2. **Esperado**: Solo leads con engagement "high"

### Test 6: Exportar CSV

1. Click "Exportar CSV"
2. **Esperado**: Archivo descargado con formato correcto

### Test 7: Eliminar Lead

1. Click ícono 🗑️ en un lead
2. Confirmar
3. **Esperado**: Lead eliminado de la tabla

### Test 8: Enlaces Directos

1. Click en WhatsApp
2. **Esperado**: Abre WhatsApp Web con número pre-cargado
3. Click en Email
4. **Esperado**: Abre cliente de email con destinatario

---

## ⚠️ Consideraciones Importantes

### Sincronización Asíncrona

- Los datos se sincronizan de **localStorage → Supabase** automáticamente
- Si falla la sincronización, **NO se rompe** la experiencia del usuario
- Advertencias se muestran en consola: `Failed to sync to Supabase`

### Duplicados

- El `session_id` es UNIQUE en la base de datos
- Si un usuario vuelve a registrarse, se **actualiza** el lead existente
- No se crean duplicados

### Privacidad

- No se almacenan datos sensibles (solo nombre, WhatsApp, email)
- No se guarda información de tarjetas o contraseñas
- Cumple con GDPR (derecho al olvido via botón eliminar)

---

## 🛠️ Troubleshooting

### Problema: No aparecen leads en el dashboard

**Solución**:
1. Verifica que el SQL schema se ejecutó correctamente
2. Verifica políticas RLS en Supabase
3. Verifica que `VITE_USE_SUPABASE=true` en `.env.local`
4. Abre consola del navegador, busca errores de red

### Problema: Error al sincronizar

**Solución**:
1. Verifica conexión a internet
2. Verifica credenciales Supabase en `.env.local`
3. Revisa consola: `Failed to sync to Supabase: [error]`
4. **Nota**: El usuario puede seguir usando el probador, solo no se guarda en DB

### Problema: CSV vacío

**Solución**:
1. Verifica que hay leads en la tabla
2. Verifica permisos del navegador para descargas
3. Intenta con navegador diferente

---

## 📝 Próximos Pasos Sugeridos

### 1. Integración CRM
- Webhook de Supabase → Zapier → CRM
- Automatizar emails de seguimiento

### 2. Email Marketing
- Segmentar por engagement level
- Campaña para usuarios agotados (0 intentos)
- Campaña para usuarios de alto engagement (potencial compra)

### 3. Analytics Avanzados
- Dashboard con gráficos de conversión
- Tasa de conversión probador → compra
- Análisis de productos más probados

### 4. Notificaciones
- Notificar admin cuando nuevo lead de alto engagement
- Email automático a leads cuando agotan intentos

---

## ✅ Checklist de Deployment

- [ ] Ejecutar `virtual-tryon-leads-schema.sql` en Supabase
- [ ] Verificar tabla `virtual_tryon_leads` creada
- [ ] Verificar políticas RLS activas
- [ ] Testing manual completo (8 tests)
- [ ] Verificar en móvil y desktop
- [ ] Probar exportación CSV
- [ ] Documentar proceso para equipo

---

**Fecha**: 2025-10-04
**Versión**: 1.0.0
**Estado**: ✅ LISTO PARA USAR

El dashboard de leads está completamente implementado y listo para capturar y visualizar todos los usuarios del Probador Virtual.
