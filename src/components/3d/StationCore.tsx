"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { SPOKE_ANGLES, radial } from "@/lib/constants/layout";
import { useStationStore } from "@/store/stationStore";
import { HullMesh } from "./HullMesh";
import { useStationAssets } from "./stationAssets";

export function StationCore({ children }: { children?: ReactNode }) {
  const ring = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const { geometries, materials } = useStationAssets();

  const spokes = useMemo(
    () =>
      SPOKE_ANGLES.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return {
          angle,
          position: radial(angle, 3.9, 0),
          quaternion: new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(Math.sin(radians), 0, Math.cos(radians)),
          ),
        };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!ring.current || useStationStore.getState().reducedMotion) return;
    elapsed.current += delta;
    ring.current.rotation.y = elapsed.current * 0.12;
  });

  return (
    <group>
      <HullMesh geometry={geometries.core} material={materials.hull} />
      <HullMesh
        geometry={geometries.collar}
        material={materials.dark}
        position={[0, 0.95, 0]}
      />
      <HullMesh
        geometry={geometries.collar}
        material={materials.dark}
        position={[0, -0.95, 0]}
      />
      <HullMesh
        name="maintenance-panel"
        geometry={geometries.unitBox}
        material={materials.inset}
        position={[1.28, -0.78, 0.48]}
        scale={[0.28, 0.42, 0.22]}
      />
      <HullMesh
        geometry={geometries.window}
        material={materials.lamp}
        position={[0, 0.35, 1.48]}
      />
      <HullMesh
        geometry={geometries.window}
        material={materials.lamp}
        position={[0, 0.35, -1.48]}
        rotation={[0, Math.PI, 0]}
      />

      <group ref={ring}>
        <HullMesh
          geometry={geometries.ring}
          material={materials.hull}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {spokes.map((spoke) => (
          <HullMesh
            key={spoke.angle}
            geometry={geometries.spoke}
            material={materials.dark}
            position={spoke.position}
            quaternion={spoke.quaternion}
          />
        ))}
        {children}
      </group>
    </group>
  );
}
