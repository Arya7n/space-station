"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  APPROACH_SHOT,
  HOME_SHOT,
  cameraPose,
} from "@/lib/animations/cameraShots";
import { flyToPose } from "@/lib/animations/flyCamera";
import { useStationStore } from "@/store/stationStore";

const LINES = [
  "ORBITAL-07",
  "DEEP SPACE RESEARCH STATION",
  "INITIALIZING",
  "NAVIGATION ........ ONLINE",
  "LIFE SUPPORT ...... ONLINE",
  "REACTOR ........... ONLINE",
  "COMMUNICATIONS .... ONLINE",
  "SYSTEM STATUS: NOMINAL",
  "WELCOME, CREW MEMBER.",
];

export function BootSequence() {
  const booted = useStationStore((state) => state.booted);
  const [step, setStep] = useState(0);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (useStationStore.getState().booted) return;
    const reduced = useStationStore.getState().reducedMotion;
    const spatial =
      useStationStore.getState().webglAvailable &&
      !useStationStore.getState().standardMode;

    const finish = () => {
      if (useStationStore.getState().booted) return;
      cameraPose.controlling = false;
      useStationStore.getState().setBooted(true);
    };

    if (reduced) {
      finish();
      return;
    }

    if (spatial) {
      cameraPose.controlling = true;
      cameraPose.x = APPROACH_SHOT.x;
      cameraPose.y = APPROACH_SHOT.y;
      cameraPose.z = APPROACH_SHOT.z;
      cameraPose.lx = APPROACH_SHOT.lx;
      cameraPose.ly = APPROACH_SHOT.ly;
      cameraPose.lz = APPROACH_SHOT.lz;
    }

    timeline.current = gsap.timeline({
      onComplete: () => {
        if (spatial) {
          flyToPose(HOME_SHOT, 1.6, finish);
          return;
        }
        finish();
      },
    });

    LINES.forEach((_, index) => {
      timeline.current?.call(() => setStep(index + 1), [], index * 0.38);
    });

    return () => {
      timeline.current?.kill();
    };
  }, []);

  if (booted) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/78 p-6 sm:p-10">
      <div className="space-y-2 font-mono text-[11px] tracking-[0.16em]">
        {LINES.slice(0, step).map((line) => (
          <p
            key={line}
            className={
              line.startsWith("WELCOME") ? "text-foreground pt-4" : "text-muted"
            }
          >
            {line}
          </p>
        ))}
      </div>
      <button
        type="button"
        className="text-muted mt-8 self-start font-mono text-[10px] tracking-[0.18em]"
        onClick={() => {
          timeline.current?.kill();
          cameraPose.x = HOME_SHOT.x;
          cameraPose.y = HOME_SHOT.y;
          cameraPose.z = HOME_SHOT.z;
          cameraPose.lx = HOME_SHOT.lx;
          cameraPose.ly = HOME_SHOT.ly;
          cameraPose.lz = HOME_SHOT.lz;
          cameraPose.controlling = false;
          useStationStore.getState().setBooted(true);
        }}
      >
        SKIP
      </button>
    </div>
  );
}
