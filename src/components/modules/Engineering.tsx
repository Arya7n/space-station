"use client";

import { STATION_SYSTEMS } from "@/data/technologies";
import { audio } from "@/lib/audio/audioManager";
import { useState } from "react";
import { useStationStore } from "@/store/stationStore";

export function Engineering() {
  const [status, setStatus] = useState("");
  const online = useStationStore((state) => state.onlineSystems);
  const toggleSystem = useStationStore((state) => state.toggleSystem);

  return (
    <div className="space-y-4">
      <p className="text-muted font-mono text-[10px] tracking-[0.18em]">
        REACTOR BUS
      </p>
      <p className="text-accent min-h-4 font-mono text-[10px] tracking-[0.14em]">
        {status}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {STATION_SYSTEMS.map((system) => {
          const active = online.includes(system.id);
          return (
            <button
              key={system.id}
              type="button"
              aria-pressed={active}
              className={`border px-2 py-2 text-left font-mono text-[10px] tracking-[0.12em] ${
                active
                  ? "border-accent text-accent"
                  : "border-line text-foreground"
              }`}
              onClick={() => {
                audio.play("confirm");
                const line = `${system.label}: ${system.online}`;
                setStatus(line);
                toggleSystem(system.id, line);
              }}
            >
              {system.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
