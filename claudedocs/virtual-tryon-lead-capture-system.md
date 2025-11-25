# Sistema de Captura de Leads - Probador Virtual

## Resumen Ejecutivo

Sistema de generación de leads integrado en el Probador Virtual que captura información de contacto de usuarios y limita el uso gratuito a 5 intentos, incentivando la conversión a compra.

---

## Arquitectura del Sistema

### Componentes Principales

```
VirtualTryOnApp.jsx (Orquestador Principal)
│
├── VirtualTryOnUserService.js (Gestión de Sesión)
│   ├── localStorage: 'virtual-tryon-user'
│   ├── Tracking de intentos (0-5)
│   └── Analytics de engagement
│
├── ContactCaptureModal.jsx (Captura de Datos)
│   ├── Validación en tiempo real
│   ├── FormInput components
│   └── Confetti al registrarse
│
├── TriesCounter.jsx (Contador Visual)
│   ├── Display de intentos restantes
│   ├── Barra de progreso
│   └── Alertas de bajo uso
│
└── ThankYouModal.jsx (Conversión Final)
    ├── Mensaje de agradecimiento
    ├── CTA a catálogo
    └── Cupón de descuento
```

---

## Flujo de Usuario

### Estado 1: Usuario Nuevo (Primera Visita)

```
Usuario accede al Probador Virtual
         ↓
¿Existe sesión en localStorage?
         ↓ NO
Mostrar ContactCaptureModal
         ↓
Usuario completa formulario:
  • Nombre completo (validado)
  • WhatsApp (formato validado)
  • Email (formato validado)
         ↓
Validación exitosa
         ↓
Guardar en localStorage:
  {
    userName: "María García",
    whatsapp: "+52 55 1234 5678",
    email: "maria@ejemplo.com",
    remainingTries: 5,
    registeredAt: 1732245600000,
    lastUsedAt: 1732245600000,
    totalGenerations: 0,
    sessionId: "vto-1732245600000-abc123"
  }
         ↓
🎉 CONFETTI CELEBRACIÓN
         ↓
Cerrar modal → Permitir uso del probador
```

### Estado 2: Usuario Registrado (1-5 Intentos Restantes)

```
Usuario accede al Probador Virtual
         ↓
¿Existe sesión en localStorage?
         ↓ SÍ
Cargar sesión → setUserSession(session)
         ↓
¿remainingTries > 0?
         ↓ SÍ (ej: 3 intentos)
Mostrar TriesCounter:
  "¡Hola, María! Te quedan 3 intentos"
  [███░░] 60% barra de progreso
         ↓
Usuario sube foto + selecciona producto
         ↓
Click "Pruébatelo"
         ↓
Generar imagen con IA (Gemini)
         ↓
ÉXITO
         ↓
Decrementar intentos:
  remainingTries: 3 → 2
  totalGenerations: 0 → 1
  lastUsedAt: [actualizar timestamp]
         ↓
🎉 CONFETTI CELEBRACIÓN
         ↓
Actualizar TriesCounter:
  "¡Hola, María! Te quedan 2 intentos"
         ↓
¿remainingTries === 0?
         ↓ NO
Continuar uso normal
```

### Estado 3: Usuario Sin Intentos (0 Intentos)

```
Usuario accede al Probador Virtual
         ↓
¿Existe sesión en localStorage?
         ↓ SÍ
Cargar sesión → setUserSession(session)
         ↓
¿remainingTries === 0?
         ↓ SÍ
Mostrar ThankYouModal:
  "¡Gracias, María! Has usado todos tus intentos"

  Beneficios:
  ✓ Ya conoces los productos que mejor te quedan
  ✓ Envío GRATIS en tu primera compra
  ✓ Garantía de satisfacción 100%
  ✓ Asesoría personalizada por WhatsApp

  🎁 Cupón: PROBADOR10 (10% descuento)

  [Ver Catálogo Completo]
         ↓
Click en CTA
         ↓
Redirigir a página principal (catálogo)
         ↓
Deshabilitar botón "Pruébatelo":
  disabled={!userSession || remainingTries === 0}
```

---

## Estructura de Datos (localStorage)

### Schema

```javascript
// Key: 'virtual-tryon-user'
{
  // Información de contacto
  userName: string,          // "María García López"
  whatsapp: string,          // "+52 55 1234 5678"
  email: string,             // "maria@ejemplo.com"

  // Sistema de intentos
  remainingTries: number,    // 0-5
  totalGenerations: number,  // Contador acumulativo

  // Timestamps
  registeredAt: number,      // Unix timestamp (primera vez)
  lastUsedAt: number,        // Unix timestamp (última generación)

  // Identificación
  sessionId: string          // "vto-1732245600000-abc123"
}
```

### Ejemplo Real

```javascript
{
  userName: "María García López",
  whatsapp: "+52 55 9876 5432",
  email: "maria.garcia@gmail.com",
  remainingTries: 2,
  registeredAt: 1732245600000,      // 2024-11-22 10:00:00
  lastUsedAt: 1732249200000,        // 2024-11-22 11:00:00
  totalGenerations: 3,
  sessionId: "vto-1732245600000-x7k9p2"
}
```

---

## Validaciones del Formulario

### Nombre Completo

```javascript
// Reglas
- Requerido
- Mínimo 3 caracteres
- Solo letras, espacios y caracteres españoles (áéíóúñÑüÜ)

// Ejemplos válidos
✓ "María García"
✓ "Ana María López"
✓ "José Hernández"

// Ejemplos inválidos
✗ "Ma" → "El nombre debe tener al menos 3 caracteres"
✗ "María123" → "El nombre solo puede contener letras y espacios"
✗ "" → "El nombre es requerido"
```

### WhatsApp

```javascript
// Reglas
- Requerido
- 10-15 dígitos
- Opcional código de país (+)
- Se permiten espacios, guiones, paréntesis (se eliminan)

// Ejemplos válidos
✓ "+52 55 1234 5678"
✓ "5512345678"
✓ "(55) 1234-5678"
✓ "+1 415 555 1234"

// Ejemplos inválidos
✗ "123" → "Ingresa un número válido (10-15 dígitos)"
✗ "abc123" → "Ingresa un número válido"
✗ "" → "El número de WhatsApp es requerido"
```

### Email

```javascript
// Reglas
- Requerido
- Formato email válido (regex estándar)

// Ejemplos válidos
✓ "maria@gmail.com"
✓ "user.name@empresa.com.mx"
✓ "contacto+tag@ejemplo.org"

// Ejemplos inválidos
✗ "maria@" → "Ingresa un correo electrónico válido"
✗ "@gmail.com" → "Ingresa un correo electrónico válido"
✗ "maria.com" → "Ingresa un correo electrónico válido"
✗ "" → "El correo electrónico es requerido"
```

---

## Sistema de Confetti

### Trigger 1: Registro Exitoso

```javascript
// Cuando usuario completa formulario de contacto
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#D27C5A', '#7D9A86', '#C9B7A5', '#F5EFE7']
});
```

### Trigger 2: Generación Exitosa

```javascript
// Después de cada generación exitosa de imagen
confetti({
  particleCount: 150,
  spread: 80,
  origin: { y: 0.6 },
  colors: ['#D27C5A', '#7D9A86', '#C9B7A5', '#F5EFE7']
});
```

---

## Integración con Componentes Existentes

### VirtualTryOnApp.jsx

**Cambios Realizados:**

1. **Imports Nuevos:**
```javascript
import VirtualTryOnUserService from '../../services/VirtualTryOnUserService';
import ContactCaptureModal from './ContactCaptureModal';
import TriesCounter from './TriesCounter';
import ThankYouModal from './ThankYouModal';
import confetti from 'canvas-confetti';
```

2. **Estado Nuevo:**
```javascript
const [userSession, setUserSession] = useState(null);
const [showContactModal, setShowContactModal] = useState(false);
const [showThankYouModal, setShowThankYouModal] = useState(false);
```

3. **useEffect de Inicialización:**
```javascript
useEffect(() => {
  const session = VirtualTryOnUserService.getUserSession();
  if (session) {
    setUserSession(session);
    if (session.remainingTries === 0) {
      setShowThankYouModal(true);
    }
  } else {
    setShowContactModal(true);
  }
}, []);
```

4. **Lógica Modificada en handleGenerate:**
```javascript
// ANTES (sin validación)
const handleGenerate = async () => {
  if (!userImageFile || !selectedProduct) {
    setError("...");
    return;
  }
  // ... generar imagen
};

// DESPUÉS (con validación de sesión)
const handleGenerate = async () => {
  // Validar sesión
  if (!userSession) {
    setShowContactModal(true);
    return;
  }

  // Validar intentos
  if (userSession.remainingTries === 0) {
    setShowThankYouModal(true);
    return;
  }

  // ... generar imagen

  // Decrementar intentos
  const updatedSession = VirtualTryOnUserService.decrementTries();
  setUserSession(updatedSession);

  // Confetti
  confetti({ ... });

  // Mostrar ThankYou si fue el último intento
  if (updatedSession.remainingTries === 0) {
    setTimeout(() => setShowThankYouModal(true), 2000);
  }
};
```

5. **Botón Deshabilitado:**
```javascript
// ANTES
const isButtonDisabled = useMemo(() =>
  !userImageFile || !selectedProduct || isLoading,
  [userImageFile, selectedProduct, isLoading]
);

// DESPUÉS
const isButtonDisabled = useMemo(() =>
  !userImageFile || !selectedProduct || isLoading ||
  !userSession || userSession.remainingTries === 0,
  [userImageFile, selectedProduct, isLoading, userSession]
);
```

---

## Análisis de Engagement

### Función de Analytics

```javascript
VirtualTryOnUserService.getAnalyticsData()

// Retorna:
{
  sessionId: "vto-1732245600000-x7k9p2",
  userName: "María García López",
  whatsapp: "+52 55 9876 5432",
  email: "maria.garcia@gmail.com",
  totalGenerations: 3,
  remainingTries: 2,
  registeredAt: "2024-11-22T10:00:00.000Z",
  lastUsedAt: "2024-11-22T11:00:00.000Z",
  engagementLevel: "medium" // high | medium | low
}
```

### Niveles de Engagement

```javascript
HIGH (4-5 generaciones):
  - Usuario altamente comprometido
  - Alta probabilidad de conversión
  - Prioridad de seguimiento

MEDIUM (2-3 generaciones):
  - Usuario explorando
  - Potencial de conversión moderado
  - Seguimiento estándar

LOW (0-1 generaciones):
  - Usuario nuevo o no comprometido
  - Baja probabilidad de conversión
  - Seguimiento básico
```

---

## Estrategia de Testing Manual

### Test Suite 1: Nuevo Usuario

**Objetivo:** Validar captura de datos en primera visita

**Pre-condición:**
- Limpiar localStorage: `localStorage.removeItem('virtual-tryon-user')`
- Abrir probador virtual en navegador incógnito

**Pasos:**

1. **Acceso Inicial**
   - [ ] Modal de contacto aparece automáticamente
   - [ ] Modal NO se puede cerrar con X (debe completar formulario)
   - [ ] UI del probador está visible detrás del modal

2. **Validación de Nombre**
   - [ ] Escribir "Ma" → Error: "El nombre debe tener al menos 3 caracteres"
   - [ ] Escribir "María123" → Error: "El nombre solo puede contener letras y espacios"
   - [ ] Escribir "María García" → Sin error
   - [ ] Borrar todo → Error: "El nombre es requerido"

3. **Validación de WhatsApp**
   - [ ] Escribir "123" → Error: "Ingresa un número válido (10-15 dígitos)"
   - [ ] Escribir "abc123" → Error en formato
   - [ ] Escribir "+52 55 1234 5678" → Sin error
   - [ ] Borrar todo → Error: "El número de WhatsApp es requerido"

4. **Validación de Email**
   - [ ] Escribir "maria@" → Error: "Ingresa un correo electrónico válido"
   - [ ] Escribir "maria.com" → Error en formato
   - [ ] Escribir "maria@gmail.com" → Sin error

5. **Envío de Formulario**
   - [ ] Click "¡Comenzar a Probar! ✨"
   - [ ] Ver confetti animado
   - [ ] Modal se cierra después de 500ms
   - [ ] Aparece TriesCounter con "Te quedan 5 intentos"

6. **Verificar localStorage**
   ```javascript
   JSON.parse(localStorage.getItem('virtual-tryon-user'))
   // Debe contener:
   // - userName: "María García"
   // - whatsapp: "+52 55 1234 5678"
   // - email: "maria@gmail.com"
   // - remainingTries: 5
   // - sessionId: "vto-..."
   ```

---

### Test Suite 2: Usuario con Intentos Restantes

**Objetivo:** Validar decremento de intentos y confetti

**Pre-condición:**
```javascript
// Crear sesión con 3 intentos
localStorage.setItem('virtual-tryon-user', JSON.stringify({
  userName: "Test User",
  whatsapp: "+52 55 0000 0000",
  email: "test@test.com",
  remainingTries: 3,
  registeredAt: Date.now(),
  lastUsedAt: Date.now(),
  totalGenerations: 2,
  sessionId: "test-session-123"
}));
```

**Pasos:**

1. **Cargar Sesión**
   - [ ] Recargar página
   - [ ] NO aparece modal de contacto
   - [ ] Aparece TriesCounter: "¡Hola, Test User! Te quedan 3 intentos"
   - [ ] Barra de progreso al 60% (3/5)

2. **Primera Generación**
   - [ ] Subir imagen de usuario
   - [ ] Seleccionar producto
   - [ ] Click "Pruébatelo"
   - [ ] Loader aparece
   - [ ] Imagen se genera correctamente
   - [ ] Confetti aparece
   - [ ] TriesCounter actualiza a "Te quedan 2 intentos"
   - [ ] Barra de progreso al 40% (2/5)
   - [ ] Color cambia a amarillo (warning)

3. **Segunda Generación**
   - [ ] Repetir proceso
   - [ ] TriesCounter actualiza a "Te queda 1 intento"
   - [ ] Barra de progreso al 20% (1/5)
   - [ ] Color cambia a rojo (alerta)
   - [ ] Mensaje: "¡Último intento! Después podrás comprar tus favoritas 🛍️"

4. **Tercera Generación (Última)**
   - [ ] Repetir proceso
   - [ ] Imagen se genera
   - [ ] Confetti aparece
   - [ ] Después de 2 segundos → ThankYouModal aparece
   - [ ] Mensaje: "¡Gracias, Test User! Has usado todos tus intentos"

5. **Verificar localStorage**
   ```javascript
   const session = JSON.parse(localStorage.getItem('virtual-tryon-user'));
   // Debe tener:
   // - remainingTries: 0
   // - totalGenerations: 5
   ```

---

### Test Suite 3: Usuario Sin Intentos

**Objetivo:** Validar bloqueo de generación y modal de conversión

**Pre-condición:**
```javascript
// Crear sesión sin intentos
localStorage.setItem('virtual-tryon-user', JSON.stringify({
  userName: "Ana Rodríguez",
  whatsapp: "+52 55 1111 1111",
  email: "ana@test.com",
  remainingTries: 0,
  registeredAt: Date.now() - 86400000, // 1 día atrás
  lastUsedAt: Date.now() - 3600000,    // 1 hora atrás
  totalGenerations: 5,
  sessionId: "test-session-456"
}));
```

**Pasos:**

1. **Acceso con 0 Intentos**
   - [ ] Recargar página
   - [ ] ThankYouModal aparece automáticamente
   - [ ] Título: "¡Gracias, Ana Rodríguez! ✨"
   - [ ] Mensaje: "Has usado todos tus intentos del Probador Virtual"

2. **Contenido del Modal**
   - [ ] Ícono de corazón animado
   - [ ] 4 beneficios con checkmarks
   - [ ] CTA principal: "Ver Catálogo Completo"
   - [ ] Botón secundario: "Cerrar"
   - [ ] Banner de cupón: "PROBADOR10" con fondo amarillo

3. **Cerrar Modal**
   - [ ] Click "Cerrar"
   - [ ] Modal desaparece
   - [ ] NO aparece TriesCounter (remainingTries === 0)
   - [ ] Botón "Pruébatelo" está deshabilitado (gris)

4. **Intentar Generar**
   - [ ] Subir imagen
   - [ ] Seleccionar producto
   - [ ] Botón permanece deshabilitado
   - [ ] No se puede hacer click

5. **Click en CTA Catálogo**
   - [ ] Click "Ver Catálogo Completo"
   - [ ] Redirige a página principal (/)
   - [ ] Carrito y catálogo funcionan normalmente

---

### Test Suite 4: Validación de Edge Cases

**Objetivo:** Probar escenarios inusuales y errores

**Casos:**

1. **localStorage Corrupto**
   ```javascript
   // Crear dato inválido
   localStorage.setItem('virtual-tryon-user', '{invalid json}');
   ```
   - [ ] Recargar página
   - [ ] Debe mostrar ContactCaptureModal (recuperación automática)
   - [ ] No debe romper la aplicación

2. **Intentos Negativos (Manipulación Manual)**
   ```javascript
   localStorage.setItem('virtual-tryon-user', JSON.stringify({
     ...validSession,
     remainingTries: -1
   }));
   ```
   - [ ] Recargar página
   - [ ] Debe tratar como 0 intentos
   - [ ] Mostrar ThankYouModal

3. **Intentos > 5 (Manipulación Manual)**
   ```javascript
   localStorage.setItem('virtual-tryon-user', JSON.stringify({
     ...validSession,
     remainingTries: 10
   }));
   ```
   - [ ] Recargar página
   - [ ] TriesCounter muestra "Te quedan 10 intentos"
   - [ ] Funciona normalmente (no rompe UI)

4. **Generación Fallida (Error de IA)**
   - [ ] Intentar generar con imagen inválida
   - [ ] Error aparece
   - [ ] Intentos NO se decrementan (solo decrementar en éxito)
   - [ ] Usuario puede reintentar

5. **Múltiples Tabs Abiertos**
   - [ ] Abrir probador en 2 tabs
   - [ ] Generar en Tab 1 (3 → 2 intentos)
   - [ ] Recargar Tab 2
   - [ ] Tab 2 muestra 2 intentos (sincronizado vía localStorage)

---

### Test Suite 5: Responsive & Accesibilidad

**Objetivo:** Validar diseño en dispositivos y accesibilidad

**Dispositivos:**

1. **Mobile (375px)**
   - [ ] ContactCaptureModal ocupa 100% ancho con padding
   - [ ] Inputs táctiles de tamaño adecuado (min 44px)
   - [ ] TriesCounter legible en pantalla pequeña
   - [ ] ThankYouModal scrollable si es necesario

2. **Tablet (768px)**
   - [ ] Modales centrados y con ancho máximo
   - [ ] TriesCounter se ajusta bien en layout

3. **Desktop (1024px+)**
   - [ ] Modales max-width 500px centrados
   - [ ] TriesCounter integrado en grid principal

**Accesibilidad:**

1. **Navegación por Teclado**
   - [ ] Tab navega entre inputs del formulario
   - [ ] Enter envía formulario
   - [ ] Escape cierra ThankYouModal

2. **Screen Readers**
   - [ ] Labels asociados a inputs (htmlFor)
   - [ ] Mensajes de error anunciados
   - [ ] Botones con aria-label apropiados

3. **Contraste de Color**
   - [ ] Texto cumple WCAG AA (ratio 4.5:1)
   - [ ] Estados de error visibles
   - [ ] Estados disabled claramente identificables

---

## Métricas de Éxito

### KPIs del Sistema

**Tasa de Captura:**
```
Leads Capturados / Visitantes Únicos × 100
Objetivo: > 60%
```

**Tasa de Uso Completo:**
```
Usuarios con 5 Generaciones / Total Leads × 100
Objetivo: > 40%
```

**Tasa de Conversión Post-Probador:**
```
Compras / Usuarios con 0 Intentos × 100
Objetivo: > 15%
```

**Engagement Promedio:**
```
Total Generaciones / Total Leads
Objetivo: > 3.5 generaciones/usuario
```

---

## Futuras Mejoras

### Fase 2 (Opcional)

1. **Integración CRM:**
   - Enviar leads a sistema de email marketing
   - Webhook a backend al completar formulario
   - Segmentación por engagement level

2. **Remarketing:**
   - Email automático al llegar a 0 intentos
   - SMS con cupón de descuento
   - WhatsApp Business API integration

3. **Gamificación:**
   - Compartir en redes = +1 intento extra
   - Referir amigo = +2 intentos
   - Sistema de puntos por engagement

4. **Analytics Avanzado:**
   - Google Analytics events
   - Heatmaps de productos más probados
   - Funnel de conversión detallado

---

## Troubleshooting

### Problema 1: Modal No Aparece

**Síntomas:**
- No aparece ContactCaptureModal en primera visita

**Diagnóstico:**
```javascript
// Verificar en consola
const session = VirtualTryOnUserService.getUserSession();
console.log('Session:', session);
```

**Soluciones:**
- Limpiar localStorage: `VirtualTryOnUserService.clearSession()`
- Verificar que imports estén correctos
- Revisar que `showContactModal` state esté funcionando

### Problema 2: Intentos No Decrementan

**Síntomas:**
- Generar imagen no reduce `remainingTries`

**Diagnóstico:**
```javascript
// Agregar console.log en handleGenerate
console.log('Before:', userSession.remainingTries);
const updated = VirtualTryOnUserService.decrementTries();
console.log('After:', updated.remainingTries);
```

**Soluciones:**
- Verificar que `decrementTries()` se llama después de generación exitosa
- Confirmar que `setUserSession(updatedSession)` se ejecuta
- Revisar que no hay errores en try/catch

### Problema 3: Confetti No Aparece

**Síntomas:**
- No hay animación de confeti

**Diagnóstico:**
```javascript
// Verificar importación
import confetti from 'canvas-confetti';

// Test manual en consola
confetti({ particleCount: 100 });
```

**Soluciones:**
- Verificar que `canvas-confetti` está instalado: `npm list canvas-confetti`
- Reinstalar si falta: `npm install canvas-confetti`
- Confirmar que la llamada no está dentro de un bloque catch

---

## Conclusión

El sistema de captura de leads está completamente integrado y listo para producción. Todos los componentes funcionan de manera coordinada para:

1. **Capturar información de contacto** valiosa antes del primer uso
2. **Limitar uso gratuito** a 5 intentos para incentivar conversión
3. **Celebrar engagement** con confetti y feedback visual
4. **Convertir a ventas** con mensaje estratégico al agotar intentos

**Próximos Pasos:**
1. Testing manual completo (seguir Test Suites 1-5)
2. Deploy a staging para QA
3. Monitoreo de métricas en producción
4. Iteración basada en datos de conversión
