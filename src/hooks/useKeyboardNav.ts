"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio/audioManager";
import type { ModuleId } from "@/lib/constants/station";
import { openModule, returnToSpace } from "@/hooks/useStationNavigation";
import { useStationStore } from "@/store/stationStore";

const MODULE_KEYS: Record<string, ModuleId> = {
  Digit1: "COMMAND",
  Digit2: "LAB",
  Digit3: "ENGINEERING",
  Digit4: "OBSERVATORY",
  Digit5: "COMMUNICATIONS",
  Digit6: "QUARTERS",
};

export function useKeyboardNav() {
  useEffect(() => {
    let buffer = "";

    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const state = useStationStore.getState();
      if (event.key === "Escape") {
        if (state.projectId) {
          state.setProjectId(null);
          return;
        }
        returnToSpace();
        return;
      }

      if (event.key.toLowerCase() === "m" && !event.metaKey && !event.ctrlKey) {
        const muted = !state.audioMuted;
        state.setAudioMuted(muted);
        audio.setMuted(muted);
        if (!muted) audio.play("click");
        return;
      }

      const moduleId = MODULE_KEYS[event.code];
      if (moduleId) {
        openModule(moduleId);
        return;
      }

      if (!/^[a-z]$/i.test(event.key)) return;
      buffer = `${buffer}${event.key.toLowerCase()}`.slice(-5);
      if (buffer === "orion") {
        buffer = "";
        state.addSecret("ORION CHANNEL OPEN");
        openModule("HIDDEN");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
