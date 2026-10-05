"use client";

import { useEffect } from "react";
import { useStationStore } from "@/store/stationStore";

const MUTED_KEY = "orbital-07-muted";
const STANDARD_KEY = "orbital-07-standard";

export function usePersistedPreferences() {
  useEffect(() => {
    const muted = sessionStorage.getItem(MUTED_KEY);
    const standard = sessionStorage.getItem(STANDARD_KEY);
    const state = useStationStore.getState();
    if (muted === "0" || muted === "1") state.setAudioMuted(muted === "1");
    if (standard === "1") state.setStandardMode(true);

    return useStationStore.subscribe((next, previous) => {
      if (next.audioMuted !== previous.audioMuted) {
        sessionStorage.setItem(MUTED_KEY, next.audioMuted ? "1" : "0");
      }
      if (next.standardMode !== previous.standardMode) {
        sessionStorage.setItem(STANDARD_KEY, next.standardMode ? "1" : "0");
      }
    });
  }, []);
}
