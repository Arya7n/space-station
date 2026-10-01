"use client";

import { useStationStore } from "@/store/stationStore";

export function InteractionHint() {
  const hint = useStationStore((state) => state.hint);
  const booted = useStationStore((state) => state.booted);
  const cameraState = useStationStore((state) => state.cameraState);
  const game = useStationStore((state) => state.game);
  const moduleId = useStationStore((state) => state.currentModule);

  if (!booted) return null;

  let text = hint;
  if (game.active) {
    text = `THREAT DETECTED    ASTEROIDS ${String(game.remaining).padStart(2, "0")}    SCORE ${game.score}`;
  } else if (!text && cameraState === "SPACE" && !moduleId) {
    text = "SELECT A MODULE";
  }

  if (!text) return null;

  return (
    <p className="text-accent/90 text-center font-mono text-[10px] tracking-[0.22em]">
      {text}
    </p>
  );
}
