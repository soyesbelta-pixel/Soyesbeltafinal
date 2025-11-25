# Sistema de Captura de Leads - Guía Rápida

## Resumen en 60 Segundos

**Qué hace:**
- Captura nombre, WhatsApp y email ANTES del primer uso del Probador Virtual
- Otorga 5 intentos GRATUITOS por usuario
- Al agotar intentos → Mensaje de conversión con CTA a catálogo
- Confetti en registro y cada generación exitosa

**Archivos creados:**
```
src/
├── services/
│   └── VirtualTryOnUserService.js       (Gestión de sesión y localStorage)
├── utils/
│   └── formValidation.js                (Validaciones de formulario)
└── components/VirtualTryOn/
    ├── ContactCaptureModal.jsx          (Captura de datos)
    ├── TriesCounter.jsx                 (Contador de intentos)
    └── ThankYouModal.jsx                (Conversión final)

Modificado:
└── VirtualTryOnApp.jsx                  (Integración completa)
```

---

## Estados del Sistema (Máquina de Estados)

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO NUEVO                            │
│  • No hay sesión en localStorage                            │
│  • Muestra: ContactCaptureModal                             │
│  • Acción: Capturar datos → Crear sesión con 5 intentos    │
│  • Celebración: 🎉 Confetti                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              USUARIO ACTIVO (1-5 intentos)                  │
│  • Sesión existe, remainingTries > 0                        │
│  • Muestra: TriesCounter                                    │
│  • Acción: Permitir generación → Decrementar intentos      │
│  • Celebración: 🎉 Confetti por cada generación            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               USUARIO SIN INTENTOS (0)                      │
│  • remainingTries === 0                                     │
│  • Muestra: ThankYouModal                                   │
│  • Acción: CTA a catálogo + cupón descuento                │
│  • Estado: Botón "Pruébatelo" deshabilitado                │
└─────────────────────────────────────────────────────────────┘
```

---

## localStorage Schema

**Key:** `'virtual-tryon-user'`

```javascript
{
  userName: "María García",           // String (3+ chars, solo letras)
  whatsapp: "+52 55 1234 5678",      // String (10-15 dígitos)
  email: "maria@ejemplo.com",         // String (formato email)
  remainingTries: 3,                  // Number (0-5)
  registeredAt: 1732245600000,        // Unix timestamp
  lastUsedAt: 1732249200000,          // Unix timestamp
  totalGenerations: 2,                // Number (contador acumulativo)
  sessionId: "vto-1732245600000-abc"  // String (identificador único)
}
```

---

## API del UserService

### Principales Métodos

```javascript
// 1. Obtener sesión actual
const session = VirtualTryOnUserService.getUserSession();
// Retorna: Object | null

// 2. Crear nueva sesión
const session = VirtualTryOnUserService.createUserSession({
  userName: "María García",
  whatsapp: "+52 55 1234 5678",
  email: "maria@ejemplo.com"
});
// Retorna: Object (sesión con 5 intentos)

// 3. Decrementar intentos
const updatedSession = VirtualTryOnUserService.decrementTries();
// Retorna: Object (sesión actualizada)

// 4. Verificar si puede generar
const canGenerate = VirtualTryOnUserService.canGenerate();
// Retorna: Boolean

// 5. Verificar si está registrado
const isRegistered = VirtualTryOnUserService.isRegistered();
// Retorna: Boolean

// 6. Limpiar sesión (desarrollo/testing)
VirtualTryOnUserService.clearSession();

// 7. Obtener analytics
const analytics = VirtualTryOnUserService.getAnalyticsData();
// Retorna: { sessionId, userName, email, whatsapp, totalGenerations,
//            remainingTries, registeredAt, lastUsedAt, engagementLevel }
```

---

## Validaciones del Formulario

### API de Validación

```javascript
import { validateContactForm } from '../../utils/formValidation';

// Validar formulario completo
const { isValid, errors } = validateContactForm({
  userName: "María García",
  whatsapp: "+52 55 1234 5678",
  email: "maria@gmail.com"
});

// Resultado
{
  isValid: true,
  errors: {
    userName: "",
    whatsapp: "",
    email: ""
  }
}

// Validaciones individuales
import { validateName, validateWhatsApp, validateEmail } from '../../utils/formValidation';

validateName("Ma");
// { isValid: false, error: "El nombre debe tener al menos 3 caracteres" }

validateWhatsApp("123");
// { isValid: false, error: "Ingresa un número válido (10-15 dígitos)" }

validateEmail("maria@");
// { isValid: false, error: "Ingresa un correo electrónico válido" }
```

---

## Integración en VirtualTryOnApp

### Cambios Críticos en handleGenerate

```javascript
const handleGenerate = async () => {
  // ✅ NUEVO: Validar sesión
  if (!userSession) {
    setShowContactModal(true);
    return;
  }

  // ✅ NUEVO: Validar intentos
  if (userSession.remainingTries === 0) {
    setShowThankYouModal(true);
    return;
  }

  // Lógica original de validación
  if (!userImageFile || !selectedProduct) {
    setError("Por favor sube una imagen y selecciona un producto primero.");
    return;
  }

  setIsLoading(true);
  setError(null);
  setGeneratedResult(null);

  try {
    // Generar imagen (NO MODIFICADO)
    const result = await generateTryOnImage(userImageFile, selectedProduct);
    setGeneratedResult(result);

    // ✅ NUEVO: Decrementar intentos después de éxito
    const updatedSession = VirtualTryOnUserService.decrementTries();
    setUserSession(updatedSession);

    // ✅ NUEVO: Confetti celebración
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D27C5A', '#7D9A86', '#C9B7A5', '#F5EFE7']
    });

    // ✅ NUEVO: Mostrar ThankYou si fue el último intento
    if (updatedSession.remainingTries === 0) {
      setTimeout(() => setShowThankYouModal(true), 2000);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    // ⚠️ IMPORTANTE: NO decrementar intentos en caso de error
  } finally {
    setIsLoading(false);
  }
};
```

### Estado del Botón

```javascript
// ✅ NUEVO: Deshabilitar si no hay sesión o no hay intentos
const isButtonDisabled = useMemo(() => {
  return !userImageFile ||
         !selectedProduct ||
         isLoading ||
         !userSession ||
         userSession.remainingTries === 0;
}, [userImageFile, selectedProduct, isLoading, userSession]);
```

---

## Testing Rápido (Comandos en Consola)

### Escenario 1: Simular Usuario Nuevo

```javascript
// Limpiar localStorage
localStorage.removeItem('virtual-tryon-user');

// Recargar página
location.reload();

// Resultado esperado:
// ✓ ContactCaptureModal aparece automáticamente
```

### Escenario 2: Simular Usuario con 2 Intentos

```javascript
// Crear sesión de prueba
localStorage.setItem('virtual-tryon-user', JSON.stringify({
  userName: "Test User",
  whatsapp: "+52 55 0000 0000",
  email: "test@test.com",
  remainingTries: 2,
  registeredAt: Date.now(),
  lastUsedAt: Date.now(),
  totalGenerations: 3,
  sessionId: "test-123"
}));

// Recargar página
location.reload();

// Resultado esperado:
// ✓ TriesCounter muestra "Te quedan 2 intentos"
// ✓ Barra de progreso al 40%
// ✓ Color amarillo (warning)
```

### Escenario 3: Simular Usuario Sin Intentos

```javascript
// Crear sesión sin intentos
localStorage.setItem('virtual-tryon-user', JSON.stringify({
  userName: "Ana Rodríguez",
  whatsapp: "+52 55 1111 1111",
  email: "ana@test.com",
  remainingTries: 0,
  registeredAt: Date.now(),
  lastUsedAt: Date.now(),
  totalGenerations: 5,
  sessionId: "test-456"
}));

// Recargar página
location.reload();

// Resultado esperado:
// ✓ ThankYouModal aparece automáticamente
// ✓ Botón "Pruébatelo" deshabilitado
// ✓ No se muestra TriesCounter
```

### Verificar Analytics

```javascript
// Importar servicio en consola (si está disponible)
const analytics = VirtualTryOnUserService.getAnalyticsData();
console.table(analytics);

// Resultado:
// ┌────────────────────┬──────────────────────────┐
// │ sessionId          │ vto-1732245600000-abc    │
// │ userName           │ María García             │
// │ whatsapp           │ +52 55 1234 5678         │
// │ email              │ maria@ejemplo.com        │
// │ totalGenerations   │ 3                        │
// │ remainingTries     │ 2                        │
// │ engagementLevel    │ medium                   │
// └────────────────────┴──────────────────────────┘
```

---

## Checklist de Testing Manual

### ✅ Primera Visita

- [ ] Modal de contacto aparece al cargar
- [ ] Validaciones funcionan en tiempo real
- [ ] Confetti al completar registro
- [ ] localStorage se crea correctamente
- [ ] TriesCounter muestra "5 intentos"

### ✅ Generaciones 1-4

- [ ] Imagen se genera correctamente
- [ ] Confetti después de cada generación
- [ ] Contador decrementa (5→4→3→2→1)
- [ ] Barra de progreso actualiza
- [ ] Colores cambian según intentos (verde→amarillo→rojo)

### ✅ Última Generación (5ta)

- [ ] Imagen se genera normalmente
- [ ] Confetti aparece
- [ ] Después de 2 segundos → ThankYouModal
- [ ] Mensaje de agradecimiento correcto
- [ ] Cupón "PROBADOR10" visible

### ✅ Sin Intentos

- [ ] Botón "Pruébatelo" deshabilitado
- [ ] ThankYouModal al recargar página
- [ ] CTA "Ver Catálogo" redirige a /
- [ ] No se permite generar más imágenes

### ✅ Edge Cases

- [ ] localStorage corrupto → Muestra ContactModal
- [ ] Error en generación → No decrementa intentos
- [ ] Múltiples tabs → Sincronización correcta
- [ ] Responsive en mobile/tablet/desktop

---

## Confetti Configuration

### Registro Exitoso

```javascript
confetti({
  particleCount: 100,    // Menor cantidad (celebración inicial)
  spread: 70,            // Dispersión moderada
  origin: { y: 0.6 },    // Origen más bajo
  colors: ['#D27C5A', '#7D9A86', '#C9B7A5', '#F5EFE7']
});
```

### Generación Exitosa

```javascript
confetti({
  particleCount: 150,    // Mayor cantidad (celebración principal)
  spread: 80,            // Mayor dispersión
  origin: { y: 0.6 },    // Origen más bajo
  colors: ['#D27C5A', '#7D9A86', '#C9B7A5', '#F5EFE7']
});
```

**Colores de Marca:**
- `#D27C5A` - esbelta-terracotta (naranja/terracota)
- `#7D9A86` - esbelta-sage (verde salvia)
- `#C9B7A5` - esbelta-sand (arena)
- `#F5EFE7` - esbelta-cream (crema)

---

## Troubleshooting Rápido

| Problema | Solución Inmediata |
|----------|-------------------|
| Modal no aparece | `localStorage.removeItem('virtual-tryon-user')` + reload |
| Intentos no decrementan | Verificar que generación fue exitosa (no error) |
| Confetti no aparece | `npm install canvas-confetti` + verificar import |
| Botón siempre deshabilitado | Verificar `userSession` en React DevTools |
| localStorage no se guarda | Verificar permisos del navegador (modo privado) |

---

## Métricas Clave (KPIs)

```javascript
// Tasa de Captura
(Leads Capturados / Visitantes Únicos) × 100
Objetivo: > 60%

// Tasa de Uso Completo
(Usuarios con 5 Generaciones / Total Leads) × 100
Objetivo: > 40%

// Tasa de Conversión
(Compras / Usuarios con 0 Intentos) × 100
Objetivo: > 15%

// Engagement Promedio
Total Generaciones / Total Leads
Objetivo: > 3.5 generaciones/usuario
```

---

## Futuras Mejoras

### Fase 2 (Opcional)

1. **CRM Integration:**
   - Webhook a backend al capturar lead
   - Sync con email marketing (Mailchimp, SendGrid)
   - Segmentación automática por engagement

2. **Remarketing:**
   - Email al llegar a 0 intentos
   - SMS con cupón personalizado
   - WhatsApp Business API

3. **Gamificación:**
   - Compartir en redes = +1 intento extra
   - Referir amigo = +2 intentos
   - Sistema de badges

4. **Analytics Avanzado:**
   - Google Analytics events
   - Funnel de conversión
   - A/B testing de mensajes

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linter (verificar código)
npm run lint

# Preview de producción
npm run preview
```

---

## Contacto y Soporte

**Documentación Completa:**
`claudedocs/virtual-tryon-lead-capture-system.md`

**Archivos Principales:**
- `src/services/VirtualTryOnUserService.js`
- `src/components/VirtualTryOn/VirtualTryOnApp.jsx`
- `src/components/VirtualTryOn/ContactCaptureModal.jsx`

**Testing:**
Ver Test Suites 1-5 en documentación completa

---

## Resumen Final

✅ **Implementado:**
- Sistema completo de captura de leads
- Límite de 5 intentos por usuario
- Validación de formularios en tiempo real
- Confetti en registro y generaciones
- Modal de conversión al agotar intentos
- Tracking de analytics y engagement

⚠️ **No Modificado:**
- Lógica de generación de imágenes con IA (Gemini)
- Componentes existentes (Header, InfoBanner, etc.)
- Sistema de productos de Supabase

🚀 **Listo para:**
- Testing manual completo
- Deploy a staging
- Monitoreo de métricas en producción
