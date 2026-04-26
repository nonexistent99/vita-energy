import Navbar from './components/Navbar';
import ThreeSceneCanvas from './components/ThreeSceneCanvas';
import ManifestoSection from './components/Manifesto';
import BuilderSection from './components/BuilderSection';
import GallerySection from './components/GallerySection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative">
      <Navbar />

      {/* 3D Scroll Storytelling — Hero + 4 Scenes */}
      <ThreeSceneCanvas />

      {/* Content sections below the 3D scroll experience */}
      <ManifestoSection />
      <BuilderSection />
      <GallerySection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
