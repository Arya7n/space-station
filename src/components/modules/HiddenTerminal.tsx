"use client";

import { useStationStore } from "@/store/stationStore";

export function HiddenTerminal() {
  const secrets = useStationStore((state) => state.secrets);

  return (
    <div className="space-y-3 font-mono text-[11px] leading-6">
      <p className="text-muted tracking-[0.18em]">RESTRICTED CHANNEL</p>
      <p>ORION / MAINTENANCE / BEACON / REACTOR</p>
      {secrets.length === 0 ? (
        <p className="text-muted">NO ENTRIES</p>
      ) : (
        <ul className="space-y-2">
          {secrets.map((secret) => (
            <li key={secret}>{secret}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
