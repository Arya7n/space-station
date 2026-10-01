"use client";

import { useStationStore } from "@/store/stationStore";

export function SystemStatus() {
  const mode = useStationStore((state) => state.mode);
  const failure = useStationStore((state) => state.failure);
  const label =
    failure?.stage === "restored"
      ? "SYSTEM RESTORED"
      : mode === "FAILURE"
        ? "MULTIPLE SYSTEM FAILURES"
        : "SYSTEM STATUS: NOMINAL";

  return (
    <p
      className={`font-mono text-[10px] tracking-[0.2em] ${mode === "FAILURE" ? "text-warning" : "text-muted"}`}
      aria-live="polite"
    >
      {label}
    </p>
  );
}
