import Hero from '../components/Hero';
import ProductCatalog from '../components/ProductCatalog';
import Benefits from '../components/Benefits';
import VideoStorySection from '../components/VideoStorySection';
import Testimonials from '../components/Testimonials';
import PageLayout from '../components/PageLayout';

const Home = () => {
  return (
    <PageLayout>
      {({ openHelpCenter }) => (
        <main>
          <Hero />
          <ProductCatalog />
          <Benefits />
          <VideoStorySection />
          <Testimonials />

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-esbelta-chocolate mb-4">
                  ¿Tienes preguntas?
                </h2>
                <p className="text-esbelta-chocolate-light mb-8">
                  Encuentra guías detalladas y respuestas a todas tus dudas
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={openHelpCenter}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    📖 Centro de Ayuda
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </PageLayout>
  );
};

export default Home;
