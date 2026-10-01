"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { APPROACH_SHOT } from "@/lib/animations/cameraShots";
import { SCENE } from "@/lib/constants/scene";
import { detectQuality } from "@/lib/quality";
import { CameraRig } from "@/components/camera/CameraRig";
import { PointerSmoother } from "@/components/camera/PointerSmoother";
import { AsteroidDefense } from "@/components/games/AsteroidDefense";
import { useStationStore } from "@/store/stationStore";
import { Debris } from "./Debris";
import { Earth } from "./Earth";
import { Nebula } from "./Nebula";
import { SceneLights } from "./SceneLights";
import { SpaceStation } from "./SpaceStation";
import { StarField } from "./StarField";
import { StationInteractions } from "./StationInteractions";

export function SpaceScene() {
  const tier = useMemo(() => detectQuality(), []);

  useEffect(() => {
    useStationStore.getState().setQuality(tier);
  }, [tier]);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={tier === "high" ? SCENE.dpr : [1, 1.1]}
        shadows={tier === "high" ? "percentage" : false}
        camera={{
          fov: SCENE.cameraFov,
          near: 0.1,
          far: 2000,
          position: [APPROACH_SHOT.x, APPROACH_SHOT.y, APPROACH_SHOT.z],
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
        <PointerSmoother />
        <SceneLights />
        <StarField count={tier === "high" ? SCENE.starCount : 1600} />
        <Nebula />
        <Earth detail={tier} />
        {tier === "high" ? <Debris /> : null}
        <SpaceStation />
        <AsteroidDefense />
        <StationInteractions />
        <CameraRig />
      </Canvas>
    </div>
  );
}
