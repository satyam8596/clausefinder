import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PresentationControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple Contract Model
function ContractModel(props: any) {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      (state.mouse.x * Math.PI) / 10,
      0.1
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      (state.mouse.y * Math.PI) / 10,
      0.1
    );
  });

  return (
    <mesh
      {...props}
      ref={ref}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[3, 4, 0.2]} />
      <meshStandardMaterial color="#f0f0f0" roughness={0.5} metalness={0.2} />
      
      {/* Lines representing text */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[0, 1.5 - i * 0.3, 0.11]}>
          <boxGeometry args={[2.5, 0.05, 0.01]} />
          <meshStandardMaterial color="#666" transparent opacity={0.8 - i * 0.05} />
        </mesh>
      ))}
      
      {/* Contract title */}
      <mesh position={[0, 1.8, 0.11]}>
        <boxGeometry args={[2, 0.2, 0.01]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>
      
      {/* Signature line */}
      <mesh position={[0.8, -1.3, 0.11]}>
        <boxGeometry args={[1, 0.05, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </mesh>
  );
}

export function ContractModelCanvas() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 30 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Float rotationIntensity={0.2} floatIntensity={0.5}>
          <ContractModel position={[0, 0, 0]} />
        </Float>
      </PresentationControls>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.5} 
      />
    </Canvas>
  );
} 