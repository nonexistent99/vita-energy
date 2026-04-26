import { ContactShadows, MeshReflectorMaterial } from '@react-three/drei';

/**
 * Floor — A soft, cinematic studio floor with very blurred reflections.
 */
export default function Floor() {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Contact Shadows — essential for grounding the product */}
      <ContactShadows 
        opacity={0.6} 
        scale={20} 
        blur={2} 
        far={4} 
        resolution={1024} 
        color="#000000"
      />
      
      {/* Reflective Plane — Very subtle, very blurred */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={2}
          roughness={1}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1}
          color="#050107"
          metalness={0}
          mirror={0}
        />

      </mesh>
    </group>
  );
}


