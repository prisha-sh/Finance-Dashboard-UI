/* eslint-disable react/no-unknown-property -- react-three/fiber maps Three.js props to the scene graph */
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
function FloatingRings() {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.12;
    group.current.rotation.x = Math.sin(t * 0.25) * 0.08;
  });

  const rings = useMemo(
    () => [
      { radius: 2.4, tube: 0.035, rot: [0.5, 0.2, 0.1], opacity: 0.28 },
      { radius: 1.85, tube: 0.028, rot: [0.2, 0.9, 0.4], opacity: 0.2 },
      { radius: 1.35, tube: 0.022, rot: [0.8, 0.1, 0.6], opacity: 0.35 },
    ],
    []
  );

  return (
    <group ref={group} position={[0.6, 0.1, 0]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={r.rot}>
          <torusGeometry args={[r.radius, r.tube, 20, 96]} />
          <meshBasicMaterial
            color="#dfff00"
            transparent
            opacity={r.opacity}
            wireframe
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ count = 72 }) {
  const points = useRef(null);
  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  });

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#c8db00"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function DashboardBackdrop({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <FloatingRings />
        <ParticleField count={88} />
      </Canvas>
    </div>
  );
}
