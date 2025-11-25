# Silueta Dorada – React + Vite

Aplicación SPA de e‑commerce para Esbelta (fajas colombianas) con checkout, panel admin y probador virtual.

## Scripts
- `npm run dev` – Vite con HMR.
- `npm run build` – build de producción.
- `npm run preview` – sirve el build.
- `npm run lint` – ESLint.
- Migraciones: `npm run migrate:products`, `npm run migrate:virtual-tryon`.
- Optimización de medios: `npm run optimize:images`, `npm run optimize:videos`.

## Estructura
- `src/` UI (React, Tailwind, Zustand), páginas (`pages/`), componentes (`components/`), datos (`data/`), servicios (`services/`), store (`store/`).
- `server/` backend Express con OpenRouter/Gemini, email vía Resend y endpoints de chatbot/try-on/emails.
- `api/` funciones serverless (chat, emails, ePayco, virtual-tryon).
- `scripts/` utilidades de migración y optimización de assets.

## Variables de entorno (ejemplo)
Crear `.env.local` (frontend) y `server/.env` (backend) sin exponer secretos:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_USE_SUPABASE=true|false`
- `VITE_BACKEND_URL` (ej: `http://localhost:3001`)
- `VITE_EPAYCO_PUBLIC_KEY`, `VITE_GEMINI_API_KEY`
- `OPENROUTER_API_KEY`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE`

## Flujo principal
1) Home con catálogo, asesor de talla, carrito lateral y testimonios.
2) Admin: login (`/admin`) y dashboard (`/admin/dashboard`) con gestión de pedidos, productos, leads y probador virtual.
3) Landing específica `ShortInvisibleLandingReact` con checkout embebido y cálculo de envíos por ciudad/departamento.

## Notas de calidad
- Validar manualmente checkout y flujos críticos (`npm run dev`).
- No guardar builds en git (`dist/` ignorado).
- Assets pesados están en `public/`; ejecutar scripts de optimización antes de subir nuevos.
