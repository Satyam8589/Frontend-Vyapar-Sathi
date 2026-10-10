"use client";

/**
 * useAgentRefresh.js
 * ==================
 * React hook that subscribes a component to the agent event bus so it
 * can automatically re-fetch its data whenever the AI copilot mutates
 * backend state (product write, purchase create, seller update, etc.).
 *
 * Usage:
 *   const { refreshKey } = useAgentRefresh("purchases");
 *   // pass `refreshKey` as a dependency to useEffect / React Query key
 *
 * Pass "*" to react to any mutation.
 * Pass a specific section string to react only when that section changes:
 *   "products" | "inventory" | "purchases" | "sellers" | "buyers"
 *   | "expenses" | "analytics" | "overview" | "*"
 */

import { useEffect, useState, useCallback } from "react";
import { onAgentRefresh } from "@/servies/agentEventBus";

/**
 * @param {string | string[]} sections  Section(s) this component cares about.
 * @returns {{ refreshKey: number, triggerRefresh: () => void }}
 *   refreshKey  — increments whenever the agent signals a refresh for this section.
 *   triggerRefresh — manually bump the refresh key (for optimistic UI).
 */
export function useAgentRefresh(sections = "*") {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const sectionList = Array.isArray(sections) ? sections : [sections];

    const unsub = onAgentRefresh(({ section }) => {
      if (sectionList.includes("*") || section === "*" || sectionList.includes(section)) {
        setRefreshKey((k) => k + 1);
      }
    });

    return unsub;
  }, [sections]);

  return { refreshKey, triggerRefresh };
}

export default useAgentRefresh;
