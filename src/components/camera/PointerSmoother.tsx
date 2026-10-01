"use client";

import { useFrame } from "@react-three/fiber";
import { smoothPointer } from "@/lib/input/pointer";
import { useStationStore } from "@/store/stationStore";

export function PointerSmoother() {
  useFrame((_, delta) => {
    smoothPointer(delta, useStationStore.getState().reducedMotion);
  });

  return null;
}
