import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CubeletProps {
  position: [number, number, number];
  colors: (string | null)[];
}

const Cubelet = ({ position, colors }: CubeletProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Colors for each face: [right, left, top, bottom, front, back]
  const colorMap: { [key: string]: string } = {
    white: '#f0f0f0',
    yellow: '#ffd500',
    red: '#e74c3c',
    orange: '#ff8c00',
    blue: '#3498db',
    green: '#2ecc71',
  };

  const materials = colors.map((color) => {
    if (color === null) {
      return new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        metalness: 0.3,
        roughness: 0.7,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: colorMap[color],
      metalness: 0.2,
      roughness: 0.3,
    });
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
};

const RubiksCube = () => {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (groupRef.current && !isDragging.current) {
      groupRef.current.rotation.x += 0.002;
      groupRef.current.rotation.y += 0.003;
    }
  });

  // Generate all 27 cubelets
  const cubelets = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Determine which faces are visible
        const colors: (string | null)[] = [
          x === 1 ? 'red' : null,    // right
          x === -1 ? 'orange' : null, // left
          y === 1 ? 'white' : null,   // top
          y === -1 ? 'yellow' : null, // bottom
          z === 1 ? 'blue' : null,    // front
          z === -1 ? 'green' : null,  // back
        ];

        cubelets.push(
          <Cubelet
            key={`${x}-${y}-${z}`}
            position={[x * 1.05, y * 1.05, z * 1.05]}
            colors={colors}
          />
        );
      }
    }
  }

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        isDragging.current = true;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (isDragging.current && groupRef.current) {
          const deltaX = e.clientX - previousMousePosition.current.x;
          const deltaY = e.clientY - previousMousePosition.current.y;

          groupRef.current.rotation.y += deltaX * 0.01;
          groupRef.current.rotation.x += deltaY * 0.01;

          previousMousePosition.current = { x: e.clientX, y: e.clientY };
        }
      }}
      onPointerUp={() => {
        isDragging.current = false;
      }}
      onPointerLeave={() => {
        isDragging.current = false;
      }}
    >
      {cubelets}
    </group>
  );
};

export default RubiksCube;
