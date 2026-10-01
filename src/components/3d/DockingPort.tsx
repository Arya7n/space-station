"use client";

import type { Quaternion } from "three";
import { HullMesh } from "./HullMesh";
import { useStationAssets } from "./stationAssets";

const PETALS = [0, 1, 2, 3] as const;
const ALONG_Z: [number, number, number] = [-Math.PI / 2, 0, 0];

type DockingPortProps = {
  position: [number, number, number];
  quaternion: Quaternion;
  scale?: number;
};

export function DockingPort({
  position,
  quaternion,
  scale = 1,
}: DockingPortProps) {
  const { geometries, materials } = useStationAssets();

  return (
    <group position={position} quaternion={quaternion} scale={scale}>
      <HullMesh
        geometry={geometries.dockRing}
        material={materials.dark}
        position={[0, 0, 0.15]}
      />
      <HullMesh
        geometry={geometries.dockTunnel}
        material={materials.hull}
        rotation={ALONG_Z}
        position={[0, 0, -0.12]}
      />
      {PETALS.map((index) => {
        const angle = (index / PETALS.length) * Math.PI * 2;
        return (
          <HullMesh
            key={index}
            geometry={geometries.petal}
            material={materials.hull}
            position={[Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, 0.28]}
          />
        );
      })}
    </group>
  );
}
