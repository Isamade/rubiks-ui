//import CubeScene from '@/components/CubeScene';
import { RubiksCube } from "@/components/RubiksCube3";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Header */}
      {/*<header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Interactive Rubik's Cube
          </h1>
          <p className="text-muted-foreground">
            Drag to rotate • Scroll to zoom • Auto-rotates when idle
          </p>
        </div>
      </header>*/}

      {/* 3D Scene */}
      <RubiksCube />

      {/* Footer */}
      {/*<footer className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Built with React Three Fiber
          </p>
        </div>
      </footer>*/}
    </div>
  );
};

export default Index;
