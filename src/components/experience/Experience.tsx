"use client";

import dynamic from "next/dynamic";
import { usePointerInput } from "@/hooks/usePointerInput";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  return <SpaceScene />;
}
