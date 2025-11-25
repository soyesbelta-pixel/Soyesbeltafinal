# Admin Product Management System - Setup Guide

## Overview

The admin product management system allows you to manage products (images, prices, colors, sizes) through a web interface without editing code directly. The system uses Supabase as the backend and includes a fallback to static product data.

## Features

- ✅ **Product CRUD**: Create, Read, Update, Delete products
- ✅ **Image Management**: Upload multiple images per color with drag-and-drop
- ✅ **Automatic Optimization**: Images are compressed to WebP format
- ✅ **Feature Flag System**: Toggle between Supabase and static data
- ✅ **Fallback Mechanism**: Automatically uses static products.js if Supabase fails
- ✅ **Caching**: Smart caching to reduce API calls
- ✅ **Audit Trail**: Track all product changes with timestamps

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL schema file: `supabase/schema.sql`
4. This creates all necessary tables, policies, and storage buckets

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_USE_SUPABASE=false  # Start with false for testing
   ```

### 3. Test the System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin` and login

3. Go to the "Productos" tab

4. You should see all products from `products.js` (static mode)

### 4. Enable Supabase Mode

1. In the Admin Dashboard, click "Modo Supabase" button

2. The system will now use the Supabase backend

3. Try creating a new product to test the upload functionality

4. To make Supabase mode permanent, set in `.env.local`:
   ```env
   VITE_USE_SUPABASE=true
   ```

## Usage Guide

### Creating a New Product

1. Click "Crear Producto" button
2. Fill in the 4 tabs:
   - **Información Básica**: Name, category, description, price, features
   - **Imágenes**: Upload images for each color (drag-and-drop supported)
   - **Variantes**: Select available sizes and add colors
   - **Vista Previa**: Review how the product will look
3. Click "Guardar Producto"

### Editing a Product

1. Find the product in the grid
2. Click "Editar" button
3. Make your changes in the modal
4. Click "Guardar Producto"

### Deleting a Product

1. Click the trash icon on a product card
2. Confirm the deletion
3. Product is soft-deleted (set to `is_active = false`)

### Managing Images

- **Upload**: Drag files into the upload area or click to browse
- **Reorder**: Drag images to change their order
- **Remove**: Hover over an image and click the X button
- **Primary**: The first image is automatically set as primary

## Architecture

### Service Layer

```
ProductService.js → Manages product CRUD with caching and fallback
ImageService.js → Handles image uploads and optimization
supabaseClient.js → Supabase connection and auth
```

### Components

```
AdminDashboard → Main dashboard with tabs
  ├─ ProductManager → Product list and management
  ├─ ProductEditor → Modal for creating/editing products
  └─ ImageUploader → Drag-and-drop image upload component
```

### Database Schema

```
products → Main product table
  ├─ product_features → Product features/benefits
  ├─ product_sizes → Available sizes
  ├─ product_colors → Available colors
  ├─ product_images → Images linked to colors
  └─ product_audit_log → Change tracking
```

## Feature Flag System

The system uses a feature flag to toggle between modes:

**Static Mode (Default)**:
- Uses `src/data/products.js`
- No database required
- Read-only (Create/Edit/Delete disabled)
- Safe for development/testing

**Supabase Mode**:
- Uses PostgreSQL database
- Full CRUD operations
- Image upload to Supabase Storage
- Requires proper setup

Toggle modes:
1. Click "Modo Supabase" / "Modo Estático" button in dashboard
2. Or set `VITE_USE_SUPABASE=true` in `.env.local`

## Migration from Static to Supabase

When you're ready to migrate existing products:

1. Ensure Supabase is properly configured
2. Run the migration script (to be created):
   ```bash
   npm run migrate:products
   ```
3. This will:
   - Upload all images from `/public/` to Supabase Storage
   - Create product records in database
   - Link images to colors
   - Create size/color/feature records

## Troubleshooting

### Images not uploading
- Check Supabase Storage bucket exists: `product-images`
- Verify RLS policies allow uploads for authenticated users
- Check browser console for errors

### Products not loading
- Verify `.env.local` has correct Supabase credentials
- Check browser console for API errors
- Try toggling to Static Mode to verify fallback works

### Permission errors
- Ensure you're logged in as admin
- Check Supabase RLS policies are correctly configured
- Verify `auth.role() = 'authenticated'` policy exists

### Build errors
- Run `npm run lint` to check for code errors
- Verify all imports are correct
- Check TypeScript/ESLint warnings

## Security Notes

⚠️ **Important Security Considerations**:

1. **RLS Policies**: Always use Row Level Security in Supabase
2. **Admin Authentication**: Only authenticated users can create/edit/delete
3. **Public Read**: Products are publicly readable when `is_active = true`
4. **Image Validation**: Client-side validation prevents large uploads
5. **API Keys**: Never commit `.env.local` to version control

## Performance Optimization

The system includes several optimizations:

1. **Image Compression**: All images converted to WebP (85% quality)
2. **Smart Caching**: 5-minute TTL cache for product data
3. **Lazy Loading**: Images loaded on-demand
4. **Batch Operations**: Multiple image uploads in parallel
5. **Fallback System**: Automatic fallback prevents downtime

## Next Steps

1. **Create Migration Script**: Automate transfer from static to Supabase
2. **Add Bulk Operations**: Import/export products via CSV
3. **Image Variants**: Auto-generate thumbnails and different sizes
4. **Search Optimization**: Add full-text search with PostgreSQL
5. **Analytics**: Track product views and conversions

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check Supabase logs for backend issues
4. Verify environment variables are set correctly
