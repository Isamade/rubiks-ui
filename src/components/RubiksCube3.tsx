import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { usePostData } from "@/hooks/usePostData";

interface CubePieceProps {
  position: [number, number, number];
  colors: string[];
}

const CubePiece = ({ position, colors }: CubePieceProps) => {
  return (
    <group position={position}>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#1a1a1a" />
      </RoundedBox>
      {/* Front face */}
      <mesh position={[0, 0, 0.48]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color={colors[0]} />
      </mesh>
      {/* Back face */}
      <mesh position={[0, 0, -0.48]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color={colors[1]} />
      </mesh>
      {/* Top face */}
      <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color={colors[2]} />
      </mesh>
      {/* Bottom face */}
      <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color={colors[3]} />
      </mesh>
      {/* Right face */}
      <mesh position={[0.48, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color={colors[4]} />
      </mesh>
      {/* Left face */}
      <mesh position={[-0.48, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color={colors[5]} />
      </mesh>
    </group>
  );
};

interface CubeState {
  pieces: Array<{
    position: [number, number, number];
    colors: string[];
  }>;
}

const createSolvedCube = (): CubeState => {
  const pieces = [];
  const positions = [-1, 0, 1];
  
  // Classic Rubik's cube colors
  const faceColors = {
    //front: "#ffffff",  // white
    //back: "#ffff00",   // yellow
    //top: "#ff8c00",    // orange/red
    //bottom: "#ff0000", // red
    //right: "#2196f3",  // blue
    //left: "#4caf50",   // green
    top: "#ffff00",    // white
    bottom: "#ffffff", // yellow
    front: "#2196f3",  // green
    back: "#4caf50",   // blue
    right: "#ff0000",  // red
    left: "#ff8c00",   // orange
  };

  for (let x of positions) {
    for (let y of positions) {
      for (let z of positions) {
        // Determine which faces are visible based on position
        const colors = [
          z === 1 ? faceColors.front : "#1a1a1a",
          z === -1 ? faceColors.back : "#1a1a1a",
          y === 1 ? faceColors.top : "#1a1a1a",
          y === -1 ? faceColors.bottom : "#1a1a1a",
          x === 1 ? faceColors.right : "#1a1a1a",
          x === -1 ? faceColors.left : "#1a1a1a",
        ];

        pieces.push({
          position: [x, y, z] as [number, number, number],
          colors,
        });
      }
    }
  }

  return { pieces };
};

const scrambleCube = (cubeState: CubeState): CubeState => {
  const newPieces = [...cubeState.pieces];
  
  // Perform random rotations
  const rotations = Math.floor(Math.random() * 15) + 10;
  
  for (let i = 0; i < rotations; i++) {
    const axis = Math.floor(Math.random() * 3); // 0: x, 1: y, 2: z
    const layer = [-1, 0, 1][Math.floor(Math.random() * 3)];
    
    newPieces.forEach((piece, idx) => {
      if (piece.position[axis] === layer) {
        const [x, y, z] = piece.position;
        let newPos: [number, number, number];
        let newColors = [...piece.colors];
        
        if (axis === 0) { // Rotate around X axis
          newPos = [x, -z, y];
          newColors = [newColors[2], newColors[3], newColors[1], newColors[0], newColors[4], newColors[5]];
        } else if (axis === 1) { // Rotate around Y axis
          newPos = [z, y, -x];
          newColors = [newColors[5], newColors[4], newColors[2], newColors[3], newColors[0], newColors[1]];
        } else { // Rotate around Z axis
          newPos = [-y, x, z];
          newColors = [newColors[0], newColors[1], newColors[4], newColors[5], newColors[3], newColors[2]];
        }
        
        newPieces[idx] = { position: newPos, colors: newColors };
      }
    });
  }
  
  return { pieces: newPieces };
};

export const RubiksCube = () => {
  const [cubeState, setCubeState] = useState<CubeState>(createSolvedCube());
  const { rotate, loadingRotation, rotationError, scramble, loadingScramble, scrambleError } = usePostData();
  const groupRef = useRef<THREE.Group>(null);

  const handleReset = () => {
    const solvedCube = createSolvedCube();
    console.log("Reset Cube State:", solvedCube);
    setCubeState(solvedCube);
  };

  const handleRotate = async (move: string) => {
    if (loadingRotation) return; // Prevent multiple simultaneous requests
    try {
      const rotated = await rotate({ cubeState, move });
      if (rotationError) { throw rotationError; }
      console.log("Rotation result:", rotated);
      setCubeState(rotated);
    } catch (e) {
      console.error("Error rotating cube:", e);
    }
  }

  const handleScramble = async () => {
    if (loadingScramble) return; // Prevent multiple simultaneous requests
    try {
      const scrambled = await scramble({ cubeState, movesCount: 20 });
      if (scrambleError) { throw scrambleError; }
      console.log("Scrambled Cube State:", scrambled);
      setCubeState(scrambled);
    } catch (e) {
      console.error("Error scrambling cube:", e);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        
        <group ref={groupRef}>
          {cubeState.pieces.map((piece, idx) => (
            <CubePiece key={idx} position={piece.position} colors={piece.colors} />
          ))}
        </group>
        
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

        {/* Move buttons on the right side */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 grid grid-cols-2 gap-2">
          {["U", "U'", "D", "D'", "R", "R'", "L", "L'", "F", "F'", "B", "B'"].map((move) => (
            <button
            key={move}
            onClick={() => handleRotate(move)}
            disabled={loadingRotation}
            className={`w-12 h-12 text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80 transition-all shadow-lg hover:shadow-xl text-sm btn-color-${move.charAt(0)}`}
            >
            {loadingRotation ? "X" : move}
            </button>
          ))}
        </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={handleScramble}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
        >
          Scramble
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
        >
          Reset
        </button>
      </div>

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Rubik's Cube</h1>
        <p className="text-muted-foreground">Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
};
