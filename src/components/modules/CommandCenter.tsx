"use client";

import { useState } from "react";
import { audio } from "@/lib/audio/audioManager";
import type { ModuleId } from "@/lib/constants/station";
import {
  beginFailure,
  openModule,
  startDefense,
} from "@/hooks/useStationNavigation";
import { useStationStore } from "@/store/stationStore";
import { Button } from "@/components/ui/Button";

const TABS = ["MISSION", "SYSTEMS", "CREW", "NAVIGATION", "LOGS"] as const;
type Tab = (typeof TABS)[number];

const DESTINATIONS: { id: ModuleId; label: string }[] = [
  { id: "LAB", label: "RESEARCH LAB" },
  { id: "ENGINEERING", label: "ENGINEERING" },
  { id: "OBSERVATORY", label: "OBSERVATORY" },
  { id: "COMMUNICATIONS", label: "COMMUNICATIONS" },
  { id: "QUARTERS", label: "CREW QUARTERS" },
];

export function CommandCenter() {
  const [tab, setTab] = useState<Tab>("MISSION");
  const log = useStationStore((state) => state.log);
  const mode = useStationStore((state) => state.mode);
  const telemetry = useStationStore((state) => state.telemetry);

  return (
    <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
      <div
        className="flex flex-row gap-2 overflow-x-auto sm:flex-col"
        role="tablist"
      >
        {TABS.map((item) => (
          <Button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "border-accent text-accent" : ""}
            onClick={() => {
              audio.play("click");
              setTab(item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div
        role="tabpanel"
        className="font-mono text-[11px] leading-6 tracking-[0.08em]"
      >
        {tab === "MISSION" ? (
          <div className="text-muted space-y-3">
            <p>ORBITAL-07</p>
            <p>DEEP SPACE RESEARCH STATION</p>
            <p className="text-foreground">
              {mode === "FAILURE"
                ? "OBJECTIVE: RESTORE NOMINAL SYSTEMS"
                : "OBJECTIVE: HOLD ORBIT"}
            </p>
          </div>
        ) : null}
        {tab === "SYSTEMS" ? (
          <div className="space-y-3">
            <p className="text-muted">
              POWER {telemetry.power.toFixed(1)} / REACTOR{" "}
              {telemetry.reactorOutput.toFixed(1)}
            </p>
            <Button onClick={beginFailure}>DECLARE EMERGENCY</Button>
          </div>
        ) : null}
        {tab === "CREW" ? (
          <div className="text-muted space-y-2">
            <p className="text-foreground">CREW MEMBER</p>
            <p>FULL STACK ENGINEER</p>
            <p>WATCH: STATION SYSTEMS</p>
          </div>
        ) : null}
        {tab === "NAVIGATION" ? (
          <div className="flex flex-col gap-2">
            {DESTINATIONS.map((destination) => (
              <Button
                key={destination.id}
                onClick={() => openModule(destination.id)}
              >
                {destination.label}
              </Button>
            ))}
            <Button onClick={startDefense}>ASTEROID DEFENSE</Button>
          </div>
        ) : null}
        {tab === "LOGS" ? (
          <ul className="text-muted space-y-2">
            {log.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
