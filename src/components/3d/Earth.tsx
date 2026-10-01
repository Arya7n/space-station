"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SCENE } from "@/lib/constants/scene";
import { useStationStore } from "@/store/stationStore";
import { createEarthMaps, disposeEarthMaps } from "./earthMaps";

const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const earthFragment = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 sun = normalize(sunDirection);
    float daylight = smoothstep(-0.06, 0.25, dot(normal, sun));
    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 halfDir = normalize(sun + viewDir);
    float water = smoothstep(0.04, 0.2, day.b - day.g);
    float spec = pow(max(dot(normal, halfDir), 0.0), 56.0) * water * daylight;
    vec3 color = mix(night * 1.35, day, daylight);
    color += spec * vec3(0.72, 0.8, 0.88);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const atmosphereVertex = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.8);
    gl_FragColor = vec4(0.42, 0.58, 0.78, fresnel * 0.85);
  }
`;

export function Earth() {
  const earth = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const spin = useRef(0);
  const maps = useMemo(() => createEarthMaps(), []);
  const sunDirection = useMemo(
    () => new THREE.Vector3(...SCENE.sunPosition).normalize(),
    [],
  );

  const surface = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: earthVertex,
        fragmentShader: earthFragment,
        uniforms: {
          dayMap: { value: maps.day },
          nightMap: { value: maps.night },
          sunDirection: { value: sunDirection },
        },
      }),
    [maps, sunDirection],
  );

  const cloudMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: maps.clouds,
        transparent: true,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
        opacity: 0.55,
      }),
    [maps.clouds],
  );

  const atmosphere = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      surface.dispose();
      cloudMaterial.dispose();
      atmosphere.dispose();
      disposeEarthMaps(maps);
    };
  }, [atmosphere, cloudMaterial, maps, surface]);

  useFrame((_, delta) => {
    if (useStationStore.getState().reducedMotion) return;
    spin.current += delta;
    if (earth.current) earth.current.rotation.y = spin.current * 0.02;
    if (clouds.current) clouds.current.rotation.y = spin.current * 0.028;
  });

  return (
    <group position={SCENE.earthPosition}>
      <mesh ref={earth} material={surface}>
        <sphereGeometry args={[SCENE.earthRadius, 64, 48]} />
      </mesh>
      <mesh ref={clouds} material={cloudMaterial}>
        <sphereGeometry args={[SCENE.earthRadius * 1.012, 48, 32]} />
      </mesh>
      <mesh material={atmosphere} scale={1.055}>
        <sphereGeometry args={[SCENE.earthRadius, 48, 32]} />
      </mesh>
    </group>
  );
}
