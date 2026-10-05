"use client";

import { audio } from "@/lib/audio/audioManager";
import {
  HOME_SHOT,
  MODULE_SHOTS,
  OVERVIEW_SHOT,
} from "@/lib/animations/cameraShots";
import { flyToPose, releaseCamera } from "@/lib/animations/flyCamera";
import { INITIAL_TELEMETRY, type ModuleId } from "@/lib/constants/station";
import { useStationStore } from "@/store/stationStore";

function travelTime() {
  return useStationStore.getState().reducedMotion ? 0.45 : 2.5;
}

function spatial() {
  const state = useStationStore.getState();
  return state.webglAvailable && !state.standardMode;
}

export function canNavigate() {
  const state = useStationStore.getState();
  if (!state.booted || state.mode === "FAILURE") return false;
  if (!spatial()) return true;
  return (
    state.cameraState === "SPACE" ||
    state.cameraState === "MODULE" ||
    state.cameraState === "OVERVIEW"
  );
}

export function openModule(moduleId: ModuleId) {
  if (!canNavigate()) return;
  const state = useStationStore.getState();
  audio.play("enter");
  state.setProjectId(null);
  state.setHint("");
  if (!spatial()) {
    state.setModule(moduleId);
    state.setCameraState("MODULE");
    state.markVisited(moduleId);
    return;
  }
  state.setCameraState("APPROACH");
  flyToPose(MODULE_SHOTS[moduleId], travelTime(), () => {
    const next = useStationStore.getState();
    next.setModule(moduleId);
    next.setCameraState("MODULE");
    next.markVisited(moduleId);
  });
}

export function returnToSpace() {
  const state = useStationStore.getState();
  if (!state.booted) return;
  state.setProjectId(null);
  state.setHint("");
  state.setGame({ ...state.game, active: false });
  if (!spatial()) {
    state.setModule(null);
    state.setCameraState("SPACE");
    return;
  }
  if (state.cameraState === "SPACE" && !state.currentModule) return;
  state.setCameraState("RETURNING");
  state.setModule(null);
  flyToPose(HOME_SHOT, travelTime(), () => {
    releaseCamera();
    useStationStore.getState().setCameraState("SPACE");
  });
}

export function startDefense() {
  if (!canNavigate()) return;
  const state = useStationStore.getState();
  audio.play("confirm");
  state.setModule(null);
  state.setProjectId(null);
  state.setGame({ active: true, score: 0, remaining: 7 });
  state.setHint("THREAT DETECTED");
  state.pushLog("ASTEROID DEFENSE ARMED");
  if (!spatial()) return;
  state.setCameraState("APPROACH");
  flyToPose(OVERVIEW_SHOT, travelTime(), () => {
    useStationStore.getState().setCameraState("OVERVIEW");
  });
}

export function beginFailure() {
  const state = useStationStore.getState();
  if (state.mode === "FAILURE" || !state.booted) return;
  audio.play("confirm");
  state.setMode("FAILURE");
  state.setModule(null);
  state.setProjectId(null);
  state.setGame({ ...state.game, active: false });
  state.setInteraction({ ...state.interaction, emergencyActive: true });
  if (!spatial()) return;
  state.setCameraState("APPROACH");
  flyToPose(OVERVIEW_SHOT, state.reducedMotion ? 0.4 : 1.5, () => {
    useStationStore.getState().setCameraState("OVERVIEW");
  });
}

export function restoreStation() {
  const state = useStationStore.getState();
  state.setMode("NORMAL");
  state.setTelemetry(INITIAL_TELEMETRY);
  state.setInteraction({ ...state.interaction, emergencyActive: false });
  state.setFailure({ stage: "restored", count: 0 });
  state.pushLog("SYSTEM RESTORED");
  releaseCamera();
  state.setCameraState("SPACE");
  window.setTimeout(() => {
    if (useStationStore.getState().failure?.stage === "restored") {
      useStationStore.getState().setFailure(null);
    }
  }, 1800);
}

export function noteTarget(name: string) {
  const state = useStationStore.getState();
  if (name === "beacon") {
    audio.play("click");
    state.addSecret("BEACON ACKNOWLEDGED");
    return;
  }
  if (name === "maintenance-panel") {
    audio.play("click");
    state.addSecret("MAINTENANCE ACCESS");
    openModule("HIDDEN");
    return;
  }
  if (name === "emergency-button") {
    beginFailure();
    return;
  }
  if (name === "REACTOR") {
    audio.play("click");
    const next = state.reactorStrikes + 1;
    state.setReactorStrikes(next >= 3 ? 0 : next);
    if (next >= 3) state.addSecret("CORE RESONANCE");
    else state.setHint(`REACTOR ${next} / 3`);
    return;
  }
  if (name === "QUARTERS" || name === "QUARTERS-B") {
    openModule("QUARTERS");
    return;
  }
  if (
    name === "COMMAND" ||
    name === "LAB" ||
    name === "ENGINEERING" ||
    name === "OBSERVATORY" ||
    name === "COMMUNICATIONS"
  ) {
    openModule(name);
  }
}

export function useStationNavigation() {
  return { openModule, returnToSpace, startDefense, beginFailure };
}
