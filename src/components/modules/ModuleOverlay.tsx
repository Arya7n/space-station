"use client";

import type { ModuleId } from "@/lib/constants/station";
import { returnToSpace } from "@/hooks/useStationNavigation";
import { useStationStore } from "@/store/stationStore";
import { Panel } from "@/components/ui/Panel";
import { CommandCenter } from "./CommandCenter";
import { Communications } from "./Communications";
import { Engineering } from "./Engineering";
import { HiddenTerminal } from "./HiddenTerminal";
import { Observatory } from "./Observatory";
import { Quarters } from "./Quarters";
import { ResearchLab } from "./ResearchLab";

const TITLES: Record<ModuleId, string> = {
  COMMAND: "COMMAND CENTER",
  LAB: "RESEARCH LAB",
  ENGINEERING: "ENGINEERING",
  OBSERVATORY: "OBSERVATORY",
  COMMUNICATIONS: "COMMUNICATIONS",
  QUARTERS: "CREW QUARTERS",
  HIDDEN: "HIDDEN TERMINAL",
};

export function ModuleBody({ moduleId }: { moduleId: ModuleId }) {
  if (moduleId === "COMMAND") return <CommandCenter />;
  if (moduleId === "LAB") return <ResearchLab />;
  if (moduleId === "ENGINEERING") return <Engineering />;
  if (moduleId === "OBSERVATORY") return <Observatory />;
  if (moduleId === "COMMUNICATIONS") return <Communications />;
  if (moduleId === "QUARTERS") return <Quarters />;
  return <HiddenTerminal />;
}

export function ModuleOverlay() {
  const moduleId = useStationStore((state) => state.currentModule);
  const cameraState = useStationStore((state) => state.cameraState);
  const standard = useStationStore((state) => state.standardMode);
  const booted = useStationStore((state) => state.booted);

  if (!booted || standard || !moduleId || cameraState !== "MODULE") return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <Panel title={TITLES[moduleId]} onClose={returnToSpace}>
        <ModuleBody moduleId={moduleId} />
      </Panel>
    </div>
  );
}
