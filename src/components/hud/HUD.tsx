"use client";

import { releaseCamera } from "@/lib/animations/flyCamera";
import { audio } from "@/lib/audio/audioManager";
import { STATION_DESIGNATION, STATION_NAME } from "@/lib/constants/station";
import { returnToSpace } from "@/hooks/useStationNavigation";
import { useStationStore } from "@/store/stationStore";
import { InteractionHint } from "./InteractionHint";
import { SystemStatus } from "./SystemStatus";
import { Telemetry } from "./Telemetry";

export function HUD() {
  const booted = useStationStore((state) => state.booted);
  const muted = useStationStore((state) => state.audioMuted);
  const failed = useStationStore((state) => state.mode === "FAILURE");
  const standard = useStationStore((state) => state.standardMode);
  const cameraState = useStationStore((state) => state.cameraState);
  const setAudioMuted = useStationStore((state) => state.setAudioMuted);
  const setStandardMode = useStationStore((state) => state.setStandardMode);

  if (!booted) return null;

  const toggleMute = () => {
    const next = !muted;
    setAudioMuted(next);
    audio.setMuted(next);
    if (!next) audio.play("click");
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 p-4 sm:p-6 ${failed ? "failure-hud" : ""}`}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.34em]">
            {STATION_NAME}
          </p>
          <p className="text-muted mt-2 font-mono text-[10px] tracking-[0.16em]">
            {STATION_DESIGNATION}
          </p>
        </div>
        <Telemetry />
      </div>

      <div className="absolute top-1/2 left-1/2 w-[min(36rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2">
        <InteractionHint />
      </div>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
        <SystemStatus />
        <div className="pointer-events-auto flex gap-2">
          {cameraState === "OVERVIEW" ? (
            <button
              type="button"
              className="border-line text-muted hover:text-foreground border px-2 py-1 font-mono text-[10px] tracking-[0.16em]"
              onClick={returnToSpace}
            >
              RETURN
            </button>
          ) : null}
          <button
            type="button"
            className="border-line text-muted hover:text-foreground border px-2 py-1 font-mono text-[10px] tracking-[0.16em]"
            aria-pressed={!muted}
            onClick={toggleMute}
          >
            {muted ? "MUTED" : "AUDIO"}
          </button>
          <button
            type="button"
            className="border-line text-muted hover:text-foreground border px-2 py-1 font-mono text-[10px] tracking-[0.16em]"
            aria-pressed={standard}
            onClick={() => {
              if (!standard) {
                releaseCamera();
                useStationStore.getState().setModule(null);
                useStationStore.getState().setCameraState("SPACE");
              }
              setStandardMode(!standard);
            }}
          >
            {standard ? "STATION VIEW" : "STANDARD MODE"}
          </button>
        </div>
      </div>
    </div>
  );
}
