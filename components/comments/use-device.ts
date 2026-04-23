"use client";

import { useEffect, useState } from "react";

export type Device = "mobile" | "desktop";

export const MOBILE_MAX_WIDTH = 640;

export function currentDevice(): Device {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < MOBILE_MAX_WIDTH ? "mobile" : "desktop";
}

export function useDevice(): Device {
  const [device, setDevice] = useState<Device>(currentDevice);

  useEffect(() => {
    const sync = () => setDevice(currentDevice());
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return device;
}
