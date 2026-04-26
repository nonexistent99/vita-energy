import { Environment, SpotLight } from '@react-three/drei';


/**
 * SceneLights — Refined studio lighting setup
 * Professional three-point lighting with brand-colored accents
 */
export default function SceneLights() {
  return (
    <>
      {/* Key light — Main illumination, very soft and wide */}
      <SpotLight
        position={[0, 15, 15]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        castShadow
        color="#ffffff"
      />

      {/* Rim light — Highlights the edges from behind-left */}
      <SpotLight
        position={[-15, 10, -10]}
        angle={0.5}
        penumbra={1}
        intensity={2.5}
        color="#D946EF"
      />

      {/* Back-glow — focused further away to blend with background */}
      <pointLight
        position={[0, 5, -20]}
        intensity={8}
        color="#701A75"
        distance={50}
      />

      {/* Ambient fill — soft and neutral */}
      <ambientLight intensity={0.6} color="#ffffff" />

      {/* Environment for reflections — Subtle studio setup */}
      <Environment preset="studio" environmentIntensity={0.8} />
    </>



  );
}
