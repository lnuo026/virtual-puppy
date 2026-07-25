import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/pug.glb"; // swap to "/models/riley.glb" to compare
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
               <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[3, 5, 2]} intensity={1} />
                    <Environment preset="city" />
                    <Dog />
               </Canvas>
          </div>
     );
}
