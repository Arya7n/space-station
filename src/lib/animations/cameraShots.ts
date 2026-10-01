import { POSITION } from "@/lib/constants/layout";
import type { ModuleId } from "@/lib/constants/station";

export type Shot = {
  x: number;
  y: number;
  z: number;
  lx: number;
  ly: number;
  lz: number;
};

function approach(
  target: readonly [number, number, number],
  distance: number,
  lift: number,
): Shot {
  const [x, y, z] = target;
  const length = Math.hypot(x, 0, z) || 1;
  return {
    x: x + (x / length) * distance,
    y: y + lift,
    z: z + (z / length) * distance,
    lx: x,
    ly: y,
    lz: z,
  };
}

export const HOME_SHOT: Shot = { x: 0, y: 6, z: 42, lx: 0, ly: 0.2, lz: 0 };

export const APPROACH_SHOT: Shot = { x: 0, y: 12, z: 78, lx: 0, ly: 0, lz: 0 };

export const OVERVIEW_SHOT: Shot = {
  x: 18,
  y: 11,
  z: 28,
  lx: 0,
  ly: 0.4,
  lz: 0,
};

export const MODULE_SHOTS: Record<ModuleId, Shot> = {
  COMMAND: approach(POSITION.command, 7.5, 2.6),
  LAB: approach(POSITION.lab, 6.5, 2.2),
  ENGINEERING: approach(POSITION.engineering, 7.2, 2.4),
  OBSERVATORY: { x: 2.5, y: 6.8, z: 9.2, lx: 0, ly: 2.5, lz: 1.35 },
  COMMUNICATIONS: { x: 6.2, y: 5.4, z: 3.2, lx: 1.05, ly: 3.4, lz: -0.55 },
  QUARTERS: approach(POSITION.quarterA, 5.5, 1.8),
  HIDDEN: { x: 4.8, y: 0.6, z: 3.4, lx: 1.28, ly: -0.4, lz: 0.48 },
};

export const cameraPose: Shot & { controlling: boolean } = {
  ...APPROACH_SHOT,
  controlling: true,
};
