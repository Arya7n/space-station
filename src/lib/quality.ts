export type QualityTier = "high" | "low";

export function detectQuality(): QualityTier {
  if (typeof window === "undefined") return "high";
  const narrow = window.innerWidth < 900;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 8;
  if (narrow || coarse || cores <= 4) return "low";
  return "high";
}

export function detectWebgl() {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
