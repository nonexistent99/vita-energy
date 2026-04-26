import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress: number;
}

/**
 * CameraRig — Controls camera position based on scroll progress.
 * 
 * Scene 0 (0.00-0.25): DISCOVERY — wide shot, product centered
 * Scene 1 (0.25-0.50): APPROACH — zoom in, detail view
 * Scene 2 (0.50-0.75): FUNCTIONAL — rotate, show features
 * Scene 3 (0.75-1.00): TRANSITION — pull back, shift right
 */
export default function CameraRig({ scrollProgress }: CameraRigProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.5, 5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const positions = [
    new THREE.Vector3(0, 1.2, 6),      // Higher and further back for Scene 0
    new THREE.Vector3(0.8, 0.8, 4),    // Shifted right and higher for Scene 1
    new THREE.Vector3(-1.2, 1.5, 4.5), // High-angle left for Scene 2
    new THREE.Vector3(3, 0.5, 6),      // Far right for Scene 3
  ];

  const lookAts = [
    new THREE.Vector3(0, 0.4, 0),      // Looking slightly above the bottle center
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(0, 0.5, 0),
    new THREE.Vector3(0, 0.1, 0),
  ];


  useFrame(() => {
    const totalScenes = positions.length - 1;
    const scaled = scrollProgress * totalScenes;
    const idx = Math.min(Math.floor(scaled), totalScenes - 1);
    const t = scaled - idx;

    // Smoothstep
    const smooth = t * t * (3 - 2 * t);

    targetPos.current.lerpVectors(positions[idx], positions[idx + 1], smooth);
    targetLookAt.current.lerpVectors(lookAts[idx], lookAts[idx + 1], smooth);

    // Smooth camera movement
    camera.position.lerp(targetPos.current, 0.08);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
