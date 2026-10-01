"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SCENE } from "@/lib/constants/scene";
import { useStationStore } from "@/store/stationStore";

export function CameraRig() {
  const camera = useThree((state) => state.camera);
  const desired = useRef(
    new THREE.Vector3(0, SCENE.cameraHeight, SCENE.cameraRadius),
  );
  const elapsed = useRef(0);

  useEffect(() => {
    camera.position.copy(desired.current);
    camera.lookAt(0, 0.15, 0);
  }, [camera]);

  useFrame((_, delta) => {
    if (!useStationStore.getState().reducedMotion) {
      elapsed.current += delta;
    }

    const time = elapsed.current;
    const angle = time * SCENE.orbitSpeed;
    desired.current.set(
      Math.sin(angle) * SCENE.cameraRadius,
      SCENE.cameraHeight + Math.sin(time * 0.07) * 0.4,
      Math.cos(angle) * SCENE.cameraRadius,
    );

    const blend = 1 - Math.exp(-0.85 * delta);
    camera.position.lerp(desired.current, blend);
    camera.lookAt(0, 0.15, 0);
  });

  return null;
}
