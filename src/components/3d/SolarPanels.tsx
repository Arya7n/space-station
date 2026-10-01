"use client";

import { LAYOUT, radial } from "@/lib/constants/layout";
import { HullMesh } from "./HullMesh";
import { Span } from "./Span";
import { useStationAssets } from "./stationAssets";

const PANEL_ROOTS = {
  port: radial(270, 1.9, LAYOUT.solarY),
  portTip: radial(270, 9.7, LAYOUT.solarY),
  starboard: radial(90, 1.9, LAYOUT.solarY),
  starboardTip: radial(90, 9.7, LAYOUT.solarY),
} as const;

function Wing({ side }: { side: 1 | -1 }) {
  const { geometries, materials } = useStationAssets();
  const x = side * 13.15;

  return (
    <group position={[x, LAYOUT.solarY, 0]}>
      <HullMesh
        geometry={geometries.panel}
        material={materials.solar}
        position={[0, 0.02, 1.05]}
      />
      <HullMesh
        geometry={geometries.panelBack}
        material={materials.dark}
        position={[0, -0.04, 1.05]}
      />
      <HullMesh
        geometry={geometries.panel}
        material={materials.solar}
        position={[0, 0.02, -1.05]}
      />
      <HullMesh
        geometry={geometries.panelBack}
        material={materials.dark}
        position={[0, -0.04, -1.05]}
      />
      <HullMesh
        geometry={geometries.unitBox}
        material={materials.dark}
        position={[0, 0, 0]}
        scale={[6.8, 0.08, 0.12]}
      />
    </group>
  );
}

export function SolarPanels() {
  const { geometries, materials } = useStationAssets();

  return (
    <group name="SOLAR">
      <Wing side={1} />
      <Wing side={-1} />
      <Span
        from={PANEL_ROOTS.starboard}
        to={PANEL_ROOTS.starboardTip}
        radius={0.08}
        geometry={geometries.truss}
        material={materials.dark}
      />
      <Span
        from={PANEL_ROOTS.port}
        to={PANEL_ROOTS.portTip}
        radius={0.08}
        geometry={geometries.truss}
        material={materials.dark}
      />
    </group>
  );
}
