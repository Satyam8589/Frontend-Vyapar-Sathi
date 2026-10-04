/**
 * agentEventBus.js
 * ================
 * A lightweight, framework-agnostic event bus that lets the AI copilot
 * communicate with the rest of the app in real time.
 *
 * Two event types are supported:
 *
 *   1. "agent:refresh" — emitted when the agent modifies backend data
 *      and the UI should re-fetch.  Payload: { section: string }
 *      Possible section values:
 *        "inventory" | "products" | "purchases" | "sellers" | "buyers"
 *        | "expenses" | "analytics" | "overview" | "*" (all)
 *
 *   2. "agent:navigate" — emitted when the agent wants the app to
 *      navigate to a different page.  Payload: { route: string }
 *      Example routes: "/storeDashboard/:storeId/analytics"
 *
 * Usage in a React component:
 *
 *   import { onAgentRefresh, onAgentNavigate } from "@/servies/agentEventBus";
 *   useEffect(() => {
 *     const unsub = onAgentRefresh(({ section }) => {
 *       if (section === "purchases" || section === "*") refetch();
 *     });
 *     return unsub;
 *   }, []);
 */

const REFRESH_EVENT = "agent:refresh";
const NAVIGATE_EVENT = "agent:navigate";

/**
 * Emit a data-refresh signal to all subscribed components.
 * @param {string} section  Which data domain changed (e.g. "products").
 */
export function emitAgentRefresh(section = "*") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(REFRESH_EVENT, { detail: { section } })
  );
}

/**
 * Emit a navigation command.
 * @param {string} route  The absolute path to navigate to.
 */
export function emitAgentNavigate(route) {
  if (typeof window === "undefined" || !route) return;
  window.dispatchEvent(
    new CustomEvent(NAVIGATE_EVENT, { detail: { route } })
  );
}

/**
 * Subscribe to agent refresh events.
 * @param {(payload: { section: string }) => void} handler
 * @returns {() => void}  Unsubscribe function.
 */
export function onAgentRefresh(handler) {
  if (typeof window === "undefined") return () => {};
  const listener = (e) => handler(e.detail);
  window.addEventListener(REFRESH_EVENT, listener);
  return () => window.removeEventListener(REFRESH_EVENT, listener);
}

/**
 * Subscribe to agent navigation events.
 * @param {(payload: { route: string }) => void} handler
 * @returns {() => void}  Unsubscribe function.
 */
export function onAgentNavigate(handler) {
  if (typeof window === "undefined") return () => {};
  const listener = (e) => handler(e.detail);
  window.addEventListener(NAVIGATE_EVENT, listener);
  return () => window.removeEventListener(NAVIGATE_EVENT, listener);
}
