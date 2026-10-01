"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SCENE } from "@/lib/constants/scene";
import { useStationStore } from "@/store/stationStore";

type PartProps = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

function Part({ geometry, material, position, rotation, scale }: PartProps) {
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
}

export function SpaceStation() {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  const geometries = useMemo(
    () => ({
      core: new THREE.CylinderGeometry(1.15, 1.25, 2.5, 28),
      collar: new THREE.CylinderGeometry(1.42, 1.42, 0.28, 28),
      ring: new THREE.TorusGeometry(4.55, 0.13, 10, 80),
      spoke: new THREE.BoxGeometry(0.07, 0.06, 3.2),
      truss: new THREE.CylinderGeometry(0.07, 0.07, 1, 8),
      command: new THREE.CylinderGeometry(0.78, 0.9, 2.5, 22),
      dock: new THREE.TorusGeometry(0.58, 0.045, 8, 28),
      lab: new THREE.BoxGeometry(1.45, 1.05, 2.35),
      engineering: new THREE.BoxGeometry(1.7, 1.32, 2.2),
      mast: new THREE.CylinderGeometry(0.06, 0.1, 2.5, 8),
      dish: new THREE.ConeGeometry(0.52, 0.2, 18, 1, true),
      panel: new THREE.BoxGeometry(4.6, 0.035, 1.45),
      slit: new THREE.BoxGeometry(0.42, 0.1, 0.04),
    }),
    [],
  );

  const materials = useMemo(
    () => ({
      hull: new THREE.MeshStandardMaterial({
        color: "#a7aeb6",
        metalness: 0.86,
        roughness: 0.34,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: "#6d747c",
        metalness: 0.78,
        roughness: 0.46,
      }),
      solar: new THREE.MeshStandardMaterial({
        color: "#152033",
        metalness: 0.48,
        roughness: 0.24,
        emissive: "#16324a",
        emissiveIntensity: 0.18,
      }),
      lamp: new THREE.MeshStandardMaterial({
        color: "#141a20",
        emissive: "#d5e0e8",
        emissiveIntensity: 0.7,
        metalness: 0.1,
        roughness: 0.25,
      }),
    }),
    [],
  );

  useEffect(() => {
    const geometryList = Object.values(geometries);
    const materialList = Object.values(materials);
    return () => {
      geometryList.forEach((geometry) => geometry.dispose());
      materialList.forEach((material) => material.dispose());
    };
  }, [geometries, materials]);

  useFrame((_, delta) => {
    if (!group.current || useStationStore.getState().reducedMotion) return;
    elapsed.current += delta;
    group.current.rotation.y = elapsed.current * SCENE.stationSpin;
  });

  const spokes = [0, 1, 2, 3].map((index) => {
    const angle = (index / 4) * Math.PI * 2;
    return {
      key: `spoke-${index}`,
      position: [Math.sin(angle) * 2.9, 0, Math.cos(angle) * 2.9] as [
        number,
        number,
        number,
      ],
      rotation: [0, angle, 0] as [number, number, number],
    };
  });

  const slits = [0, 1, 2, 3, 4, 5].map((index) => {
    const angle = (index / 6) * Math.PI * 2;
    return {
      key: `slit-${index}`,
      position: [Math.sin(angle) * 1.2, 0.42, Math.cos(angle) * 1.2] as [
        number,
        number,
        number,
      ],
      rotation: [0, angle, 0] as [number, number, number],
    };
  });

  return (
    <group ref={group}>
      <Part geometry={geometries.core} material={materials.hull} />
      <Part geometry={geometries.collar} material={materials.dark} />
      <Part
        geometry={geometries.ring}
        material={materials.hull}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {spokes.map((spoke) => (
        <Part
          key={spoke.key}
          geometry={geometries.spoke}
          material={materials.dark}
          position={spoke.position}
          rotation={spoke.rotation}
        />
      ))}
      {slits.map((slit) => (
        <Part
          key={slit.key}
          geometry={geometries.slit}
          material={materials.lamp}
          position={slit.position}
          rotation={slit.rotation}
        />
      ))}

      <Part
        geometry={geometries.command}
        material={materials.hull}
        position={[0, 0, -7]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Part
        geometry={geometries.truss}
        material={materials.dark}
        position={[0, 0, -3.55]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 4.5, 1]}
      />
      <Part
        geometry={geometries.dock}
        material={materials.dark}
        position={[0, 0, -8.3]}
      />
      <Part
        geometry={geometries.slit}
        material={materials.lamp}
        position={[0.82, 0.15, -6.4]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Part
        geometry={geometries.slit}
        material={materials.lamp}
        position={[0.82, 0.15, -7.3]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <Part
        geometry={geometries.lab}
        material={materials.hull}
        position={[-6.35, 0.12, 0.7]}
      />
      <Part
        geometry={geometries.truss}
        material={materials.dark}
        position={[-3.55, 0.12, 0.7]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[1, 4.3, 1]}
      />
      <Part
        geometry={geometries.slit}
        material={materials.lamp}
        position={[-6.35, 0.42, 1.88]}
      />

      <Part
        geometry={geometries.engineering}
        material={materials.hull}
        position={[6.55, -0.08, -0.25]}
      />
      <Part
        geometry={geometries.truss}
        material={materials.dark}
        position={[3.6, -0.08, -0.25]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[1, 4.4, 1]}
      />
      <Part
        geometry={geometries.slit}
        material={materials.lamp}
        position={[6.55, 0.35, 0.88]}
      />

      <Part
        geometry={geometries.mast}
        material={materials.dark}
        position={[0.15, 2.45, 0.1]}
      />
      <Part
        geometry={geometries.dish}
        material={materials.hull}
        position={[0.15, 3.82, 0.35]}
        rotation={[0.7, 0, 0]}
      />

      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 8.15, 0, 0]}>
          <Part
            geometry={geometries.panel}
            material={materials.solar}
            position={[0, 0, 0.95]}
          />
          <Part
            geometry={geometries.panel}
            material={materials.solar}
            position={[0, 0, -0.95]}
          />
          <Part
            geometry={geometries.truss}
            material={materials.dark}
            position={[side * -4.5, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            scale={[1, 4.7, 1]}
          />
        </group>
      ))}
    </group>
  );
}
