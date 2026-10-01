"use client";

import { useState } from "react";
import {
  STATION_DESIGNATION,
  STATION_NAME,
  type ModuleId,
} from "@/lib/constants/station";
import { Button } from "@/components/ui/Button";
import { ModuleBody } from "./ModuleOverlay";

const LINKS: { id: ModuleId; label: string }[] = [
  { id: "COMMAND", label: "COMMAND" },
  { id: "LAB", label: "RESEARCH" },
  { id: "ENGINEERING", label: "ENGINEERING" },
  { id: "OBSERVATORY", label: "OBSERVATORY" },
  { id: "COMMUNICATIONS", label: "COMMUNICATIONS" },
  { id: "QUARTERS", label: "QUARTERS" },
  { id: "HIDDEN", label: "LOG" },
];

export function StandardMode() {
  const [moduleId, setModuleId] = useState<ModuleId>("COMMAND");

  return (
    <div className="bg-background absolute inset-0 z-0 overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-6 px-4 py-20">
        <header>
          <p className="font-mono text-[10px] tracking-[0.28em]">
            {STATION_NAME}
          </p>
          <p className="text-muted mt-2 font-mono text-[10px] tracking-[0.14em]">
            {STATION_DESIGNATION}
          </p>
          <p className="text-muted mt-4 max-w-xl text-sm leading-6">
            WebGL is optional. The same station records are available from this
            console.
          </p>
        </header>
        <nav className="flex flex-wrap gap-2" aria-label="Station sections">
          {LINKS.map((link) => (
            <Button
              key={link.id}
              aria-current={moduleId === link.id ? "page" : undefined}
              className={
                moduleId === link.id ? "border-accent text-accent" : ""
              }
              onClick={() => setModuleId(link.id)}
            >
              {link.label}
            </Button>
          ))}
        </nav>
        <div className="border-line border p-4">
          <ModuleBody moduleId={moduleId} />
        </div>
      </div>
    </div>
  );
}
