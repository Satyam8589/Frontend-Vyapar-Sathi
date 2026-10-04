"use client";

/**
 * useAgentNavigation.js
 * =====================
 * React hook that subscribes to the agent navigation event bus and uses
 * Next.js useRouter to push to the requested page.
 *
 * Mount this ONCE in a high-level layout component so navigation works
 * regardless of which page the user is currently on.
 *
 * The route payload from the agent is a path template that may contain
 * ":storeId" placeholders. Pass the current storeId so they get resolved.
 *
 * Example agent route payloads:
 *   "/storeDashboard/:storeId/analytics"
 *   "/storeDashboard/:storeId/sellers"
 *   "/storeDashboard/:storeId/purchases"
 *   "/storeDashboard/:storeId/buyers"
 *   "/storeDashboard/:storeId/billing"
 *   "/storeDashboard/:storeId/overview"
 *   "/storeDashboard/:storeId/ai-dashboard"
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAgentNavigate } from "@/servies/agentEventBus";

/**
 * @param {string} storeId  The active store ID for resolving route templates.
 */
export function useAgentNavigation(storeId) {
  const router = useRouter();

  useEffect(() => {
    if (!storeId) return;

    const unsub = onAgentNavigate(({ route }) => {
      if (!route) return;
      // Replace :storeId placeholder with the actual store ID
      const resolved = route.replace(":storeId", storeId);
      router.push(resolved);
    });

    return unsub;
  }, [storeId, router]);
}

export default useAgentNavigation;
