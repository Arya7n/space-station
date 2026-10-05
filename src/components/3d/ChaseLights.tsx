"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { radial } from "@/lib/constants/layout";
import { useStationStore } from "@/store/stationStore";

const ANGLES = [15, 105, 195, 285] as const;

export function ChaseLights() {
  const meshes = useRef<Array<THREE.Mesh | null>>([]);
  const elapsed = useRef(0);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.09, 10, 8), []);
  const materials = useMemo(
    () =>
      ANGLES.map(
        () =>
          new THREE.MeshStandardMaterial({
            color: "#d5e0e8",
            emissive: "#d5e0e8",
            emissiveIntensity: 0.15,
            toneMapped: false,
          }),
      ),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      materials.forEach((material) => material.dispose());
    };
  }, [geometry, materials]);

  useFrame((_, delta) => {
    const reduced = useStationStore.getState().reducedMotion;
    if (!reduced) elapsed.current += delta;
    const failed = useStationStore.getState().mode === "FAILURE";
    meshes.current.forEach((mesh, index) => {
      if (!mesh) return;
      const surface = mesh.material;
      if (!(surface instanceof THREE.MeshStandardMaterial)) return;
      if (reduced) {
        surface.emissiveIntensity = 0.3;
        return;
      }
      const wave = Math.sin(elapsed.current * (failed ? 6 : 1.6) - index * 1.2);
      surface.emissiveIntensity = wave > 0.55 ? 1.35 : 0.05;
    });
  });

  return (
    <group>
      {ANGLES.map((angle, index) => (
        <mesh
          key={angle}
          ref={(node) => {
            meshes.current[index] = node;
          }}
          geometry={geometry}
          material={materials[index]}
          position={radial(angle, 6.35, 0.42)}
          castShadow={false}
        />
      ))}
    </group>
  );
}
