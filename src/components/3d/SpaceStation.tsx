"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SCENE } from "@/lib/constants/scene";
import { pointer } from "@/lib/input/pointer";
import { useStationStore } from "@/store/stationStore";
import { NavigationLights } from "./NavigationLights";
import { QuarterPods, StationModules } from "./StationModule";
import { Reactor } from "./Reactor";
import { SolarPanels } from "./SolarPanels";
import { StationCore } from "./StationCore";
import { StationAssetProvider } from "./stationAssets";

export function SpaceStation() {
  const spin = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (spin.current && !useStationStore.getState().reducedMotion) {
      elapsed.current += delta;
      spin.current.rotation.y = elapsed.current * SCENE.stationSpin;
    }
    if (!parallax.current) return;
    parallax.current.rotation.y = pointer.x * 0.035;
    parallax.current.rotation.x = pointer.y * 0.016;
  });

  return (
    <StationAssetProvider>
      <group ref={parallax}>
        <group ref={spin}>
          <StationCore>
            <QuarterPods />
          </StationCore>
          <Reactor />
          <SolarPanels />
          <StationModules />
          <NavigationLights />
        </group>
      </group>
    </StationAssetProvider>
  );
}
