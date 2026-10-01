"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cameraPose } from "@/lib/animations/cameraShots";
import { SCENE } from "@/lib/constants/scene";
import { pointer } from "@/lib/input/pointer";
import { useStationStore } from "@/store/stationStore";

export function CameraRig() {
  const camera = useThree((state) => state.camera);
  const desired = useRef(
    new THREE.Vector3(0, SCENE.cameraHeight, SCENE.cameraRadius),
  );
  const framed = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3(0, 0.2, 0));
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    const state = useStationStore.getState();
    if (!state.reducedMotion) elapsed.current += delta;
    const time = elapsed.current;
    const shake =
      state.mode === "FAILURE" && !state.reducedMotion
        ? Math.sin(time * 38) * 0.045
        : 0;

    if (cameraPose.controlling) {
      camera.position.set(
        cameraPose.x + pointer.x * 0.25 + shake,
        cameraPose.y + pointer.y * -0.12,
        cameraPose.z,
      );
      camera.lookAt(cameraPose.lx, cameraPose.ly, cameraPose.lz);
      return;
    }

    const angle = time * SCENE.orbitSpeed;
    desired.current.set(
      Math.sin(angle) * SCENE.cameraRadius,
      SCENE.cameraHeight + Math.sin(time * 0.07) * 0.4,
      Math.cos(angle) * SCENE.cameraRadius,
    );

    framed.current.copy(desired.current);
    framed.current.x += pointer.x * 0.85 + shake;
    framed.current.y += pointer.y * -0.42;

    const blend = 1 - Math.exp(-0.85 * delta);
    camera.position.lerp(framed.current, blend);
    look.current.set(pointer.x * 0.32, 0.2 - pointer.y * 0.16, 0);
    camera.lookAt(look.current);
    cameraPose.x = camera.position.x;
    cameraPose.y = camera.position.y;
    cameraPose.z = camera.position.z;
    cameraPose.lx = look.current.x;
    cameraPose.ly = look.current.y;
    cameraPose.lz = look.current.z;
  });

  return null;
}
