"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SCENE } from "@/lib/constants/scene";
import { useStationStore } from "@/store/stationStore";

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * (220.0 / -mvPosition.z), 0.45, 2.6);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, dist);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function createStarField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let seed = 0x07b107;

  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let index = 0; index < count; index += 1) {
    const radius = 150 + Math.cbrt(random()) * 700;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[index * 3 + 2] = radius * Math.cos(phi);

    const roll = random();
    if (roll > 0.97) {
      colors[index * 3] = 0.93;
      colors[index * 3 + 1] = 0.8;
      colors[index * 3 + 2] = 0.66;
    } else if (roll > 0.84) {
      colors[index * 3] = 0.68;
      colors[index * 3 + 1] = 0.78;
      colors[index * 3 + 2] = 0.95;
    } else {
      const shade = 0.72 + random() * 0.28;
      colors[index * 3] = shade;
      colors[index * 3 + 1] = shade;
      colors[index * 3 + 2] = Math.min(1, shade + 0.04);
    }

    sizes[index] = roll > 0.96 ? 2.4 + random() : 0.7 + random() * 1.1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  return geometry;
}

export function StarField() {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const geometry = useMemo(() => createStarField(SCENE.starCount), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (!group.current || useStationStore.getState().reducedMotion) return;
    elapsed.current += delta;
    group.current.rotation.y = elapsed.current * 0.004;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} />
    </group>
  );
}
