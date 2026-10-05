"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStationStore } from "@/store/stationStore";

export function HoverMarker() {
  const marker = useRef<THREE.Mesh>(null);
  const { camera, scene } = useThree();

  useFrame(() => {
    const mesh = marker.current;
    if (!mesh) return;
    const name = useStationStore.getState().hovered;
    const target = name ? scene.getObjectByName(name) : null;
    if (!target) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;
    target.getWorldPosition(mesh.position);
    mesh.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh ref={marker} visible={false} renderOrder={2}>
      <ringGeometry args={[0.72, 0.8, 40]} />
      <meshBasicMaterial
        color="#8eb4c0"
        transparent
        opacity={0.8}
        depthTest={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
