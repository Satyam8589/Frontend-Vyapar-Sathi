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
 * The page payload from the agent is simply the name of the section.
 *
 * Example agent page payloads:
 *   "analytics"
 *   "sellers"
 *   "purchases"
 *   "buyers"
 *   "billing"
 *   "overview"
 *   "ai-dashboard"
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

    const unsub = onAgentNavigate(({ page }) => {
      if (!page) return;
      
      // Clean up the page string just in case
      const cleanPage = page.replace(/^\/+/, '');
      const resolved = `/storeDashboard/${storeId}/${cleanPage}`;
      router.push(resolved);
    });

    return unsub;
  }, [storeId, router]);
}

export default useAgentNavigation;
