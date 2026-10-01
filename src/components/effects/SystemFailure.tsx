"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { audio } from "@/lib/audio/audioManager";
import { FAILURE_TELEMETRY } from "@/lib/constants/station";
import { restoreStation } from "@/hooks/useStationNavigation";
import { useStationStore } from "@/store/stationStore";

export function SystemFailure() {
  const mode = useStationStore((state) => state.mode);
  const failure = useStationStore((state) => state.failure);
  const reduced = useStationStore((state) => state.reducedMotion);

  useEffect(() => {
    if (mode !== "FAILURE") return;
    const state = useStationStore.getState();
    state.setTelemetry(FAILURE_TELEMETRY);
    state.setFailure({ stage: "warning", count: 5 });
    if (!state.audioMuted) audio.startAlarm();

    const hold = reduced ? 0.4 : 2.2;
    const step = reduced ? 0.25 : 1;
    const timeline = gsap.timeline();
    timeline.call(
      () => {
        useStationStore.getState().setFailure({ stage: "reboot", count: 5 });
      },
      [],
      hold,
    );

    for (let count = 5; count >= 1; count -= 1) {
      const value = count;
      timeline.call(
        () => {
          useStationStore
            .getState()
            .setFailure({ stage: "reboot", count: value });
        },
        [],
        hold + (5 - count) * step,
      );
    }

    timeline.call(restoreStation, [], hold + 5 * step);
    return () => {
      timeline.kill();
      audio.stopAlarm();
    };
  }, [mode, reduced]);

  if (!failure || failure.stage === "restored") {
    if (failure?.stage === "restored") {
      return (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <p className="text-accent font-mono text-[12px] tracking-[0.28em]">
            SYSTEM RESTORED
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
      <div className="text-warning space-y-2 text-center font-mono text-[12px] tracking-[0.22em]">
        {failure.stage === "warning" ? (
          <>
            <p>WARNING</p>
            <p>MULTIPLE SYSTEM FAILURES</p>
            <p className="text-muted">POWER FAILURE</p>
            <p className="text-muted">LIFE SUPPORT UNSTABLE</p>
            <p className="text-muted">NAVIGATION OFFLINE</p>
          </>
        ) : (
          <>
            <p>EMERGENCY REBOOT</p>
            <p className="text-foreground text-[28px] tracking-[0.3em]">
              {failure.count}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
