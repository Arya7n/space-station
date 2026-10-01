import { create } from "zustand";
import {
  INITIAL_TELEMETRY,
  type CameraState,
  type ModuleId,
  type StationMode,
  type Telemetry,
} from "@/lib/constants/station";

export type InteractionState = {
  selectedObject: string | null;
  scanActive: boolean;
  emergencyActive: boolean;
};

type StationState = {
  mode: StationMode;
  currentModule: ModuleId | null;
  cameraState: CameraState;
  telemetry: Telemetry;
  interaction: InteractionState;
  audioMuted: boolean;
  reducedMotion: boolean;
  webglAvailable: boolean;
  setMode: (mode: StationMode) => void;
  setModule: (currentModule: ModuleId | null) => void;
  setCameraState: (cameraState: CameraState) => void;
  setTelemetry: (partial: Partial<Telemetry>) => void;
  setInteraction: (partial: Partial<InteractionState>) => void;
  setAudioMuted: (audioMuted: boolean) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setWebglAvailable: (webglAvailable: boolean) => void;
};

export const useStationStore = create<StationState>((set) => ({
  mode: "NORMAL",
  currentModule: null,
  cameraState: "SPACE",
  telemetry: INITIAL_TELEMETRY,
  interaction: {
    selectedObject: null,
    scanActive: false,
    emergencyActive: false,
  },
  audioMuted: true,
  reducedMotion: false,
  webglAvailable: true,
  setMode: (mode) => set({ mode }),
  setModule: (currentModule) => set({ currentModule }),
  setCameraState: (cameraState) => set({ cameraState }),
  setTelemetry: (partial) =>
    set((state) => ({ telemetry: { ...state.telemetry, ...partial } })),
  setInteraction: (partial) =>
    set((state) => ({ interaction: { ...state.interaction, ...partial } })),
  setAudioMuted: (audioMuted) => set({ audioMuted }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setWebglAvailable: (webglAvailable) => set({ webglAvailable }),
}));
