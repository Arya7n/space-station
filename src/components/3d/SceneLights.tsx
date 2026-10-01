"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { DirectionalLight } from "three";
import { SCENE } from "@/lib/constants/scene";
import { useStationStore } from "@/store/stationStore";

export function SceneLights() {
  const sun = useRef<DirectionalLight>(null);

  useFrame(() => {
    if (!sun.current) return;
    const failed = useStationStore.getState().mode === "FAILURE";
    sun.current.color.set(failed ? "#c47a52" : "#fff2e2");
    sun.current.intensity = failed ? 0.45 : 2.15;
  });

  return (
    <>
      <ambientLight intensity={0.05} color="#c5d0dc" />
      <hemisphereLight args={["#1c2a3a", "#05060a", 0.28]} />
      <directionalLight
        ref={sun}
        position={SCENE.sunPosition}
        intensity={2.15}
        color="#fff2e2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={130}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
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
