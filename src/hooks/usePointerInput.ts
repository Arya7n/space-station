"use client";

import { useEffect } from "react";
import { pointer } from "@/lib/input/pointer";

export function usePointerInput() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}
