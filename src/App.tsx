import { useEffect, useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import OrderSection from './components/OrderSection';
import PromoBanners from './components/PromoBanners';
import { clearAdminSession, isAdminAuthenticated } from './utils/adminAuth';

function isAdminRoute() {
  return window.location.pathname === '/admin'
    || window.location.hash === '#/admin'
    || window.location.hash === '#admin';
}

export default function App() {
  const [adminOpen, setAdminOpen] = useState(() => isAdminRoute());
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => isAdminAuthenticated());

  useEffect(() => {
    const syncRoute = () => setAdminOpen(isAdminRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const logoutAdmin = () => {
    clearAdminSession();
    setAdminAuthenticated(false);
  };

  if (adminOpen && !adminAuthenticated) {
    return <AdminLogin onAuthenticated={() => setAdminAuthenticated(true)} />;
  }

  if (adminOpen) return <AdminPanel onLogout={logoutAdmin} />;

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
