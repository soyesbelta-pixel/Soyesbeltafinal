import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import CatalogCinema from '../components/CatalogCinema';
import useStore from '../store/useStore';

const CatalogPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PageLayout>
      {() => (
        <main>
          {mounted && <CatalogCinema />}
        </main>
      )}
    </PageLayout>
  );
};

export default CatalogPage;
