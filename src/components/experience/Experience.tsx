"use client";

import dynamic from "next/dynamic";
import { AudioDirector } from "@/components/effects/AudioDirector";
import { BootSequence } from "@/components/effects/BootSequence";
import { SystemFailure } from "@/components/effects/SystemFailure";
import { HUD } from "@/components/hud/HUD";
import { ModuleOverlay } from "@/components/modules/ModuleOverlay";
import { StandardMode } from "@/components/modules/StandardMode";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { usePointerInput } from "@/hooks/usePointerInput";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useWebglCapability } from "@/hooks/useWebglCapability";
import { useStationStore } from "@/store/stationStore";

function SceneFallback() {
  return (
    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
      <p className="text-muted font-mono text-[10px] tracking-[0.22em]">
        ESTABLISHING STATION LINK
      </p>
    </div>
  );
}

const SpaceScene = dynamic(
  () => import("@/components/3d/SpaceScene").then((mod) => mod.SpaceScene),
  { ssr: false, loading: () => <SceneFallback /> },
);

export function Experience() {
  useReducedMotion();
  usePointerInput();
  useTelemetry();
  useKeyboardNav();
  useWebglCapability();
  const standard = useStationStore((state) => state.standardMode);
  const webgl = useStationStore((state) => state.webglAvailable);

  return (
    <>
      {standard || !webgl ? <StandardMode /> : <SpaceScene />}
      <BootSequence />
      <HUD />
      <ModuleOverlay />
      <SystemFailure />
      <AudioDirector />
    </>
  );
}
