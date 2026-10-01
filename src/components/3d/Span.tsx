"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { BufferGeometry, Material } from "three";
import { HullMesh } from "./HullMesh";

type SpanProps = {
  from: readonly [number, number, number];
  to: readonly [number, number, number];
  radius?: number;
  geometry: BufferGeometry;
  material: Material;
};

export function Span({
  from,
  to,
  radius = 0.11,
  geometry,
  material,
}: SpanProps) {
  const placement = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    const length = Math.max(direction.length(), 0.001);
    const position = start.clone().add(end).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    return { position, quaternion, length };
  }, [from, to]);

  return (
    <HullMesh
      geometry={geometry}
      material={material}
      position={[
        placement.position.x,
        placement.position.y,
        placement.position.z,
      ]}
      quaternion={placement.quaternion}
      scale={[radius, placement.length, radius]}
    />
  );
}
