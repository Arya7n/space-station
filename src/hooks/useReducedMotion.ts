"use client";

import { useEffect } from "react";
import { useStationStore } from "@/store/stationStore";

export function useReducedMotion() {
  const setReducedMotion = useStationStore((state) => state.setReducedMotion);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [setReducedMotion]);
}
