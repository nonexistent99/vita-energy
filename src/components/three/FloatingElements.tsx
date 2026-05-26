import { useRef, useMemo, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingElementsProps {
  scrollProgress: number;
}

interface FloatingElementData {
  x: number;
  y: number;
  z: number;
  s: number;
  floatSpeed: number;
  spinSpeed: number;
}

export default function FloatingElements({ scrollProgress }: FloatingElementsProps) {
  const acaiCount = 20;
  const chocoCount = 15;
  const dropletCount = 120;

  
  const acaiRef = useRef<THREE.InstancedMesh>(null);
  const chocoRef = useRef<THREE.InstancedMesh>(null);
  const dropletRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const generateData = (count: number, spread: number, zRange: [number, number]): FloatingElementData[] => 
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * 20,
      z: zRange[0] - Math.random() * (zRange[1] - zRange[0]),
      s: Math.random(),
      floatSpeed: Math.random() * 0.8 + 0.2,
      spinSpeed: Math.random() * 2,
    }));

  const acaiData = useMemo(() => generateData(acaiCount, 16, [0, 8]), []);
  const chocoData = useMemo(() => generateData(chocoCount, 18, [0, 10]), []);
  const dropletData = useMemo(() => generateData(dropletCount, 20, [-2, 12]), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const animate = (ref: RefObject<THREE.InstancedMesh | null>, data: FloatingElementData[], baseScale: number, speedMult: number) => {
      if (!ref.current) return;
      data.forEach((d, i) => {
        let newY = d.y + (Math.sin(time * d.floatSpeed) * 0.5) - (scrollProgress * 15 * speedMult);
        newY = ((newY + 30) % 20) - 10;
        
        dummy.position.set(d.x, newY, -d.z);
        dummy.rotation.set(time * d.spinSpeed * 0.5, time * d.spinSpeed, 0);
        const s = baseScale * (0.8 + d.s * 0.4);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    };

    animate(acaiRef, acaiData, 0.08, 1);
    animate(chocoRef, chocoData, 0.07, 1.2);
    animate(dropletRef, dropletData, 0.012, 1.5);

  });

  return (
    <group>
      {/* MIST / SMOKE — Soft background layers for atmosphere */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0, -15]}>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial color="#701A75" transparent opacity={0.08} />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-12, 6, -18]}>
          <sphereGeometry args={[10, 32, 32]} />
          <MeshDistortMaterial color="#D946EF" speed={1.5} distort={0.6} transparent opacity={0.05} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
        <mesh position={[14, -8, -14]}>
          <sphereGeometry args={[8, 32, 32]} />
          <MeshDistortMaterial color="#4B1E3A" speed={1} distort={0.4} transparent opacity={0.1} />
        </mesh>
      </Float>

      {/* AÇAÍ BERRIES — Very subtle and slightly blurred */}
      <instancedMesh ref={acaiRef} args={[undefined, undefined, acaiCount]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#1b0824" roughness={0.5} metalness={0.1} />
      </instancedMesh>

      {/* CHOCOLATE DROPS */}
      <instancedMesh ref={chocoRef} args={[undefined, undefined, chocoCount]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#3d1c10" roughness={0.6} metalness={0.0} />
      </instancedMesh>

      {/* WATER DROPLETS — Very small and soft */}
      <instancedMesh ref={dropletRef} args={[undefined, undefined, dropletCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.2} 
          roughness={0} 
          metalness={0.5}
          transmission={1}
        />
      </instancedMesh>

      {/* AMBIENT LIGHTING — Soft brand glows */}
      <pointLight position={[15, 15, -15]} color="#D946EF" intensity={2} distance={40} />
      <pointLight position={[-15, -15, -10]} color="#701A75" intensity={1} distance={35} />

    </group>
  );
}



