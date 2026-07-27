import { useMemo } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { PetStatus } from "../api/pet";

const MODEL_PATH = "/models/riley.glb"; // pug.glb uses a deprecated glTF material extension our loader can't read
const TARGET_SIZE = 1.8; // Keep the dog prominent while preserving a stable camera framing.

export type SceneEffect = "bath" | "celebrate" | "feed" | "pet" | "play" | "sleep" | null;

const SCENE_LIGHTING: Record<PetStatus, { ambient: number; color: string; floor: string; sunlight: number }> = {
     angry: { ambient: 0.86, color: "#f0c29d", floor: "#d5b998", sunlight: 1.0 },
     happy: { ambient: 1.65, color: "#fff7df", floor: "#e3d0ae", sunlight: 2.35 },
     hungry: { ambient: 0.86, color: "#e7b276", floor: "#cfb58f", sunlight: 1.05 },
     idle: { ambient: 1.5, color: "#fff8e8", floor: "#dfcbab", sunlight: 2.15 },
     sad: { ambient: 0.9, color: "#e8c59f", floor: "#d5bea0", sunlight: 1.0 },
     sick: { ambient: 0.82, color: "#dfbd93", floor: "#d0b58f", sunlight: 0.9 },
     sleeping: { ambient: 0.7, color: "#aeb9d2", floor: "#b6a98f", sunlight: 0.65 },
     tired: { ambient: 0.88, color: "#e5c39d", floor: "#d5bda0", sunlight: 0.95 },
};

const CARE_HINT: Partial<Record<PetStatus, string>> = {
     hungry: "A meal would help right now.",
     sick: "A little gentle care is needed.",
     tired: "A nap would do some good.",
};

function Dog({ onPetClick }: { onPetClick: () => void }) {
     const { scene } = useGLTF(MODEL_PATH);

     const scaleAndOffset = useMemo(() => {
          scene.traverse((object) => {
               if (object instanceof THREE.Mesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
               }
          });

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
               onClick={(event: ThreeEvent<MouseEvent>) => {
                    event.stopPropagation();
                    onPetClick();
               }}
          />
     );
}

export default function PetScene({
     effect,
     isSleeping,
     message,
     onPetClick,
     status,
}: {
     effect: SceneEffect;
     isSleeping: boolean;
     message: string;
     onPetClick: () => void;
     status: PetStatus;
}) {
     const lighting = SCENE_LIGHTING[isSleeping ? "sleeping" : status];
     const careHint = CARE_HINT[isSleeping ? "sleeping" : status];

     return (
          <div className={`pet-scene pet-scene--${isSleeping ? "sleeping" : status} relative h-[370px] w-full overflow-hidden sm:h-[480px] lg:h-[560px]`}>
               {isSleeping && <div className="pointer-events-none absolute inset-0 z-10 bg-[#263847]/10 transition-opacity" />}
               {careHint && <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-md border border-white/40 bg-stone-900/55 px-3 py-2 text-xs text-white backdrop-blur-sm sm:right-6 sm:top-6">{careHint}</div>}
               <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
                    <div className={`scene-message ${effect ? "scene-message--visible" : ""}`}>
                         {effect === "pet" && <span aria-hidden="true">♥</span>}
                         {effect === "sleep" && <span aria-hidden="true">Zzz</span>}
                         {effect === "celebrate" && <span aria-hidden="true">✦</span>}
                         {message}
                    </div>
               </div>
               <Canvas camera={{ position: [0, 1, 3.2], fov: 40 }} shadows gl={{ toneMappingExposure: 1.18 }}>
                    <ambientLight intensity={lighting.ambient} color={lighting.color} />
                    <hemisphereLight args={["#fff8e8", "#c2a77e", isSleeping ? 0.25 : 0.8]} />
                    <directionalLight position={[3, 5, 2]} intensity={lighting.sunlight} color={lighting.color} castShadow />
                    <Environment preset="apartment" environmentIntensity={isSleeping ? 0.35 : 0.8} />
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} receiveShadow>
                         <planeGeometry args={[18, 18]} />
                         <meshStandardMaterial color={lighting.floor} roughness={0.95} />
                    </mesh>
                    <Dog onPetClick={onPetClick} />
                    <ContactShadows
                         position={[0, 0.01, 0]}
                         opacity={0.28}
                         scale={3.4}
                         blur={2.6}
                         far={2.6}
                    />
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
