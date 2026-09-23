"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Always clear old workers first — cached "/" was keeping a stale FAQ open
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });

    if (typeof caches !== "undefined") {
      caches.keys().then((keys) => {
        keys
          .filter((key) => key.startsWith("drprime-"))
          .forEach((key) => caches.delete(key));
      });
    }

    // Only register a fresh SW in production builds
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
