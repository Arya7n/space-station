"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import { audio } from "@/lib/audio/audioManager";
import { useStationStore } from "@/store/stationStore";

const COUNT = 7;

function Rock({
  index,
  onResolve,
}: {
  index: number;
  onResolve: (destroyed: boolean) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const radius = useRef(20 + index * 1.6);
  const resolved = useRef(false);
  const angle = useMemo(() => index * 0.9 + 0.4, [index]);
  const height = useMemo(() => (index - 3) * 1.3, [index]);

  useFrame((_, delta) => {
    if (!mesh.current || resolved.current) return;
    const failed = useStationStore.getState().mode === "FAILURE";
    radius.current = Math.max(
      5.5,
      radius.current - delta * (failed ? 2.4 : 1.1),
    );
    mesh.current.position.set(
      Math.cos(angle) * radius.current,
      height + Math.sin(angle) * 0.4,
      Math.sin(angle) * radius.current,
    );
    mesh.current.rotation.y += delta * 0.4;
    if (radius.current <= 5.6) {
      resolved.current = true;
      onResolve(false);
    }
  });

  return (
    <mesh
      ref={mesh}
      onClick={(event) => {
        event.stopPropagation();
        if (resolved.current) return;
        resolved.current = true;
        onResolve(true);
      }}
    >
      <dodecahedronGeometry args={[0.42 + (index % 3) * 0.16, 0]} />
      <meshStandardMaterial color="#a3aab2" metalness={0.35} roughness={0.72} />
    </mesh>
  );
}

function Field() {
  const [alive, setAlive] = useState<number[]>(() =>
    Array.from({ length: COUNT }, (_, index) => index),
  );

  const resolve = (index: number, destroyed: boolean) => {
    setAlive((current) => current.filter((item) => item !== index));
    const state = useStationStore.getState();
    const remaining = Math.max(0, state.game.remaining - 1);
    const score = state.game.score + (destroyed ? 25 : 0);
    if (!destroyed) {
      state.setTelemetry({ hull: Math.max(70, state.telemetry.hull - 2) });
    } else {
      audio.play("click");
    }
    state.setGame({ active: remaining > 0, score, remaining });
    if (remaining === 0) {
      state.pushLog("THREAT CLEARED");
      state.setHint("THREAT CLEARED");
    }
  };

  return (
    <group name="THREATS">
      {alive.map((index) => (
        <Rock
          key={index}
          index={index}
          onResolve={(destroyed) => resolve(index, destroyed)}
        />
      ))}
    </group>
  );
}

export function AsteroidDefense() {
  const active = useStationStore((state) => state.game.active);
  if (!active) return null;
  return <Field />;
}
