"use client";

import { SCENE } from "@/lib/constants/scene";

export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.05} color="#c5d0dc" />
      <hemisphereLight args={["#1c2a3a", "#05060a", 0.28]} />
      <directionalLight
        position={SCENE.sunPosition}
        intensity={2.15}
        color="#fff2e2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <directionalLight
        position={[-28, -4, -16]}
        intensity={0.22}
        color="#7f97b0"
      />
    </>
  );
}
