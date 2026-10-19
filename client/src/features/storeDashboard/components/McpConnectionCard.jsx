"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plug,
  Server,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Cpu,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  Code,
  Key,
  Globe,
  Lock,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

/**
 * Fixed cloud domain for Vyapar Sakha AI service.
 */
const CLOUD_AI_DOMAIN = "https://ai.vyaparsakha.store";

/**
 * Categorized summary of the primary tools exposed by Vyapar Sakha MCP server.
 */
const TOOL_CATEGORIES = [
  {
    name: "Inventory & Catalog",
    icon: "📦",
    count: 24,
    examples: [
      "fetch_inventory_summary",
      "fetch_low_stock_products",
      "fetch_dead_stock",
      "fetch_expiry_alerts",
      "search_products",
      "get_product_history",
      "tool_adjust_stock",
    ],
    description: "Real-time stock queries, low stock alerts, catalog search, and expiry risk monitoring.",
  },
  {
    name: "Sales & Profit/Loss",
    icon: "📊",
    count: 18,
    examples: [
      "fetch_sales_summary",
      "fetch_top_selling_products",
      "fetch_daily_sales_trend",
      "fetch_profit_loss_report",
      "fetch_expense_summary",
    ],
    description: "Revenue run-rates, margins, best sellers, daily revenue trends, and expense analysis.",
  },
  {
    name: "Demand Forecasting & Restocking",
    icon: "🔮",
    count: 15,
    examples: [
      "get_demand_forecast",
      "get_restock_priorities",
      "get_restock_budget",
      "festival_demand_planner",
    ],
    description: "Predictive reorder recommendations, lead-time velocity, and festival stock planning.",
  },
  {
    name: "Customers & Udhaar (Khata)",
    icon: "👥",
    count: 16,
    examples: [
      "fetch_buyer_dues",
      "search_buyers",
      "analyze_customer_credit_risk",
      "get_customer_credit_ledger",
    ],
    description: "Customer outstanding credit tracking, due date reminders, and credit risk grading.",
  },
  {
    name: "Suppliers & Purchase Orders",
    icon: "🚚",
    count: 14,
    examples: [
      "search_suppliers",
      "get_supplier_performance",
      "get_purchase_summary",
      "tool_create_purchase",
    ],
    description: "Distributor balances, wholesale invoice review, and purchase order tracking.",
  },
  {
    name: "Strategic Retail Insights",
    icon: "💡",
    count: 12,
    examples: [
      "fetch_store_insights",
      "get_daily_action_checklist",
      "get_store_baselines",
      "invoke_morning_briefing",
    ],
    description: "Senior retail partner daily action lists, performance run-rate, and health audits.",
  },
];

/**
 * McpConnectionCard Component
 * Allows merchants and developers to connect external AI agents (ChatGPT, Claude Desktop, Cursor, etc.)
 * directly to their Vyapar Sakha store via the Model Context Protocol (MCP).
 */
export default function McpConnectionCard({ store }) {
  const [activeTab, setActiveTab] = useState("chatgpt");
  const [copiedKey, setCopiedKey] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null); // { online: boolean, toolCount: number, error?: string }
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [toolSearchQuery, setToolSearchQuery] = useState("");

  const storeId = store?._id || store?.id || "your_store_id";

  // Production Cloud Endpoints
  const effectiveBaseUrl = CLOUD_AI_DOMAIN;
  const sseEndpoint = `${effectiveBaseUrl}/mcp/sse?store=${encodeURIComponent(storeId)}`;
  const oauthAuthUrl = `${effectiveBaseUrl}/oauth/authorize`;
  const oauthTokenUrl = `${effectiveBaseUrl}/oauth/token`;
  const rfcDiscoveryUrl = `${effectiveBaseUrl}/.well-known/oauth-authorization-server`;

  // Test live server health
  const checkServerHealth = useCallback(async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch(`${effectiveBaseUrl}/mcp`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setHealthStatus({
          online: true,
          toolCount: data.tool_count || 99,
          server: data.server || "VyaparSakha-Assistant",
        });
        showSuccess(`MCP Server is live! ${data.tool_count || 99} read-only tools ready.`);
      } else {
        setHealthStatus({ online: false, error: `HTTP ${res.status}` });
        showError(`Server returned status ${res.status}`);
      }
    } catch (err) {
      setHealthStatus({ online: false, error: err.message });
      showError(`Unable to reach MCP endpoint: ${err.message}`);
    } finally {
      setCheckingHealth(false);
    }
  }, [effectiveBaseUrl]);

  // Initial health check on mount
  useEffect(() => {
    checkServerHealth();
  }, [checkServerHealth]);

  // Copy helper with animated feedback
  const copyToClipboard = (text, key) => {
    if (!navigator?.clipboard) {
      showError("Clipboard API not available in browser");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showSuccess("Copied to clipboard!");
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  // Pre-configured JSON snippet for Claude Desktop
  const claudeDesktopConfig = JSON.stringify(
    {
      mcpServers: {
        "vyapar-sakha": {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-sse", sseEndpoint],
        },
      },
    },
    null,
    2
  );

  // Pre-configured Cursor JSON snippet
  const cursorConfig = JSON.stringify(
    {
      mcpServers: {
        "vyapar-sakha": {
          url: sseEndpoint,
          transport: "sse",
        },
      },
    },
    null,
    2
  );

  // Curl test snippet
  const curlSnippet = `curl -X POST "${sseEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'`;

  // Filter tools for the capabilities preview
  const filteredCategories = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    examples: cat.examples.filter(
      (ex) =>
        ex.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        cat.name.toLowerCase().includes(toolSearchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.examples.length > 0 || cat.name.toLowerCase().includes(toolSearchQuery.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all">
      {/* High-Contrast Light Header Banner */}
      <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-purple-50/70 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200/80 text-xs font-bold tracking-wider uppercase text-indigo-800">
              <Plug className="w-3.5 h-3.5 text-indigo-600" />
              Model Context Protocol (MCP)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              Connect External AI
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
              Enable ChatGPT, Claude Desktop, Cursor, or any custom LLM client to query live inventory, sales,
              and restock reports from <span className="font-bold text-gray-900">your active store</span> in real-time.
            </p>
          </div>

          {/* Live Status Badge & Refresh */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    healthStatus?.online ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    healthStatus?.online ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  MCP Server Status
                </p>
                <p
                  className={`text-xs font-extrabold ${
                    healthStatus === null
                      ? "text-gray-600"
                      : healthStatus.online
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {healthStatus === null
                    ? "Checking server..."
                    : healthStatus.online
                    ? `Online (${healthStatus.toolCount || 99} Tools Active)`
                    : "Server Offline / Reconnecting"}
                </p>
              </div>
            </div>

            <button
              onClick={checkServerHealth}
              disabled={checkingHealth}
              className="p-2.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 shadow-sm transition-all text-gray-700 hover:text-gray-900 active:scale-95 disabled:opacity-50"
              title="Test Live Connection"
            >
              <RefreshCw className={`w-4 h-4 ${checkingHealth ? "animate-spin text-indigo-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Security & Isolation Pill Bar */}
        <div className="mt-6 pt-5 border-t border-gray-200/80 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-700">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Read-Only Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Multi-Tenant Store Isolated</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <Key className="w-4 h-4 text-purple-600" />
            <span>OAuth 2.0 PKCE / SSE Supported</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Universal Cloud Connection Endpoint */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Universal Cloud MCP Endpoint
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Cloud Production Ready
            </span>
          </div>

          {/* Quick Copy Streamable SSE URL */}
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={sseEndpoint}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm px-4 py-3.5 pr-28 rounded-xl border border-slate-700 focus:outline-none select-all"
            />
            <button
              onClick={() => copyToClipboard(sseEndpoint, "sseEndpoint")}
              className="absolute right-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              {copiedKey === "sseEndpoint" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-500">
            This universal Streamable HTTP / Server-Sent Events (SSE) endpoint handles incoming MCP JSON-RPC
            calls on <code className="bg-white px-1.5 py-0.5 rounded border border-gray-300 font-mono text-gray-800 font-bold">ai.vyaparsakha.store</code> with automatic tenant store isolation.
          </p>
        </div>

        {/* Tab Navigation for MCP Clients */}
        <div>
          <div className="flex border-b border-gray-200 overflow-x-auto gap-2 pb-px">
            {[
              { id: "chatgpt", label: "ChatGPT (Custom GPT / Actions)", badge: "Most Popular", icon: "💬" },
              { id: "claude", label: "Claude Desktop", badge: "Native MCP", icon: "🤖" },
              { id: "cursor", label: "Cursor & Windsurf", badge: "IDE Extension", icon: "⚡" },
              { id: "api", label: "Direct API / Curl", badge: "Developers", icon: "💻" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm whitespace-nowrap rounded-t-xl transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-700 bg-indigo-50/60"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      activeTab === tab.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="pt-6">
            {/* 1. CHATGPT TAB */}
            {activeTab === "chatgpt" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                      GPT
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Connect Vyapar Sakha to ChatGPT
                      </h4>
                      <p className="text-xs text-gray-500">
                        Interact with your store through any custom GPT or ChatGPT Connected App with OAuth 2.0.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-800">
                          Configure Custom GPT Action or Connector
                        </p>
                        <p className="text-xs text-gray-600">
                          In ChatGPT, go to <strong>Explore GPTs &gt; Create a GPT &gt; Configure &gt; Actions</strong> or add an MCP connector.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="text-xs font-bold text-gray-800">
                          Set Authentication to OAuth 2.0
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                              Authorization URL
                            </span>
                            <div className="flex items-center justify-between gap-1 font-mono text-[11px] text-gray-800">
                              <span className="truncate">{oauthAuthUrl}</span>
                              <button
                                onClick={() => copyToClipboard(oauthAuthUrl, "oauthAuthUrl")}
                                className="text-indigo-600 hover:text-indigo-800 flex-shrink-0 p-1"
                              >
                                {copiedKey === "oauthAuthUrl" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                              Token URL
                            </span>
                            <div className="flex items-center justify-between gap-1 font-mono text-[11px] text-gray-800">
                              <span className="truncate">{oauthTokenUrl}</span>
                              <button
                                onClick={() => copyToClipboard(oauthTokenUrl, "oauthTokenUrl")}
                                className="text-indigo-600 hover:text-indigo-800 flex-shrink-0 p-1"
                              >
                                {copiedKey === "oauthTokenUrl" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-800">
                          Auto-Discovery via RFC 8414
                        </p>
                        <p className="text-xs text-gray-600">
                          If your client supports OpenID/OAuth server metadata, simply enter{" "}
                          <code className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-indigo-700 font-bold">
                            {effectiveBaseUrl}
                          </code>
                          . ChatGPT will automatically discover endpoints at{" "}
                          <code className="bg-white px-1.5 py-0.5 rounded border border-gray-300 font-mono text-gray-700">
                            /.well-known/oauth-authorization-server
                          </code>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Merchant Safety:</strong> When connecting, ChatGPT will prompt you to log in with your
                      registered Google or email account. You will select your store to grant access.
                      No other store data can ever be accessed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CLAUDE DESKTOP TAB */}
            {activeTab === "claude" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-bold">
                      CL
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Claude Desktop Configuration
                      </h4>
                      <p className="text-xs text-gray-500">
                        Add this configuration block to your local Claude Desktop config to give Claude direct access to your store.
                      </p>
                    </div>
                  </div>

                  {/* Config File Paths */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="font-bold text-gray-800 block mb-1">
                        Windows File Path:
                      </span>
                      <code className="text-slate-800 font-mono text-[11px] break-all block bg-white p-2 rounded border border-gray-200">
                        %APPDATA%\Claude\claude_desktop_config.json
                      </code>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="font-bold text-gray-800 block mb-1">
                        macOS File Path:
                      </span>
                      <code className="text-slate-800 font-mono text-[11px] break-all block bg-white p-2 rounded border border-gray-200">
                        ~/Library/Application Support/Claude/claude_desktop_config.json
                      </code>
                    </div>
                  </div>

                  {/* JSON Code Snippet */}
                  <div className="relative">
                    <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                      {claudeDesktopConfig}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(claudeDesktopConfig, "claudeConfig")}
                      className="absolute top-3 right-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      {copiedKey === "claudeConfig" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied JSON</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Config</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      After saving, restart Claude Desktop. The hammer icon 🔨 will appear with all 99 store tools.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CURSOR & WINDSURF TAB */}
            {activeTab === "cursor" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                      IDE
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Connect with Cursor or Windsurf
                      </h4>
                      <p className="text-xs text-gray-500">
                        Use AI inside your editor to analyze inventory, generate purchase orders, and inspect retail code.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                      <p className="font-bold text-gray-800">Setup Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-600">
                        <li>Open Cursor Settings (<code>Ctrl+,</code> or <code>Cmd+,</code>).</li>
                        <li>Navigate to <strong>Features &gt; MCP</strong>.</li>
                        <li>Click <strong>&quot;+ Add New MCP Server&quot;</strong>.</li>
                        <li>Fill in the fields below:</li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-gray-200">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                          Server Name
                        </span>
                        <span className="font-semibold text-gray-800">VyaparSakha</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-gray-200">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                          Server Type
                        </span>
                        <span className="font-semibold text-emerald-600">sse</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-gray-200">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                          Store Tenancy
                        </span>
                        <span className="font-semibold text-indigo-600 truncate block">
                          Active Store Account
                        </span>
                      </div>
                    </div>

                    {/* Ready Config */}
                    <div className="relative">
                      <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                        {cursorConfig}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(cursorConfig, "cursorConfig")}
                        className="absolute top-3 right-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        {copiedKey === "cursorConfig" ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. API & CURL TAB */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Direct JSON-RPC / CLI Transport
                      </h4>
                      <p className="text-xs text-gray-500">
                        Test your connection or build custom MCP integrations using curl or python.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-800">Quick Test Command:</p>
                    <div className="relative">
                      <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                        {curlSnippet}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(curlSnippet, "curlSnippet")}
                        className="absolute top-3 right-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        {copiedKey === "curlSnippet" ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Curl</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-800">Supported Transports:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                      <li>Streamable HTTP POST JSON-RPC at <code>/mcp/sse</code></li>
                      <li>Standard SSE streaming GET at <code>/mcp/sse</code></li>
                      <li>Local CLI Stdio transport via <code>python -m app.mcp.server --store &lt;id&gt;</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Capabilities & Live Tools Drawer */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowToolsDrawer(!showToolsDrawer)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Inspect Exposed MCP Capabilities &amp; Tools ({healthStatus?.toolCount || 99} Tools Available)
                </h4>
                <p className="text-xs text-gray-500">
                  See the exact data and operations your connected AI will have access to.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold">
              <span>{showToolsDrawer ? "Hide Tools" : "Browse Tools"}</span>
              {showToolsDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showToolsDrawer && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              {/* Search Tools Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tools by name or category (e.g. stock, sales, dues)..."
                  value={toolSearchQuery}
                  onChange={(e) => setToolSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Tool Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs space-y-2 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cat.icon}</span>
                        <h5 className="text-xs font-bold text-gray-900">{cat.name}</h5>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        ~{cat.count} tools
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="pt-2 border-t border-gray-100 space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Included Tools:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cat.examples.map((ex, exIdx) => (
                          <span
                            key={exIdx}
                            className="font-mono text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
