"use client";

import { useEffect } from "react";
import { INITIAL_TELEMETRY, type Telemetry } from "@/lib/constants/station";
import { useStationStore } from "@/store/stationStore";

const KEYS = Object.keys(INITIAL_TELEMETRY) as (keyof Telemetry)[];

function clamp(key: keyof Telemetry, value: number) {
  if (key === "hull") return Math.min(100, Math.max(97.5, value));
  if (key === "oxygen") return Math.min(99.2, Math.max(97.4, value));
  if (key === "temperature") return Math.min(22.4, Math.max(20.6, value));
  if (key === "power" || key === "reactorOutput")
    return Math.min(92, Math.max(82, value));
  return value;
}

export function useTelemetry() {
  useEffect(() => {
    let frame = 0;
    let last = 0;
    const targets = { ...INITIAL_TELEMETRY };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      if (now - last < 320) return;
      last = now;
      const state = useStationStore.getState();
      if (state.mode === "FAILURE" || document.hidden) return;

      KEYS.forEach((key) => {
        if (Math.random() > 0.4) return;
        const drift =
          (Math.random() - 0.5) * (key === "temperature" ? 0.2 : 0.35);
        targets[key] = clamp(key, INITIAL_TELEMETRY[key] + drift);
      });

      const next = { ...state.telemetry };
      let changed = false;
      KEYS.forEach((key) => {
        const value =
          Math.round((next[key] + (targets[key] - next[key]) * 0.45) * 10) / 10;
        if (value !== next[key]) changed = true;
        next[key] = value;
      });
      if (changed) state.setTelemetry(next);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);
}
