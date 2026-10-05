"use client";

import { useEffect, useState } from "react";

function formatElapsed(total: number) {
  const hours = String(Math.floor(total / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function MissionClock() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = performance.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((performance.now() - started) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="text-muted mt-3 font-mono text-[10px] tracking-[0.18em]">
      MET {formatElapsed(elapsed)}
    </p>
  );
}
