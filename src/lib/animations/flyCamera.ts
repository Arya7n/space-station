import gsap from "gsap";
import { cameraPose, type Shot } from "./cameraShots";

let active: gsap.core.Tween | null = null;

export function flyToPose(
  shot: Shot,
  duration: number,
  onComplete?: () => void,
) {
  active?.kill();
  cameraPose.controlling = true;
  active = gsap.to(cameraPose, {
    x: shot.x,
    y: shot.y,
    z: shot.z,
    lx: shot.lx,
    ly: shot.ly,
    lz: shot.lz,
    duration,
    ease: "power2.inOut",
    onComplete,
  });
}

export function releaseCamera() {
  active?.kill();
  cameraPose.controlling = false;
}
