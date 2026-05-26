import { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import OrderSection from './components/OrderSection';
import PromoBanners from './components/PromoBanners';

function isAdminRoute() {
  return window.location.pathname === '/admin'
    || window.location.hash === '#/admin'
    || window.location.hash === '#admin';
}

export default function App() {
  const [adminOpen, setAdminOpen] = useState(() => isAdminRoute());

  useEffect(() => {
    const syncRoute = () => setAdminOpen(isAdminRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  if (adminOpen) return <AdminPanel />;

  return (
    <div className="relative bg-brand-deep text-white min-h-screen">
      <Navbar />
      <HeroSection />
      <PromoBanners />
      <OrderSection />
      <Footer />
    </div>
  );
}
