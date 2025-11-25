# Landing Page - Kit Esbelta Short Invisible

Landing page standalone para el producto Short Levanta Glúteo Invisible de Esbelta.

## 📁 Estructura del Proyecto

```
landing-short-invisible/
├── index.html          # Página principal
├── styles.css          # Estilos personalizados
├── script.js           # JavaScript para interactividad
├── images/             # Imágenes del producto
│   ├── logo-esbelta.png
│   ├── short-negro-1.png
│   ├── cliente1.jpeg
│   ├── cliente2.jpeg
│   └── cliente3.jpeg
└── README.md           # Este archivo
```

## 🚀 Cómo Subir a Hostinger

### Opción 1: FTP (File Transfer Protocol)

1. **Obtén tus credenciales FTP de Hostinger:**
   - Entra a tu panel de Hostinger
   - Ve a "Archivos" → "Administrador de archivos FTP"
   - Anota: Hostname, Usuario, Contraseña

2. **Descarga un cliente FTP:**
   - FileZilla (gratuito): https://filezilla-project.org/
   - WinSCP (Windows): https://winscp.net/

3. **Conecta via FTP:**
   - Abre FileZilla
   - Host: `ftp.tudominio.com` o la IP que te dieron
   - Usuario: tu usuario FTP
   - Contraseña: tu contraseña FTP
   - Puerto: 21

4. **Sube los archivos:**
   - Navega a la carpeta `public_html` en el servidor
   - Arrastra TODOS los archivos de `landing-short-invisible/` al servidor
   - Asegúrate de subir la carpeta `images/` completa

5. **Verifica:**
   - Abre tu navegador
   - Ve a `https://tudominio.com/index.html`
   - ¡Listo!

### Opción 2: Administrador de Archivos de Hostinger

1. **Accede al Panel de Hostinger:**
   - Inicia sesión en Hostinger
   - Ve a "Hosting" → Tu dominio

2. **Abre el Administrador de Archivos:**
   - Haz clic en "Archivos" → "Administrador de archivos"

3. **Sube los archivos:**
   - Navega a la carpeta `public_html`
   - Haz clic en "Subir archivos"
   - Selecciona TODOS los archivos:
     - index.html
     - styles.css
     - script.js
     - Carpeta images/ completa

4. **Configura permisos (opcional):**
   - Los archivos deben tener permisos 644
   - Las carpetas deben tener permisos 755

5. **Verifica:**
   - Abre `https://tudominio.com`

### Opción 3: Git Deploy (Avanzado)

1. **Inicializa Git en la carpeta:**
   ```bash
   cd landing-short-invisible
   git init
   git add .
   git commit -m "Initial commit - Landing Short Invisible"
   ```

2. **Conecta con GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/landing-short-invisible.git
   git push -u origin main
   ```

3. **Configura Auto-Deploy en Hostinger:**
   - Panel Hostinger → Git → Crear repositorio
   - Conecta tu GitHub
   - Selecciona rama `main`
   - Branch: `public_html`

## ⚙️ Configuración

### URLs a Personalizar

Abre `index.html` y `script.js` y busca:

1. **WhatsApp:**
   ```javascript
   https://wa.me/5215559611567
   ```
   Cambia por tu número de WhatsApp con código de país.

2. **Función de carrito:**
   En `script.js`, línea ~145:
   ```javascript
   function agregarAlCarrito() {
       // Integra con tu sistema de e-commerce aquí
   }
   ```

### Velocidad del Carrusel

En `styles.css`, línea ~31:
```css
animation: scroll 25s linear infinite;
```
- Aumenta el valor (ej: 30s) para hacerlo más lento
- Disminuye el valor (ej: 20s) para hacerlo más rápido

## 🎨 Personalización

### Colores

En `styles.css`, líneas 15-21:
```css
:root {
    --chocolate: #2C1E1E;
    --white-perlado: #FBF7F4;
    --beige-arena: #D7BFA3;
    --coral: #F88379;
    --fuschia: #E64A7B;
}
```

### Fuentes

En `index.html`, línea 14:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

## 📊 Integración con Analytics

### Google Analytics 4

1. Crea una cuenta en https://analytics.google.com
2. Obtén tu Measurement ID (G-XXXXXXXXXX)
3. Agrega antes del `</head>` en `index.html`:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```


2. Agrega antes del `</head>` en `index.html`:

```html
<script>
!function(f,b,e,v,n,t,s)
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
</script>
```

## 🛒 Integración con E-Commerce

### Opción 1: WhatsApp Checkout

Ya configurado en el botón "Comprar Kit ahora". El cliente contacta via WhatsApp.

### Opción 2: MercadoPago

```javascript
// En script.js, reemplazar agregarAlCarrito()
function agregarAlCarrito() {
    window.location.href = 'https://mpago.la/TU_LINK_DE_PAGO';
}
```

### Opción 3: Shopify Buy Button

1. Crea un producto en Shopify
2. Genera el botón de compra
3. Reemplaza el botón en `index.html`

## 🔧 Solución de Problemas

### Las imágenes no se ven

- Verifica que la carpeta `images/` esté en el servidor
- Revisa que los nombres de archivo coincidan (mayúsculas/minúsculas importan)
- Verifica permisos: carpetas 755, archivos 644

### El carrusel no se mueve

- Abre la consola del navegador (F12)
- Verifica que no haya errores de JavaScript
- Asegúrate de que `script.js` se cargó correctamente

### Errores de Tailwind CSS

- Verifica conexión a internet (Tailwind se carga via CDN)
- Si necesitas uso offline, descarga Tailwind localmente

## 📱 Responsive Design

La landing está optimizada para:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

## 🌐 SEO

El archivo incluye:
- Meta tags optimizados
- Títulos descriptivos
- Alt tags en imágenes
- Estructura semántica HTML5

Para mejorar SEO:
1. Agrega un `sitemap.xml`
2. Crea un `robots.txt`
3. Registra en Google Search Console
4. Optimiza velocidad con Cloudflare

## 📞 Soporte

Para más ayuda:
- Email: soporte@esbelta.com (cambiar por tu email)
- WhatsApp: +52 55 5961 1567 (cambiar por tu número)

## 📄 Licencia

© 2025 Esbelta - Fajas Colombianas Premium. Todos los derechos reservados.
