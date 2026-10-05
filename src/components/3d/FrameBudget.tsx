"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStationStore } from "@/store/stationStore";

const SAMPLE_COUNT = 48;
const SLOW_FRAME = 0.028;

export function FrameBudget() {
  const samples = useRef<number[]>([]);
  const dropped = useRef(false);

  useFrame((_, delta) => {
    if (dropped.current) return;
    const state = useStationStore.getState();
    if (state.quality === "low") {
      dropped.current = true;
      return;
    }
    if (!state.booted) {
      samples.current = [];
      return;
    }

    samples.current.push(delta);
    if (samples.current.length < SAMPLE_COUNT) return;

    const total = samples.current.reduce((sum, frame) => sum + frame, 0);
    samples.current = [];
    if (total / SAMPLE_COUNT <= SLOW_FRAME) return;

    dropped.current = true;
    state.setQuality("low");
    state.pushLog("RENDER TIER LOWERED");
  });

  return null;
}
