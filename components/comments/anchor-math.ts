export const PAGE_ANCHOR_ID = "__page__" as const;

export type AnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type RelativeCoords = { relX: number; relY: number };
export type ScreenCoords = { x: number; y: number };

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

export function computeRelativeCoords(
  rect: AnchorRect,
  clientX: number,
  clientY: number,
): RelativeCoords {
  if (rect.width === 0 || rect.height === 0) {
    return { relX: 0, relY: 0 };
  }
  return {
    relX: clamp01((clientX - rect.left) / rect.width),
    relY: clamp01((clientY - rect.top) / rect.height),
  };
}

export function computeScreenCoords(
  rect: AnchorRect,
  relX: number,
  relY: number,
): ScreenCoords {
  return {
    x: rect.left + relX * rect.width,
    y: rect.top + relY * rect.height,
  };
}
