import * as THREE from "three";

export const LAYOUT = {
  ringRadius: 6.35,
  solarY: 1.9,
  command: { angle: 180, radius: 10.55, y: 0.05 },
  lab: { angle: 228, radius: 9.35, y: 0.1 },
  engineering: { angle: 32, radius: 9.65, y: -0.3 },
  quarters: [
    { angle: 50, radius: 6.35, y: 0 },
    { angle: 230, radius: 6.35, y: 0 },
  ],
} as const;

export function radial(
  angleDeg: number,
  radius: number,
  y = 0,
): [number, number, number] {
  const angle = (angleDeg * Math.PI) / 180;
  return [Math.sin(angle) * radius, y, Math.cos(angle) * radius];
}

function outwardQuaternion(angleDeg: number) {
  const angle = (angleDeg * Math.PI) / 180;
  const outward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    outward,
  );
}

function tangentQuaternion(angleDeg: number) {
  const angle = (angleDeg * Math.PI) / 180;
  const tangent = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    tangent,
  );
}

export const POSITION = {
  command: radial(
    LAYOUT.command.angle,
    LAYOUT.command.radius,
    LAYOUT.command.y,
  ),
  commandRoot: radial(LAYOUT.command.angle, 1.75, LAYOUT.command.y),
  lab: radial(LAYOUT.lab.angle, LAYOUT.lab.radius, LAYOUT.lab.y),
  labRoot: radial(LAYOUT.lab.angle, 1.75, LAYOUT.lab.y),
  engineering: radial(
    LAYOUT.engineering.angle,
    LAYOUT.engineering.radius,
    LAYOUT.engineering.y,
  ),
  engineeringRoot: radial(LAYOUT.engineering.angle, 1.75, LAYOUT.engineering.y),
  quarterA: radial(
    LAYOUT.quarters[0].angle,
    LAYOUT.quarters[0].radius,
    LAYOUT.quarters[0].y,
  ),
  quarterB: radial(
    LAYOUT.quarters[1].angle,
    LAYOUT.quarters[1].radius,
    LAYOUT.quarters[1].y,
  ),
  dock: radial(LAYOUT.command.angle, 12.55, LAYOUT.command.y),
  secondaryDock: radial(LAYOUT.engineering.angle, 11.45, LAYOUT.engineering.y),
  observatory: [0, 2.2, 1.35] as [number, number, number],
  comms: [1.05, 1.75, -0.55] as [number, number, number],
  reactor: [0, -2.5, 0] as [number, number, number],
  maintenance: [1.28, -0.78, 0.48] as [number, number, number],
  portLight: [-7.15, 0.55, 1.1] as [number, number, number],
  starboardLight: [7.15, 0.55, -1.1] as [number, number, number],
  beacon: [1.05, 5.2, -0.55] as [number, number, number],
};

export const ORIENT = {
  command: outwardQuaternion(LAYOUT.command.angle),
  lab: outwardQuaternion(LAYOUT.lab.angle),
  engineering: outwardQuaternion(LAYOUT.engineering.angle),
  quarterA: tangentQuaternion(LAYOUT.quarters[0].angle),
  quarterB: tangentQuaternion(LAYOUT.quarters[1].angle),
};

export const SPOKE_ANGLES = [20, 80, 140, 200, 260, 320] as const;
