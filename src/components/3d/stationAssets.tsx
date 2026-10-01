"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import * as THREE from "three";

function createSolarMap() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create solar array texture");
  }

  context.fillStyle = "#121a2b";
  context.fillRect(0, 0, 128, 64);
  context.strokeStyle = "#31465f";
  context.lineWidth = 1;

  for (let x = 0; x <= 128; x += 16) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 64);
    context.stroke();
  }

  for (let y = 0; y <= 64; y += 16) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(128, y);
    context.stroke();
  }

  context.fillStyle = "#9aabbb";
  context.fillRect(0, 30, 128, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createStationAssets() {
  const solarMap = createSolarMap();

  const materials = {
    hull: new THREE.MeshStandardMaterial({
      color: "#b4bcc4",
      metalness: 0.88,
      roughness: 0.32,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: "#626a72",
      metalness: 0.8,
      roughness: 0.46,
    }),
    inset: new THREE.MeshStandardMaterial({
      color: "#3c444c",
      metalness: 0.7,
      roughness: 0.55,
    }),
    solar: new THREE.MeshStandardMaterial({
      map: solarMap,
      color: "#d5dde6",
      metalness: 0.42,
      roughness: 0.34,
    }),
    lamp: new THREE.MeshStandardMaterial({
      color: "#1a2128",
      emissive: "#d7e2ea",
      emissiveIntensity: 0.62,
      roughness: 0.28,
      metalness: 0.08,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: "#1b2732",
      emissive: "#9eb4c2",
      emissiveIntensity: 0.16,
      roughness: 0.06,
      metalness: 0.12,
      transparent: true,
      opacity: 0.78,
    }),
    port: new THREE.MeshStandardMaterial({
      color: "#c45c4a",
      emissive: "#c45c4a",
      emissiveIntensity: 0.9,
      toneMapped: false,
    }),
    starboard: new THREE.MeshStandardMaterial({
      color: "#8ea888",
      emissive: "#8ea888",
      emissiveIntensity: 0.7,
      toneMapped: false,
    }),
  };

  const geometries = {
    core: new THREE.CylinderGeometry(1.4, 1.5, 3.4, 24),
    collar: new THREE.CylinderGeometry(1.64, 1.64, 0.16, 24),
    ring: new THREE.TorusGeometry(6.35, 0.34, 10, 84),
    spoke: new THREE.BoxGeometry(0.09, 0.08, 4.75),
    truss: new THREE.CylinderGeometry(1, 1, 1, 6),
    command: new THREE.CylinderGeometry(0.98, 1.08, 3.55, 22),
    lab: new THREE.BoxGeometry(1.75, 1.28, 2.75),
    engineering: new THREE.BoxGeometry(2.15, 1.75, 3.15),
    tank: new THREE.CylinderGeometry(0.3, 0.3, 1.2, 12),
    panel: new THREE.BoxGeometry(6.5, 0.045, 1.72),
    panelBack: new THREE.BoxGeometry(6.7, 0.06, 1.92),
    window: new THREE.BoxGeometry(0.62, 0.11, 0.05),
    mast: new THREE.CylinderGeometry(0.06, 0.1, 3.5, 8),
    dish: new THREE.ConeGeometry(0.78, 0.3, 20, 1, true),
    whip: new THREE.CylinderGeometry(0.045, 0.045, 2.2, 6),
    dockRing: new THREE.TorusGeometry(0.78, 0.06, 8, 28),
    dockTunnel: new THREE.CylinderGeometry(0.4, 0.5, 0.5, 16),
    petal: new THREE.BoxGeometry(0.08, 0.38, 0.32),
    reactorHousing: new THREE.CylinderGeometry(0.82, 0.96, 1.5, 18),
    reactorCore: new THREE.SphereGeometry(0.42, 18, 14),
    reactorRing: new THREE.TorusGeometry(1.02, 0.04, 8, 28),
    dome: new THREE.SphereGeometry(0.95, 28, 18),
    cupola: new THREE.CylinderGeometry(0.82, 0.96, 0.58, 20),
    pod: new THREE.CylinderGeometry(0.48, 0.48, 1.8, 16),
    nav: new THREE.SphereGeometry(0.12, 12, 10),
    unitBox: new THREE.BoxGeometry(1, 1, 1),
  };

  return { materials, geometries, solarMap };
}

export type StationAssets = ReturnType<typeof createStationAssets>;

const StationAssetContext = createContext<StationAssets | null>(null);

export function StationAssetProvider({ children }: { children: ReactNode }) {
  const assets = useMemo(() => createStationAssets(), []);

  useEffect(() => {
    return () => {
      Object.values(assets.materials).forEach((material) => material.dispose());
      Object.values(assets.geometries).forEach((geometry) =>
        geometry.dispose(),
      );
      assets.solarMap.dispose();
    };
  }, [assets]);

  return (
    <StationAssetContext.Provider value={assets}>
      {children}
    </StationAssetContext.Provider>
  );
}

export function useStationAssets() {
  const assets = useContext(StationAssetContext);
  if (!assets) {
    throw new Error(
      "Station components must render inside StationAssetProvider",
    );
  }
  return assets;
}
