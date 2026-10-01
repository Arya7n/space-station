"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE } from "@/lib/constants/scene";
import { CameraRig } from "@/components/camera/CameraRig";
import { Debris } from "./Debris";
import { Earth } from "./Earth";
import { Nebula } from "./Nebula";
import { SceneLights } from "./SceneLights";
import { SpaceStation } from "./SpaceStation";
import { StarField } from "./StarField";

export function SpaceScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={SCENE.dpr}
        shadows="percentage"
        camera={{
          fov: SCENE.cameraFov,
          near: 0.1,
          far: 2000,
          position: [0, SCENE.cameraHeight, SCENE.cameraRadius],
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(SCENE.clearColor);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.02;
        }}
      >
        <SceneLights />
        <StarField />
        <Nebula />
        <Earth />
        <Debris />
        <SpaceStation />
        <CameraRig />
      </Canvas>
    </div>
  );
}
