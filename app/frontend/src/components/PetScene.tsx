import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/riley.glb"; // pug.glb uses a deprecated glTF material extension our loader can't read
const TARGET_SIZE = 1.5; // desired height in scene units, regardless of the model's original scale

function Dog() {
     const { scene } = useGLTF(MODEL_PATH);

     const scaleAndOffset = useMemo(() => {
          const box = new THREE.Box3().setFromObject(scene);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const largestDimension = Math.max(size.x, size.y, size.z);
          const scale = largestDimension > 0 ? TARGET_SIZE / largestDimension : 1;

          return {
               scale,
               position: [
                    -center.x * scale,
                    -box.min.y * scale,
                    -center.z * scale,
               ] as [number, number, number],
          };
     }, [scene]);

     return (
          <primitive
               object={scene}
               scale={scaleAndOffset.scale}
               position={scaleAndOffset.position}
          />
     );
}

export default function PetScene() {
     return (
          <div className="w-full h-64 rounded-2xl overflow-hidden">
               <Canvas camera={{ position: [0, 1, 3], fov: 40 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[3, 5, 2]} intensity={1} />
                    <Environment preset="city" />
                    <Dog />
                    <OrbitControls
                         target={[0, TARGET_SIZE / 2, 0]}
                         enablePan={false}
                         minDistance={2}
                         maxDistance={4}
                    />
               </Canvas>
          </div>
     );
}
