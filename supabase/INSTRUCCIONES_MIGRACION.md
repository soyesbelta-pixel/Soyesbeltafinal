# Instrucciones para Migrar Categorías en Supabase

## Problema
El error 400 ocurre porque la base de datos de Supabase tiene un constraint CHECK que solo permite las categorías antiguas:
- `diario`, `modeladora`, `post-quirurgica`, `deportiva`, `maternidad`

Pero ahora estamos usando categorías nuevas:
- `lenceria`, `realce`, `fajas`, `moldeadoras`

## Solución: Ejecutar Migración SQL

### Paso 1: Acceder a Supabase SQL Editor
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, click en **SQL Editor**

### Paso 2: Ejecutar la Migración
1. Copia TODO el contenido del archivo `migration_update_categories.sql`
2. Pégalo en el SQL Editor
3. Click en **RUN** (o presiona Ctrl+Enter)

### Paso 3: Verificar que Funcionó
Deberías ver en los resultados:

```
category    | count
------------|------
lenceria    | X
realce      | X
moldeadoras | X
```

### Paso 4: Probar en el Dashboard
1. Regresa al dashboard de administración
2. Intenta crear un nuevo producto
3. Selecciona la categoría "Fajas" (o cualquier otra nueva)
4. El producto debería guardarse sin errores 400

## ¿Qué hace la migración?

1. **Elimina** el constraint antiguo que limitaba las categorías
2. **Crea** un nuevo constraint con las categorías nuevas
3. **Actualiza** los productos existentes:
   - `diario` → `realce`
   - `modeladora` → `moldeadoras`

## Nota Importante
Si tienes productos con categorías `post-quirurgica`, `deportiva`, o `maternidad`, necesitarás decidir manualmente a qué nueva categoría asignarlos antes de ejecutar la migración, o modificar el script para incluir esas conversiones.

## Archivo de Migración
📁 `supabase/migration_update_categories.sql`

## Si tienes problemas
- Verifica que estás autenticado como admin en Supabase
- Revisa los mensajes de error en la consola del SQL Editor
- Si hay productos con categorías no mapeadas, la migración puede fallar en el UPDATE
