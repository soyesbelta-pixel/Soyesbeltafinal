const SiteFooter = () => {
  return (
    <footer className="text-esbelta-cream py-12 mt-16" style={{ backgroundColor: '#4E3229' }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-esbelta-cream font-bold mb-4">Esbelta</h3>
            <p className="text-sm text-esbelta-sand-light">
              Shapewear colombiano premium que moldea, realza y transforma tu figura al instante. Calidad certificada, resultados garantizados.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/faq" className="text-esbelta-sand-light hover:text-esbelta-terracotta transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li><a href="/catalogo" className="text-esbelta-sand-light hover:text-esbelta-terracotta">Catálogo</a></li>
              <li><a href="#" className="text-esbelta-sand-light hover:text-esbelta-terracotta">Envíos</a></li>
              <li><a href="#" className="text-esbelta-sand-light hover:text-esbelta-terracotta">Términos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-esbelta-sand-light">
              <li>📧 ventas@esbelta.com</li>
              <li>📞 +57 300 123 4567</li>
              <li>📍 Medellín, Colombia</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/esbeltasoy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-esbelta-sand via-esbelta-terracotta to-esbelta-chocolate text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Síguenos en Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm10.5 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/esbeltasoy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-esbelta-sand via-esbelta-terracotta to-esbelta-chocolate text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Síguenos en Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10h2.5l.5-3H13V5.5c0-.9.3-1.5 1.6-1.5H16V1.1C15.4 1 14.2 1 13 1c-2.4 0-4 1.6-4 4.3V7H7v3h2v9h4v-9z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@soyesbelta"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-esbelta-sand via-esbelta-terracotta to-esbelta-chocolate text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Síguenos en TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-esbelta-sand">
          © 2024 Esbelta. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
