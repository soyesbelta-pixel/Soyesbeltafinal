# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Silueta Dorada (brand name: "Esbelta") is an e-commerce React application for selling Colombian shapewear ("fajas colombianas"). The app features a responsive product catalog, shopping cart, size advisor, and customer support tools.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Generate PWA icons (requires existing /public/icon.svg)
node scripts/generate-icons.js
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 19 with Vite 7
- **Styling**: TailwindCSS with custom color palette
- **State Management**: Zustand 5 with persist middleware (localStorage)
- **Animations**: Framer Motion 12
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **PWA**: Vite Plugin PWA for progressive web app features
- **Backend Services**: Supabase for database, auth, and storage
- **AI Services**: OpenRouter API (chatbot), Google Gemini (Virtual Try-On)

### Project Structure
- `/src/components/` - React components (ProductCatalog, Cart, SizeAdvisor, ChatBot, etc.)
- `/src/components/VirtualTryOn/` - AI-powered virtual try-on feature components
- `/src/components/admin/` - Admin dashboard components (ProductManager, OrdersManager)
- `/src/pages/` - Route-level page components
- `/src/store/` - Zustand store configuration (useStore.js)
- `/src/data/` - Product data and configurations (products.js, colombianLocations.js)
- `/src/services/` - External service integrations
- `/src/hooks/` - Custom React hooks (useEPayco.js)
- `/src/utils/` - Utility functions (formValidation.js, exportToExcel.js)
- `/public/` - Static assets including product images and videos
- `/scripts/` - Build and migration scripts

### Key Components
- **PageLayout**: Shared layout wrapper with Header, Footer, modals (Cart, SizeAdvisor, HelpCenter, VirtualTryOn, ChatBot)
- **ProductCatalog**: Product grid with category filtering
- **Cart**: Shopping cart with persistent state via Zustand
- **PaymentGateway/EPaycoCheckout**: Colombian payment gateway integration
- **VirtualTryOnApp**: AI-powered garment visualization using Gemini
- **ChatBot**: AI customer support with OpenRouter (assistant: "Alexa")
- **AdminDashboard**: Protected admin panel for orders, products, and leads

## State Management

The app uses Zustand with persistence (localStorage key: `silueta-dorada-storage`) for:
- Shopping cart items with quantity management
- Subscription panel state and dismissal tracking
- User preferences and authentication
- Notification management with auto-removal
- Product comparison and favorites
- ChatBot messages and conversation state

State is persisted to localStorage and automatically rehydrated on app load. Cart operations trigger custom events (`cartSuccess`) for UI celebrations.

## Styling System

### Custom Color Palette (defined in tailwind.config.js)
**Primary palette:**
- **chocolate**: #2C1E1E (primary text)
- **chocolate-light**: #6D4A40 (secondary text)
- **beige**: #EAD9C8 (buttons, soft backgrounds)
- **rose**: #C96F7B (accents, badges)
- **paper**: #FFFFFF (main background)
- **line**: #EDE9E6 (borders)

**Legacy compatibility (esbelta.* prefix):**
- `esbelta-chocolate`, `esbelta-cream`, `esbelta-sand`, `esbelta-sage`, `esbelta-terracotta`

**Typography:**
- Headings: Playfair Display (serif)
- Body: Manrope (sans-serif)

Use color classes like: `bg-beige`, `text-chocolate`, `border-line`, etc.

## Product Data Structure

Products are stored in `/src/data/products.js` with the following structure:
- Multiple product images per color variant
- Size availability (XS to XXL)
- Price with discount calculations
- Stock tracking
- Rating and review counts

## PWA Configuration

The app is configured as a Progressive Web App with:
- Service worker auto-update (`registerType: 'autoUpdate'`)
- Offline caching strategy (runtime caching for external resources)
- App manifest for installability (name: "Esbelta - Fajas Colombianas Premium")
- Custom icons for different devices (192x192, 512x512, etc.)
- Maximum file size to cache: 2MB (excludes large product images)

## Image Assets

Product images are stored in `/public/` with naming convention: `[product-type]-[variant]-[number].png`
Example: `/short-magic-negro-1.png`, `/short-magic-beige-2.png`
The PWA configuration excludes large images from precaching to optimize performance.

## Important Conventions

1. All prices are in Colombian Pesos (COP) without decimals
2. Component files use .jsx extension
3. Mobile-first responsive design approach
4. Use Framer Motion for animations when adding new UI interactions
5. WhatsApp integration for customer support: +57 314 740 4023
6. Custom event system for UI feedback (e.g., `window.dispatchEvent(new CustomEvent('cartSuccess'))`)
7. Lazy loading for modals and heavy components via `React.lazy()`

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with hero, catalog, benefits |
| `/catalogo` | CatalogPage | Full product catalog |
| `/producto/:id` | ProductPage | Product detail page |
| `/faq` | FaqPage | FAQ section |
| `/productos/short-invisible` | ShortInvisibleLanding | Product landing page |
| `/landing` | ShortInvisibleLandingReact | Alternative landing |
| `/payment-response` | PaymentResponse | ePayco callback handler |
| `/admin` | AdminLogin | Admin authentication |
| `/admin/dashboard` | AdminDashboard | Protected admin panel |

## External Integrations

- **Supabase**: Database for products, orders, email subscriptions, and Virtual Try-On leads
- **OpenRouter API**: AI chatbot functionality (assistant named "Alexa")
- **Google Gemini**: Virtual Try-On AI image generation
- **ePayco**: Colombian payment gateway
- **WhatsApp**: Direct links for customer support with pre-filled messages
- **Unsplash**: Image CDN for some product photos (cached by service worker)

## Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Backend environment (for chatbot):
- Development: `http://localhost:3001`
- Production: Uses relative `/api/*` routes (Vercel serverless)
