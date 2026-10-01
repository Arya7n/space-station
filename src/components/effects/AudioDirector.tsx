"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio/audioManager";
import { useStationStore } from "@/store/stationStore";

export function AudioDirector() {
  const muted = useStationStore((state) => state.audioMuted);
  const moduleId = useStationStore((state) => state.currentModule);
  const mode = useStationStore((state) => state.mode);

  useEffect(() => {
    audio.setMuted(muted);
    if (muted) return;
    if (mode === "FAILURE") audio.startAlarm();
    else audio.stopAlarm();
    if (moduleId === "ENGINEERING" && mode !== "FAILURE") audio.startHum();
    else audio.stopHum();
  }, [muted, moduleId, mode]);

  return null;
}
