"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

const CLOUDS = [
  {
    position: [-150, 36, -260] as [number, number, number],
    scale: [320, 180, 1] as [number, number, number],
    color: "#8ea4be",
    opacity: 0.07,
  },
  {
    position: [190, -28, -300] as [number, number, number],
    scale: [260, 150, 1] as [number, number, number],
    color: "#c2b39a",
    opacity: 0.045,
  },
  {
    position: [-30, 90, -340] as [number, number, number],
    scale: [380, 210, 1] as [number, number, number],
    color: "#6e849c",
    opacity: 0.06,
  },
];

function createGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export function Nebula() {
  const texture = useMemo(() => createGlowTexture(), []);

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  if (!texture) return null;

  return (
    <group>
      {CLOUDS.map((cloud) => (
        <sprite
          key={cloud.position.join("-")}
          position={cloud.position}
          scale={cloud.scale}
        >
          <spriteMaterial
            map={texture}
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  );
}
