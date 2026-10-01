"use client";

import type { BufferGeometry, Material, Quaternion } from "three";

type HullMeshProps = {
  geometry: BufferGeometry;
  material: Material;
  position?: [number, number, number];
  rotation?: [number, number, number];
  quaternion?: Quaternion;
  scale?: [number, number, number];
  name?: string;
  castShadow?: boolean;
};

export function HullMesh({
  geometry,
  material,
  position,
  rotation,
  quaternion,
  scale,
  name,
  castShadow = true,
}: HullMeshProps) {
  return (
    <mesh
      name={name}
      geometry={geometry}
      material={material}
      position={position}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={castShadow}
      {...(quaternion ? { quaternion } : { rotation })}
    />
  );
}
