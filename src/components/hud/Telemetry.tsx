"use client";

import { useStationStore } from "@/store/stationStore";

function line(label: string, value: string) {
  return (
    <div className="flex justify-between gap-6" key={label}>
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function Telemetry() {
  const telemetry = useStationStore((state) => state.telemetry);
  const failed = useStationStore((state) => state.mode === "FAILURE");

  return (
    <div
      className={`font-mono text-[10px] tracking-[0.14em] ${failed ? "text-warning" : "text-foreground"}`}
    >
      {line("POWER", `${telemetry.power.toFixed(1)}%`)}
      {line("OXYGEN", `${telemetry.oxygen.toFixed(1)}%`)}
      {line("HULL", `${telemetry.hull.toFixed(1)}%`)}
      {line("TEMP", `${telemetry.temperature.toFixed(1)}°C`)}
    </div>
  );
}
