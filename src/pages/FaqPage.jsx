import PageLayout from '../components/PageLayout';

const FaqPage = () => {
  const faqs = [
    { q: '¿Cuánto tarda el envío?', a: 'De 2 a 5 días hábiles según ciudad. Contraentrega en Antioquia.' },
    { q: '¿Puedo cambiar la talla?', a: 'Sí, dentro de los 7 días posteriores a la entrega. Producto sin uso y con etiquetas.' },
    { q: '¿Cómo elijo la talla correcta?', a: 'Revisa la guía de tallas en el catálogo o abre el Asesor de Tallas para una recomendación.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Contraentrega en Antioquia, y pagos en línea con ePayco para el resto del país.' },
  ];

  return (
    <PageLayout>
      {() => (
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-esbelta-chocolate mb-6">Centro de Ayuda</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((item, idx) => (
              <div key={idx} className="p-6 border border-esbelta-sand-light rounded-xl shadow-sm bg-white">
                <h3 className="font-semibold text-esbelta-chocolate mb-2">{item.q}</h3>
                <p className="text-esbelta-chocolate-light">{item.a}</p>
              </div>
            ))}
          </div>
        </main>
      )}
    </PageLayout>
  );
};

export default FaqPage;
