"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SCENE } from "@/lib/constants/scene";
import { useStationStore } from "@/store/stationStore";
import { NavigationLights } from "./NavigationLights";
import { QuarterPods, StationModules } from "./StationModule";
import { Reactor } from "./Reactor";
import { SolarPanels } from "./SolarPanels";
import { StationCore } from "./StationCore";
import { StationAssetProvider } from "./stationAssets";

export function SpaceStation() {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!group.current || useStationStore.getState().reducedMotion) return;
    elapsed.current += delta;
    group.current.rotation.y = elapsed.current * SCENE.stationSpin;
  });

  return (
    <StationAssetProvider>
      <group ref={group}>
        <StationCore>
          <QuarterPods />
        </StationCore>
        <Reactor />
        <SolarPanels />
        <StationModules />
        <NavigationLights />
      </group>
    </StationAssetProvider>
  );
}
