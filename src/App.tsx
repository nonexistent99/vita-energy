import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import OrderSection from './components/OrderSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative bg-brand-deep text-white min-h-screen">
      <Navbar />
      
      {/* 
        Simplified flow:
        1. Hero with the frame animation
        2. Order section right away
      */}
      <HeroSection />
      <OrderSection />
      <Footer />
    </div>
  );
}
