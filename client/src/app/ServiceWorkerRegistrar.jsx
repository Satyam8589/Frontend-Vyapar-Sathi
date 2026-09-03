"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then(function (reg) {
            console.log("[SW] Registered, scope:", reg.scope);

            // Forward sync messages from the SW to the rest of the app
            navigator.serviceWorker.addEventListener("message", function (e) {
              if (e.data && e.data.type === "SYNC_BILLING") {
                window.dispatchEvent(new CustomEvent("sw-sync-billing"));
              }
            });
          })
          .catch(function (err) {
            console.warn("[SW] Registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
