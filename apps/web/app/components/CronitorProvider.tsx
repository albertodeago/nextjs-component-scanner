"use client";

import { useCronitor } from "@cronitorio/cronitor-rum-nextjs";

export function CronitorProvider({ children }: { children: React.ReactNode }) {
  useCronitor("276dba7b111e5359e5392646b228f20d", { debug: true });
  return <>{children}</>;
}

export function trackEvent(name: string) {
  if (typeof window !== "undefined" && window.cronitor) {
    window.cronitor("track", name);
  }
}

declare global {
  interface Window {
    cronitor?: (command: string, ...args: unknown[]) => void;
  }
}
