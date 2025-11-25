import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import ProductService from '../services/ProductService';
import ImageCarousel from '../components/ImageCarousel';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const data = await ProductService.getProduct(id);
      setProduct(data || null);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  return (
    <PageLayout>
      {() => (
        <main className="container mx-auto px-4 py-12">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && !product && (
            <div className="text-center py-16 space-y-4">
              <h1 className="text-2xl font-bold text-esbelta-chocolate">Producto no encontrado</h1>
              <Link to="/catalogo" className="btn-secondary">Volver al catálogo</Link>
            </div>
          )}

          {!loading && product && (
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                {product.images?.length ? (
                  <ImageCarousel images={product.images} autoPlay={false} objectFit="cover" />
                ) : (
                  <img src={product.image} alt={product.name} className="w-full rounded-xl" loading="lazy" decoding="async" />
                )}
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-esbelta-chocolate">{product.name}</h1>
                <p className="text-2xl font-bold text-esbelta-chocolate">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
                </p>
                <p className="text-esbelta-chocolate-light leading-relaxed">{product.description}</p>

                {product.features?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-esbelta-chocolate mb-2">Características</h3>
                    <ul className="list-disc list-inside space-y-1 text-esbelta-chocolate-light">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-esbelta-chocolate mb-2">Tallas</h3>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <span key={size} className="px-3 py-1 border border-esbelta-sand rounded-lg text-sm">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Link to="/catalogo" className="btn-secondary">Volver al catálogo</Link>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </PageLayout>
  );
};

export default ProductPage;
