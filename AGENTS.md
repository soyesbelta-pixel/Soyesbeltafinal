# Repository Guidelines

## Estructura del proyecto y organización de módulos
El código fuente vive en `src/`. Ubica componentes reutilizables en `src/components/`, datos compartidos en `src/data/`, estado global con Zustand en `src/store/` y servicios externos en `src/services/`. Los estilos globales residen en `src/index.css`; los activos pesados pasan a `public/` o `src/assets/`. Ejecuta `scripts/generate-icons.js` antes de publicar nuevas imágenes procesables. No versiones artefactos de `dist/`.

## Comandos de desarrollo, build y pruebas
- `npm install`: instala dependencias del proyecto.
- `npm run dev`: levanta Vite con HMR para pruebas manuales.
- `npm run build`: genera el bundle optimizado en `dist/`.
- `npm run preview`: sirve el build final para validación.
- `npm run lint`: aplica ESLint (reglas recomendadas, React Hooks, React Refresh).

## Estilo de código y convenciones de nombres
Usa componentes funcionales y PascalCase (`SizeAdvisor.jsx`) para archivos de UI. Hooks y selectores siguen camelCase (`useStore`, `getCartCount`). Mantén indentación de dos espacios y reutiliza utilidades Tailwind y la paleta `esbelta-*` definida en `tailwind.config.js`. Mantén el texto visible para clientes en español y centraliza strings repetibles en `src/data/`.

## Guía de pruebas
No hay suite automatizada activa. Valida manualmente con `npm run dev`, revisando flujo de compra, asesor de tallas, chat, notificaciones y consola. Si agregas Vitest + Testing Library, nombra archivos `*.test.jsx` o ubícalos en `src/__tests__/` y documenta nuevos scripts en este archivo.

## Commits y Pull Requests
Usa Conventional Commits en modo imperativo y hasta 72 caracteres (`feat: agrega asesor de tallas`). Incluye en la descripción qué y por qué. Las PR deben traer resumen claro, evidencia visual para cambios UI, pasos de prueba manual y enlace a la tarea. Solicita revisión a la persona dueña del área antes de fusionar.

## Seguridad y configuración
Nunca publiques API keys. Usa `import.meta.env.VITE_GEMINI_API_KEY` en `src/services/GeminiService.js` con variables de entorno y ofrece un `.env.example` sin secretos. Tras cambios en `src/data/products`, valida respuestas del chatbot y rota credenciales según campaña o proveedor.
