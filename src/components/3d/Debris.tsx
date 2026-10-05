"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStationStore } from "@/store/stationStore";

const COUNT = 18;

export function Debris() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 0.35, 0.55), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8d949c",
        metalness: 0.72,
        roughness: 0.42,
      }),
    [],
  );
  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, index) => ({
        orbit: 16 + (index % 7) * 1.35,
        y: ((index % 5) - 2) * 1.4,
        speed: 0.03 + (index % 4) * 0.012,
        angle: (index / COUNT) * Math.PI * 2,
        scale: index % 9 === 0 ? 0.55 : 0.12 + (index % 5) * 0.04,
        tilt: index * 0.4,
      })),
    [],
  );

  useLayoutEffect(() => {
    if (!mesh.current) return;

    pieces.forEach((piece, index) => {
      dummy.position.set(
        Math.cos(piece.angle) * piece.orbit,
        piece.y,
        Math.sin(piece.angle) * piece.orbit,
      );
      dummy.scale.setScalar(piece.scale);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [dummy, geometry, material, pieces]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const state = useStationStore.getState();
    if (state.reducedMotion || state.cameraState === "MODULE") return;

    pieces.forEach((piece, index) => {
      piece.angle += delta * piece.speed;
      dummy.position.set(
        Math.cos(piece.angle) * piece.orbit,
        piece.y + Math.sin(piece.angle * 2) * 0.35,
        Math.sin(piece.angle) * piece.orbit,
      );
      dummy.rotation.set(piece.tilt, piece.angle, piece.tilt * 0.3);
      dummy.scale.setScalar(piece.scale);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, COUNT]} />;
}
