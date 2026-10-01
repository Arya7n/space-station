"use client";

import { useEffect } from "react";
import { detectWebgl } from "@/lib/quality";
import { useStationStore } from "@/store/stationStore";

export function useWebglCapability() {
  useEffect(() => {
    const available = detectWebgl();
    const state = useStationStore.getState();
    state.setWebglAvailable(available);
    if (!available) state.setStandardMode(true);
  }, []);
}
