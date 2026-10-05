"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { noteTarget } from "@/hooks/useStationNavigation";
import { useStationStore } from "@/store/stationStore";

const LABELS: Record<string, string> = {
  COMMAND: "COMMAND CENTER",
  LAB: "RESEARCH LAB",
  ENGINEERING: "ENGINEERING",
  OBSERVATORY: "OBSERVATORY",
  COMMUNICATIONS: "COMMUNICATIONS",
  QUARTERS: "CREW QUARTERS",
  "QUARTERS-B": "CREW QUARTERS",
  "maintenance-panel": "MAINTENANCE PANEL",
  beacon: "NAVIGATION BEACON",
  REACTOR: "REACTOR CORE",
  "emergency-button": "EMERGENCY ISOLATION",
};

function namedAncestor(object: THREE.Object3D | null) {
  let current = object;
  while (current) {
    if (current.name && current.name in LABELS) return current.name;
    current = current.parent;
  }
  return "";
}

export function StationInteractions() {
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = "";
    let pending = false;
    let latest: PointerEvent | null = null;

    const pick = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const roots: THREE.Object3D[] = [];
      const station = scene.getObjectByName("STATION");
      const threats = scene.getObjectByName("THREATS");
      if (station) roots.push(station);
      if (threats) roots.push(threats);
      if (roots.length === 0) return "";
      const hits = raycaster.intersectObjects(roots, true);
      return namedAncestor(hits[0]?.object ?? null);
    };

    const publish = (name: string) => {
      if (name === hovered) return;
      hovered = name;
      const state = useStationStore.getState();
      if (state.game.active || state.mode === "FAILURE") return;
      state.setHint(LABELS[name] ?? "");
    };

    const onMove = (event: PointerEvent) => {
      latest = event;
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(() => {
        pending = false;
        if (!latest) return;
        const name = pick(latest);
        gl.domElement.style.cursor = name ? "pointer" : "";
        publish(name);
      });
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const name = pick(event);
      if (!name) return;
      noteTarget(name);
    };

    gl.domElement.addEventListener("pointermove", onMove);
    gl.domElement.addEventListener("pointerdown", onDown);
    return () => {
      gl.domElement.style.cursor = "";
      gl.domElement.removeEventListener("pointermove", onMove);
      gl.domElement.removeEventListener("pointerdown", onDown);
    };
  }, [camera, gl, scene]);

  return null;
}
