"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ORIENT, POSITION } from "@/lib/constants/layout";
import { DockingPort } from "./DockingPort";
import { HullMesh } from "./HullMesh";
import { Span } from "./Span";
import { useStationAssets } from "./stationAssets";

const ALONG_Z: [number, number, number] = [-Math.PI / 2, 0, 0];

function WindowSlots({
  count,
  length,
  x,
}: {
  count: number;
  length: number;
  x: number;
}) {
  const { geometries, materials } = useStationAssets();
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const z = (index - (count - 1) / 2) * (length / count);
        return (
          <HullMesh
            key={index}
            geometry={geometries.window}
            material={materials.lamp}
            position={[x, 0.18, z]}
          />
        );
      })}
    </>
  );
}

function CommandModule() {
  const { geometries, materials } = useStationAssets();

  return (
    <group name="COMMAND">
      <Span
        from={POSITION.commandRoot}
        to={POSITION.command}
        radius={0.16}
        geometry={geometries.truss}
        material={materials.dark}
      />
      <group position={POSITION.command} quaternion={ORIENT.command}>
        <HullMesh
          geometry={geometries.command}
          material={materials.hull}
          rotation={ALONG_Z}
        />
        <WindowSlots count={4} length={2.4} x={1.02} />
      </group>
      <DockingPort position={POSITION.dock} quaternion={ORIENT.command} />
    </group>
  );
}

function LabModule() {
  const { geometries, materials } = useStationAssets();

  return (
    <group name="LAB">
      <Span
        from={POSITION.labRoot}
        to={POSITION.lab}
        radius={0.12}
        geometry={geometries.truss}
        material={materials.dark}
      />
      <group position={POSITION.lab} quaternion={ORIENT.lab}>
        <HullMesh geometry={geometries.lab} material={materials.hull} />
        <WindowSlots count={3} length={1.8} x={0.9} />
        {[0, 1, 2].map((index) => (
          <HullMesh
            key={index}
            geometry={geometries.tank}
            material={materials.dark}
            position={[(index - 1) * 0.48, 0.15, 1.55]}
            rotation={ALONG_Z}
          />
        ))}
      </group>
    </group>
  );
}

function EngineeringModule() {
  const { geometries, materials } = useStationAssets();
  const emergency = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a2a28",
        emissive: "#8a4538",
        emissiveIntensity: 0.45,
        roughness: 0.46,
      }),
    [],
  );

  useEffect(() => () => emergency.dispose(), [emergency]);

  return (
    <group name="ENGINEERING">
      <Span
        from={POSITION.engineeringRoot}
        to={POSITION.engineering}
        radius={0.14}
        geometry={geometries.truss}
        material={materials.dark}
      />
      <group position={POSITION.engineering} quaternion={ORIENT.engineering}>
        <HullMesh geometry={geometries.engineering} material={materials.hull} />
        <WindowSlots count={2} length={1.6} x={1.1} />
        {[0, 1, 2, 3].map((index) => (
          <HullMesh
            key={index}
            geometry={geometries.unitBox}
            material={materials.inset}
            position={[0, (index - 1.5) * 0.32, 1.62]}
            scale={[1.7, 0.06, 0.08]}
          />
        ))}
        <HullMesh
          geometry={geometries.unitBox}
          material={materials.dark}
          position={[-1.15, -0.7, 0.2]}
          scale={[0.08, 1.15, 0.08]}
        />
        <HullMesh
          geometry={geometries.unitBox}
          material={materials.dark}
          position={[1.15, -0.7, 0.2]}
          scale={[0.08, 1.15, 0.08]}
        />
        <mesh
          name="emergency-button"
          geometry={geometries.unitBox}
          material={emergency}
          position={[0.35, 0.35, 1.68]}
          scale={[0.22, 0.22, 0.1]}
        />
      </group>
      <DockingPort
        position={POSITION.secondaryDock}
        quaternion={ORIENT.engineering}
        scale={0.72}
      />
    </group>
  );
}

function ObservatoryModule() {
  const { geometries, materials } = useStationAssets();

  return (
    <group name="OBSERVATORY" position={POSITION.observatory}>
      <HullMesh geometry={geometries.cupola} material={materials.hull} />
      <HullMesh
        geometry={geometries.dome}
        material={materials.glass}
        position={[0, 0.46, 0]}
        scale={[1, 0.58, 1]}
        castShadow={false}
      />
      <HullMesh
        geometry={geometries.window}
        material={materials.lamp}
        position={[0, 0.16, 0.9]}
      />
    </group>
  );
}

function CommunicationsModule() {
  const { geometries, materials } = useStationAssets();

  return (
    <group name="COMMUNICATIONS" position={POSITION.comms}>
      <HullMesh
        geometry={geometries.mast}
        material={materials.dark}
        position={[0, 1.75, 0]}
      />
      <HullMesh
        geometry={geometries.dish}
        material={materials.hull}
        position={[0.2, 3.5, 0.4]}
        rotation={[0.9, 0.15, 0]}
      />
      <HullMesh
        geometry={geometries.whip}
        material={materials.dark}
        position={[-0.4, 2.5, -0.15]}
        rotation={[0.2, 0, -0.6]}
      />
      <HullMesh
        geometry={geometries.whip}
        material={materials.dark}
        position={[0.45, 2.15, 0.1]}
        rotation={[0.45, 0, 0.4]}
      />
    </group>
  );
}

export function QuarterPods() {
  const { geometries, materials } = useStationAssets();
  const pods = [
    {
      name: "QUARTERS",
      position: POSITION.quarterA,
      quaternion: ORIENT.quarterA,
    },
    {
      name: "QUARTERS-B",
      position: POSITION.quarterB,
      quaternion: ORIENT.quarterB,
    },
  ] as const;

  return (
    <>
      {pods.map((pod) => (
        <group
          key={pod.name}
          name={pod.name}
          position={pod.position}
          quaternion={pod.quaternion}
        >
          <HullMesh geometry={geometries.pod} material={materials.hull} />
          <HullMesh
            geometry={geometries.window}
            material={materials.lamp}
            position={[0.5, 0, 0.15]}
            rotation={[0, 0, Math.PI / 2]}
          />
        </group>
      ))}
    </>
  );
}

export function StationModules() {
  return (
    <group name="MODULES">
      <CommandModule />
      <LabModule />
      <EngineeringModule />
      <ObservatoryModule />
      <CommunicationsModule />
    </group>
  );
}
