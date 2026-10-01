export const STATION_NAME = "ORBITAL-07";
export const STATION_DESIGNATION = "DEEP SPACE RESEARCH STATION";

export const MODULES = [
  "COMMAND",
  "LAB",
  "ENGINEERING",
  "OBSERVATORY",
  "COMMUNICATIONS",
  "QUARTERS",
  "HIDDEN",
] as const;

export type ModuleId = (typeof MODULES)[number];

export const CAMERA_STATES = [
  "SPACE",
  "APPROACH",
  "OVERVIEW",
  "ENTERING",
  "MODULE",
  "RETURNING",
] as const;

export type CameraState = (typeof CAMERA_STATES)[number];

export type StationMode = "NORMAL" | "FAILURE";

export type Telemetry = {
  power: number;
  oxygen: number;
  hull: number;
  temperature: number;
  fuel: number;
  velocity: number;
  reactorOutput: number;
};

export const INITIAL_TELEMETRY: Telemetry = {
  power: 87.3,
  oxygen: 98.4,
  hull: 100,
  temperature: 21.4,
  fuel: 64.2,
  velocity: 7.66,
  reactorOutput: 91.5,
};

export const FAILURE_TELEMETRY: Telemetry = {
  power: 24,
  oxygen: 71,
  hull: 82,
  temperature: 27.8,
  fuel: 61.4,
  velocity: 7.52,
  reactorOutput: 36,
};
