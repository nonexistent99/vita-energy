import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ProductModelProps {
  scrollProgress: number;
}

export default function ProductModel({ scrollProgress }: ProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/model3d/vita_energy_fixed.glb');
  const targetRotationY = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Subtle floating animation independent of scroll
    groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.08;

    // 1. Calculate target values based on scrollProgress
    const targetScale = (1 + scrollProgress * 0.3) * 3;
    const targetRotX = scrollProgress * 0.15;
    
    // We add a large rotation mapper so the user feels exactly "connected" when scrolling
    const scrollRotY = scrollProgress * Math.PI * 2.5;

    // 2. Smooth Lerping for that elegant, fluid transition
    // Lerp Scale
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.04);
    
    // Lerp Rotation X
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);

    // Lerp Rotation Y (connected feeling)
    targetRotationY.current = THREE.MathUtils.lerp(targetRotationY.current, scrollRotY, 0.06);
    
    // We combine the scroll-connected rotation with a gentle idle spin
    groupRef.current.rotation.y = targetRotationY.current + (Date.now() * 0.0002);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/model3d/vita_energy_fixed.glb');

