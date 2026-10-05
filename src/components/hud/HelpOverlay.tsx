"use client";

import { useStationStore } from "@/store/stationStore";

const LINES = [
  "1–6     OPEN A DECK",
  "ESC     RETURN",
  "M       AUDIO",
  "CLICK   SELECT THE HULL",
  "?       CLOSE THIS LIST",
];

export function HelpOverlay() {
  const open = useStationStore((state) => state.helpOpen);
  const booted = useStationStore((state) => state.booted);
  const setHelpOpen = useStationStore((state) => state.setHelpOpen);

  if (!booted || !open) return null;

  return (
    <aside className="border-line pointer-events-auto absolute top-24 left-4 z-30 border bg-[#080a0d]/95 p-4 sm:left-6">
      <p className="font-mono text-[10px] tracking-[0.22em]">CONTROLS</p>
      <ul className="text-muted mt-3 space-y-2 font-mono text-[10px] tracking-[0.14em]">
        {LINES.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <button
        type="button"
        className="text-muted mt-4 font-mono text-[10px] tracking-[0.16em]"
        onClick={() => setHelpOpen(false)}
      >
        CLOSE
      </button>
    </aside>
  );
}
