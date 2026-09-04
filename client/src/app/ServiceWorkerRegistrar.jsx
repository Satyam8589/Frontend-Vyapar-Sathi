"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("[SW] Registered, scope:", reg.scope);

        // Forward SYNC_BILLING messages from SW to the rest of the app
        navigator.serviceWorker.addEventListener("message", (e) => {
          if (e.data && e.data.type === "SYNC_BILLING") {
            window.dispatchEvent(new CustomEvent("sw-sync-billing"));
          }
        });

        // Detect new SW updates — log, but don't force reload to avoid
        // disrupting an in-progress billing session.
        reg.addEventListener("updatefound", () => {
          const incoming = reg.installing;
          if (!incoming) return;

          incoming.addEventListener("statechange", () => {
            if (
              incoming.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log(
                "[SW] New version available. Reload the page to activate."
              );
              // Optionally dispatch a custom event so the UI can notify the user.
              window.dispatchEvent(new CustomEvent("sw-update-available"));
            }
          });
        });
      } catch (err) {
        console.warn("[SW] Registration failed:", err);
      }
    };

    // Wait for the page to fully load before registering to avoid
    // competing with critical resources.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
