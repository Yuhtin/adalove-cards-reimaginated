'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const FloatingOrb = ({ position, color, speed }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.8) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.1} floatIntensity={0.2}>
      <Sphere ref={meshRef} position={position} scale={[0.8, 0.8, 0.8]}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.1}
          wireframe
          distort={0.3}
          speed={speed}
        />
      </Sphere>
    </Float>
  );
};

const ParticleField = () => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        color: Math.random() > 0.5 ? '#E30614' : '#F25050',
        speed: Math.random() * 0.5 + 0.2
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <FloatingOrb
          key={index}
          position={particle.position}
          color={particle.color}
          speed={particle.speed}
        />
      ))}
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#E30614" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F25050" />
        
        <ParticleField />
        
        {/* Central focal orb */}
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <Sphere position={[0, 0, 0]} scale={[2, 2, 2]}>
            <MeshDistortMaterial
              color="#E30614"
              transparent
              opacity={0.05}
              wireframe
              distort={0.5}
              speed={0.3}
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
};

export default ThreeBackground;