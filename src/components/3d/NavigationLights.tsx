"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { POSITION } from "@/lib/constants/layout";
import { useStationStore } from "@/store/stationStore";
import { HullMesh } from "./HullMesh";
import { useStationAssets } from "./stationAssets";

export function NavigationLights() {
  const elapsed = useRef(0);
  const beaconMesh = useRef<THREE.Mesh>(null);
  const { geometries, materials } = useStationAssets();
  const beaconMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e7ecef",
        emissive: "#f4f7f8",
        emissiveIntensity: 0.25,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => () => beaconMaterial.dispose(), [beaconMaterial]);

  useFrame((_, delta) => {
    const surface = beaconMesh.current?.material;
    if (!(surface instanceof THREE.MeshStandardMaterial)) return;
    if (useStationStore.getState().reducedMotion) {
      surface.emissiveIntensity = 0.35;
      return;
    }
    elapsed.current += delta;
    const pulse = Math.sin(elapsed.current * 2.1);
    surface.emissiveIntensity = pulse > 0.82 ? 1.5 : 0.08;
  });

  return (
    <group name="NAVIGATION">
      <HullMesh
        geometry={geometries.nav}
        material={materials.port}
        position={POSITION.portLight}
        castShadow={false}
      />
      <HullMesh
        geometry={geometries.nav}
        material={materials.starboard}
        position={POSITION.starboardLight}
        castShadow={false}
      />
      <mesh
        ref={beaconMesh}
        geometry={geometries.nav}
        material={beaconMaterial}
        position={POSITION.beacon}
        castShadow={false}
      />
    </group>
  );
}
