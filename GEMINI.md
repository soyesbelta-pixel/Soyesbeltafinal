# GEMINI.md

This file serves as the primary context and instruction guide for Gemini when working on the "Silueta Dorada" (Esbelta) project.

## Project Overview

**Silueta Dorada (Esbelta)** is a Single Page Application (SPA) e-commerce platform specializing in premium Colombian shapewear. It is built with React and focuses on a high-quality mobile-first user experience.

**Key Features:**
-   **Product Catalog**: Responsive grid with filtering and sorting.
-   **Shopping Cart**: Persistent cart with side-drawer UI.
-   **Virtual Try-On**: AI-powered feature allowing users to visualize products.
-   **Size Advisor**: Interactive tool to help customers find their fit.
-   **ChatBot (Sofia)**: AI customer support assistant using OpenRouter/Gemini.
-   **Admin Dashboard**: Protected route for managing products, orders, and leads.
-   **PWA**: Progressive Web App capabilities for offline support and installability.

## Tech Stack

-   **Frontend**: React 19, Vite 7, React Router DOM 7.
-   **Styling**: Tailwind CSS (v3.4) with a custom configuration.
-   **State Management**: Zustand 5 (with localStorage persistence).
-   **Animations**: Framer Motion 12.
-   **Backend**:
    -   **Express Server (`server/`)**: Handles AI chat, emails (Resend), and core logic.
    -   **Serverless Functions (`api/`)**: Vercel-compatible functions for payments (ePayco) and specialized tasks.
-   **Database/Auth**: Supabase (optional/integrated via environment vars).

## Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite development server (default port 5173). |
| `npm run build` | Compile the application for production. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint to check code quality. |
| `npm run migrate:products` | Run the product migration script. |
| `npm run optimize:images` | Convert images to WebP format using Sharp. |

## Architecture & Directory Structure

-   **`src/`**: Main application source code.
    -   **`components/`**: Reusable UI components (Header, Cart, ProductCard, etc.).
    -   **`pages/`**: Route components (Home, Admin, ProductDetails).
    -   **`store/`**: Global state definitions using Zustand (`useStore.js`).
    -   **`services/`**: API clients and service integrations (OpenRouter, Gemini).
    -   **`data/`**: Static data files (`products.js` contains the catalog).
-   **`server/`**: Node.js Express backend.
-   **`api/`**: Serverless API routes.
-   **`public/`**: Static assets (images, icons). Large images are excluded from PWA precache.

## Styling & Design System

The project uses a **custom Tailwind configuration** (`tailwind.config.js`) with a specific color palette.

**Primary Colors:**
-   **Chocolate** (`#2C1E1E`, `#6D4A40`): Main text and headings.
-   **Beige** (`#EAD9C8`, `#DCC9B8`): Buttons, backgrounds, and accents.
-   **Rose** (`#C96F7B`, `#B85F6C`): Notification badges and discount highlights.
-   **Backgrounds**: Paper White (`#FFFFFF`) and Cream (`#F5EFE7`).

**Fonts:**
-   **Headings**: 'Playfair Display' (Serif).
-   **Body**: 'Manrope' (Sans-serif).

**Conventions:**
-   Use `bg-esbelta-cream` or `text-chocolate` for consistent branding.
-   **Mobile-first**: Always verify designs on mobile viewport sizes.

## State Management (Zustand)

Global state is managed via `useStore` and persisted to `localStorage` under the key `silueta-dorada-storage`.
**Slices include:**
-   `cart`: Cart items, total calculation.
-   `user`: Auth state, preferences.
-   `ui`: Modals, sidebars, notifications.

## Development Guidelines

1.  **File Naming**: Use PascalCase for React components (e.g., `ProductCard.jsx`) and camelCase for utilities (`formatCurrency.js`).
2.  **Icons**: Use `lucide-react` for UI icons.
3.  **Images**: Place new images in `public/`. Naming convention: `[product]-[variant]-[sequence].png`.
4.  **Env Variables**:
    -   Frontend: `.env.local` (prefixed with `VITE_`).
    -   Backend: `server/.env`.
5.  **Code Quality**: Run `npm run lint` before finalizing major changes.
