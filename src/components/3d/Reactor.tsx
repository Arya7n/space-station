"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { POSITION } from "@/lib/constants/layout";
import { useStationStore } from "@/store/stationStore";
import { HullMesh } from "./HullMesh";
import { useStationAssets } from "./stationAssets";

export function Reactor() {
  const elapsed = useRef(0);
  const coreMesh = useRef<THREE.Mesh>(null);
  const { geometries, materials } = useStationAssets();
  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a3036",
        emissive: "#d9cbb8",
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.2,
      }),
    [],
  );

  useEffect(() => () => coreMaterial.dispose(), [coreMaterial]);

  useFrame((_, delta) => {
    const surface = coreMesh.current?.material;
    if (!(surface instanceof THREE.MeshStandardMaterial)) return;
    if (useStationStore.getState().reducedMotion) {
      surface.emissiveIntensity = 0.5;
      return;
    }
    elapsed.current += delta;
    surface.emissiveIntensity = 0.46 + Math.sin(elapsed.current * 1.35) * 0.1;
  });

  return (
    <group position={POSITION.reactor} name="REACTOR">
      <HullMesh geometry={geometries.reactorHousing} material={materials.dark} />
      <mesh
        ref={coreMesh}
        geometry={geometries.reactorCore}
        material={coreMaterial}
        castShadow={false}
      />
      <HullMesh
        geometry={geometries.reactorRing}
        material={materials.hull}
        position={[0, 0.42, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <HullMesh
        geometry={geometries.reactorRing}
        material={materials.hull}
        position={[0, -0.42, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
