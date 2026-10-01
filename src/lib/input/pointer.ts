export const pointer = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
};

export function smoothPointer(delta: number, reduced: boolean) {
  const targetX = reduced ? 0 : pointer.targetX;
  const targetY = reduced ? 0 : pointer.targetY;
  const blend = 1 - Math.exp(-2.2 * delta);
  pointer.x += (targetX - pointer.x) * blend;
  pointer.y += (targetY - pointer.y) * blend;
  return pointer;
}
