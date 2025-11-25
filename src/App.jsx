import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ShortInvisibleLanding from './pages/ShortInvisibleLandingNew';
import ShortInvisibleLandingReact from './pages/ShortInvisibleLandingReact';
import PaymentResponse from './pages/PaymentResponse';

import DesignSystemPreview from './pages/DesignSystemPreview';

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/design-preview" element={<DesignSystemPreview />} />
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/productos/short-invisible" element={<ShortInvisibleLanding />} />
        <Route path="/landing" element={<ShortInvisibleLandingReact />} />
        <Route path="/payment-response" element={<PaymentResponse />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}

export default App;
