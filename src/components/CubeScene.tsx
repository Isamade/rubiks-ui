import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { RubiksCube } from './RubiksCube2';

const CubeScene = () => {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls 
          enablePan={false}
          minDistance={4}
          maxDistance={15}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />
        
        {/* The Rubik's Cube */}
        <RubiksCube />
      </Canvas>
    </div>
  );
};

export default CubeScene;