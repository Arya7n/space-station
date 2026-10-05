import { create } from "zustand";
import {
  INITIAL_TELEMETRY,
  type CameraState,
  type ModuleId,
  type StationMode,
  type Telemetry,
} from "@/lib/constants/station";
import type { QualityTier } from "@/lib/quality";

export type InteractionState = {
  selectedObject: string | null;
  scanActive: boolean;
  emergencyActive: boolean;
};

export type GameState = {
  active: boolean;
  score: number;
  remaining: number;
};

export type FailureState = {
  stage: "warning" | "reboot" | "restored";
  count: number;
} | null;

type StationState = {
  mode: StationMode;
  currentModule: ModuleId | null;
  cameraState: CameraState;
  telemetry: Telemetry;
  interaction: InteractionState;
  audioMuted: boolean;
  reducedMotion: boolean;
  webglAvailable: boolean;
  booted: boolean;
  standardMode: boolean;
  quality: QualityTier;
  hint: string;
  hovered: string;
  projectId: string | null;
  onlineSystems: string[];
  secrets: string[];
  reactorStrikes: number;
  game: GameState;
  failure: FailureState;
  log: string[];
  visited: ModuleId[];
  setMode: (mode: StationMode) => void;
  setModule: (currentModule: ModuleId | null) => void;
  setCameraState: (cameraState: CameraState) => void;
  setTelemetry: (partial: Partial<Telemetry>) => void;
  setInteraction: (partial: Partial<InteractionState>) => void;
  setAudioMuted: (audioMuted: boolean) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setWebglAvailable: (webglAvailable: boolean) => void;
  setBooted: (booted: boolean) => void;
  setStandardMode: (standardMode: boolean) => void;
  setQuality: (quality: QualityTier) => void;
  setHint: (hint: string) => void;
  setHovered: (hovered: string) => void;
  setProjectId: (projectId: string | null) => void;
  toggleSystem: (id: string, line: string) => void;
  addSecret: (secret: string) => void;
  setReactorStrikes: (reactorStrikes: number) => void;
  setGame: (game: GameState) => void;
  setFailure: (failure: FailureState) => void;
  pushLog: (line: string) => void;
  markVisited: (moduleId: ModuleId) => void;
};

const idleGame: GameState = { active: false, score: 0, remaining: 0 };

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
  booted: false,
  standardMode: false,
  quality: "high",
  hint: "",
  hovered: "",
  projectId: null,
  onlineSystems: [],
  secrets: [],
  reactorStrikes: 0,
  game: idleGame,
  failure: null,
  log: ["STATION LINK ESTABLISHED"],
  visited: [],
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
  setBooted: (booted) => set({ booted }),
  setStandardMode: (standardMode) => set({ standardMode }),
  setQuality: (quality) => set({ quality }),
  setHint: (hint) => set({ hint }),
  setHovered: (hovered) => set({ hovered }),
  setProjectId: (projectId) => set({ projectId }),
  toggleSystem: (id, line) =>
    set((state) => {
      const online = state.onlineSystems.includes(id)
        ? state.onlineSystems
        : [...state.onlineSystems, id];
      return {
        onlineSystems: online,
        log: [line, ...state.log].slice(0, 12),
        hint: line,
      };
    }),
  addSecret: (secret) =>
    set((state) => {
      if (state.secrets.includes(secret)) return { hint: secret };
      return {
        secrets: [...state.secrets, secret],
        log: [secret, ...state.log].slice(0, 12),
        hint: secret,
      };
    }),
  setReactorStrikes: (reactorStrikes) => set({ reactorStrikes }),
  setGame: (game) => set({ game }),
  setFailure: (failure) => set({ failure }),
  pushLog: (line) =>
    set((state) => ({ log: [line, ...state.log].slice(0, 12) })),
  markVisited: (moduleId) =>
    set((state) =>
      state.visited.includes(moduleId)
        ? state
        : { visited: [...state.visited, moduleId] },
    ),
}));
