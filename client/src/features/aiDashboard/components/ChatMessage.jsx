"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import {
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ChevronDown,
  Wrench,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

/* =========================================================
   STREAM NORMALIZATION UTILS

   The backend emits `event: token` where `data.text` is
   EITHER a plain string OR an array of LangChain content
   blocks:

     {"text": [{"type": "text", "text": "...", "extras": {...}}]}

   Concatenating that array straight onto a string is what
   produced "[object Object]" in the transcript.

   `extractTokenText` flattens any of those shapes into a
   string. Export it and use it in your SSE handler too, so
   the accumulator never stores a non-string.

     const chunk = extractTokenText(JSON.parse(evt.data).text);
     setText((prev) => prev + chunk);
========================================================= */

export function extractTokenText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(extractTokenText).join("");
  }

  if (typeof value === "object") {
    /*
      Content blocks. We only surface `text` blocks — thinking
      blocks, signatures and tool_use blocks are internal and
      must never leak into the visible answer.
    */
    if (value.type && value.type !== "text") {
      return "";
    }

    if (typeof value.text === "string") {
      return value.text;
    }

    return "";
  }

  return String(value);
}

/*
  Defensive cleanup for text that was already corrupted by an
  older accumulator before this fix shipped.
*/
function sanitizeText(value) {
  return extractTokenText(value).replace(/\[object Object\]\s?/g, "");
}

/* =========================================================
   AGENT STATUS LINES

   The backend injects progress markers into the token stream:

     "\n_[Loading long-term memory...]_\n"
     "\n_[Memory loaded.]_\n"

   These are status, not answer. We pull them out of the
   markdown body and render them in the trace strip instead,
   so the answer reads cleanly.
========================================================= */

const STATUS_LINE = /^\s*_\[(.+?)\]_\s*$/;

function splitStatusLines(text) {
  const steps = [];
  const body = [];

  for (const line of String(text).split("\n")) {
    const match = line.match(STATUS_LINE);

    if (match) {
      const label = match[1].trim();

      if (!steps.includes(label)) {
        steps.push(label);
      }

      continue;
    }

    body.push(line);
  }

  return {
    steps,
    content: body.join("\n").replace(/^\n+/, ""),
  };
}

/* =========================================================
   TOOL CALL MERGING

   The backend emits TWO events per tool:

     on_tool_start -> { id: "tool-get_restock_priorities-0", args,   status: "running"   }
     on_tool_end   -> { id: "tool-get_restock_priorities-1", result, status: "completed" }

   The ids differ (they're derived from a set length), which
   is why your UI rendered the same tool twice — once stuck
   on "running". We merge on the id with its trailing counter
   stripped, falling back to the tool name.
========================================================= */

export function mergeToolCalls(calls) {
  if (!Array.isArray(calls)) {
    return [];
  }

  const byKey = new Map();

  for (const call of calls) {
    if (!call) {
      continue;
    }

    const key =
      String(call.id || "").replace(/-\d+$/, "") || call.name || "tool";

    const previous = byKey.get(key);

    if (!previous) {
      byKey.set(key, { ...call, key });
      continue;
    }

    /*
      A later event wins for the fields it carries, but must
      never erase args captured at start or a result captured
      at end.
    */
    byKey.set(key, {
      ...previous,
      ...call,
      key,
      args: call.args ?? call.arguments ?? previous.args ?? previous.arguments,
      result: call.result ?? previous.result,
      status: resolveStatus(previous.status, call.status),
    });
  }

  return Array.from(byKey.values());
}

function resolveStatus(previous, next) {
  if (previous === "error" || next === "error") {
    return "error";
  }

  if (previous === "completed" || next === "completed") {
    return "completed";
  }

  return next || previous || "running";
}

/* =========================================================
   VALUE FORMATTING HELPERS
========================================================= */

function formatKey(key) {
  return String(key)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toLocaleString() : value.toString();
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

const BADGE_TONES = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ok: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  critical: "bg-rose-50 text-rose-700 ring-rose-200",
};

function ValueCell({ value }) {
  if (typeof value === "string") {
    const tone = BADGE_TONES[value.toLowerCase()];

    if (tone) {
      return (
        <span
          className={`
            inline-flex
            items-center
            rounded-full
            px-2
            py-0.5
            text-xs
            font-medium
            ring-1
            ring-inset
            ${tone}
          `}
        >
          {value}
        </span>
      );
    }
  }

  if (value && typeof value === "object") {
    return (
      <span className="font-mono text-xs text-slate-500">
        {JSON.stringify(value)}
      </span>
    );
  }

  return <span>{formatValue(value)}</span>;
}

function isTabular(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (row) => row && typeof row === "object" && !Array.isArray(row),
    )
  );
}

/* =========================================================
   TOOL RESULT VIEW

   Tool results are structured data, not prose. Rendering
   them as a raw JSON blob makes the user do the parsing.
   We pick a shape:

     array of objects -> table
     flat object      -> key / value grid
     nested object    -> grid for scalars, sections for the rest
     string           -> markdown (or table if it parses to one)
========================================================= */

const MAX_ROWS = 25;

function ResultTable({ rows }) {
  const columns = useMemo(() => {
    const seen = [];

    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (!seen.includes(key)) {
          seen.push(key);
        }
      }
    }

    return seen;
  }, [rows]);

  const visibleRows = rows.slice(0, MAX_ROWS);

  return (
    <div
      className="
        overflow-hidden
        rounded-lg
        border
        border-slate-200
      "
    >
      <div className="max-h-80 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="
                    whitespace-nowrap
                    border-b
                    border-slate-200
                    px-3
                    py-2
                    text-left
                    font-semibold
                    text-slate-600
                  "
                >
                  {formatKey(column)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {visibleRows.map((row, index) => (
              <tr key={index} className="transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td
                    key={column}
                    className="
                      whitespace-nowrap
                      px-3
                      py-2
                      text-slate-700
                    "
                  >
                    <ValueCell value={row[column]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > visibleRows.length && (
        <p
          className="
            border-t
            border-slate-200
            bg-slate-50
            px-3
            py-2
            text-xs
            text-slate-500
          "
        >
          Showing {visibleRows.length} of {rows.length} rows
        </p>
      )}
    </div>
  );
}

function ScalarGrid({ entries }) {
  return (
    <dl
      className="
        grid
        grid-cols-1
        gap-x-6
        gap-y-2
        sm:grid-cols-2
      "
    >
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="
            flex
            items-baseline
            justify-between
            gap-3
            border-b
            border-slate-100
            pb-1.5
          "
        >
          <dt className="text-xs text-slate-500">{formatKey(key)}</dt>

          <dd className="text-xs font-medium text-slate-800">
            <ValueCell value={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ToolResultView({ result }) {
  const parsed = useMemo(() => {
    if (typeof result !== "string") {
      return result;
    }

    const trimmed = result.trim();

    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      return result;
    }

    try {
      return JSON.parse(trimmed);
    } catch {
      return result;
    }
  }, [result]);

  if (parsed === null || parsed === undefined || parsed === "") {
    return <p className="text-xs text-slate-500">No data returned.</p>;
  }

  if (typeof parsed === "string") {
    return <MarkdownRenderer content={parsed} className="text-sm" />;
  }

  if (isTabular(parsed)) {
    return <ResultTable rows={parsed} />;
  }

  if (Array.isArray(parsed)) {
    return (
      <ul className="space-y-1 text-xs text-slate-700">
        {parsed.map((item, index) => (
          <li key={index}>
            <ValueCell value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof parsed === "object") {
    const entries = Object.entries(parsed);

    const scalars = entries.filter(([, value]) => !value || typeof value !== "object");
    const complex = entries.filter(([, value]) => value && typeof value === "object");

    return (
      <div className="space-y-4">
        {scalars.length > 0 && <ScalarGrid entries={scalars} />}

        {complex.map(([key, value]) => (
          <div key={key} className="space-y-2">
            <h5 className="text-xs font-semibold text-slate-600">
              {formatKey(key)}
            </h5>

            {isTabular(value) ? (
              <ResultTable rows={value} />
            ) : (
              <pre
                className="
                  overflow-x-auto
                  rounded-lg
                  bg-slate-950
                  p-3
                  text-xs
                  text-slate-100
                "
              >
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-xs text-slate-700">{formatValue(parsed)}</p>;
}

/* =========================================================
   AI AVATAR

   Small animated brand mark used wherever the assistant
   needs to show up. Pure CSS/SVG, cheap to mount many
   times in a long thread, reduced-motion aware.
========================================================= */

export function AIAvatar({ streaming = false, size = 36 }) {
  return (
    <div
      aria-hidden="true"
      className={`ai-avatar ${streaming ? "ai-avatar--active" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} className="ai-avatar__svg">
        <defs>
          <linearGradient id="aiAvatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="url(#aiAvatarGradient)"
          strokeWidth="1.3"
          strokeDasharray="3.5 5"
          strokeLinecap="round"
          className="ai-avatar__ring"
        />

        <circle cx="20" cy="20" r="13" fill="url(#aiAvatarGradient)" />

        <path
          d="M20 12 L21.5 17.8 L27 19.5 L21.5 21.2 L20 27 L18.5 21.2 L13 19.5 L18.5 17.8 Z"
          fill="#fff"
          className="ai-avatar__spark"
        />

        <circle cx="20" cy="3.4" r="1.5" fill="#fff" className="ai-avatar__orbit" />
      </svg>

      <style jsx>{`
        .ai-avatar {
          position: relative;
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
        }

        .ai-avatar::before {
          content: "";
          position: absolute;
          inset: -22%;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.45),
            rgba(99, 102, 241, 0) 70%
          );
          animation: ai-avatar-pulse 2.8s ease-in-out infinite;
          z-index: 0;
        }

        .ai-avatar--active::before {
          animation-duration: 1.5s;
        }

        .ai-avatar__svg {
          position: relative;
          z-index: 1;
        }

        .ai-avatar__ring {
          transform-origin: 20px 20px;
          animation: ai-avatar-spin 9s linear infinite;
        }

        .ai-avatar__spark {
          transform-origin: 20px 20px;
          animation: ai-avatar-spark 2.4s ease-in-out infinite;
        }

        .ai-avatar__orbit {
          transform-origin: 20px 20px;
          opacity: 0;
        }

        .ai-avatar--active .ai-avatar__orbit {
          opacity: 1;
          animation: ai-avatar-orbit 1.4s linear infinite;
        }

        @keyframes ai-avatar-pulse {
          0%,
          100% {
            transform: scale(0.85);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.85;
          }
        }

        @keyframes ai-avatar-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ai-avatar-spark {
          0%,
          100% {
            transform: scale(0.9) rotate(0deg);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.08) rotate(10deg);
            opacity: 1;
          }
        }

        @keyframes ai-avatar-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-avatar::before,
          .ai-avatar__ring,
          .ai-avatar__spark,
          .ai-avatar__orbit {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   COPY BUTTON
========================================================= */

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="
        flex
        items-center
        gap-1.5
        rounded-md
        px-2
        py-1
        text-xs
        text-slate-400
        transition
        hover:bg-slate-800
        hover:text-white
      "
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

/* =========================================================
   CODE BLOCK
========================================================= */

function CodeBlock({ children, className }) {
  const code = String(children).replace(/\n$/, "");

  const language =
    className
      ?.split(" ")
      .find((item) => item.startsWith("language-"))
      ?.replace("language-", "") || "code";

  return (
    <div
      className="
        relative
        my-4
        overflow-hidden
        rounded-xl
        border
        border-slate-700
        bg-slate-950
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-800
          bg-slate-900
          px-4
          py-2
        "
      >
        <span className="font-mono text-xs text-slate-400">{language}</span>

        <CopyButton text={code} />
      </div>

      <pre
        className="
          overflow-x-auto
          p-4
          text-sm
          leading-relaxed
          text-slate-100
        "
      >
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

/* =========================================================
   MARKDOWN RENDERER
========================================================= */

function MarkdownRenderer({ content, className = "" }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          h1: ({ children }) => (
            <h1
              className="
                mt-6
                mb-4
                border-b
                border-slate-200
                pb-2
                text-2xl
                font-bold
                text-slate-900
              "
            >
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mt-5 mb-3 text-xl font-bold text-slate-800">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-lg font-semibold text-slate-800">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mt-3 mb-2 text-base font-semibold text-slate-700">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="mb-3 leading-7 text-slate-700">{children}</p>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-1.5 text-slate-700">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-slate-700">
              {children}
            </ol>
          ),

          li: ({ children }) => <li className="leading-7">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote
              className="
                my-4
                border-l-4
                border-slate-400
                bg-slate-50
                px-4
                py-3
                italic
                text-slate-600
              "
            >
              {children}
            </blockquote>
          ),

          code: ({ children, className }) => {
            const isBlock =
              typeof className === "string" && className.includes("language-");

            if (!isBlock) {
              return (
                <code
                  className="
                    rounded
                    bg-slate-100
                    px-1.5
                    py-0.5
                    font-mono
                    text-sm
                    text-rose-600
                  "
                >
                  {children}
                </code>
              );
            }

            return <code className={className}>{children}</code>;
          },

          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;

            if (child && typeof child === "object" && child.props) {
              return (
                <CodeBlock className={child.props.className}>
                  {child.props.children}
                </CodeBlock>
              );
            }

            return (
              <pre
                className="
                  my-4
                  overflow-x-auto
                  rounded-xl
                  bg-slate-950
                  p-4
                  text-slate-100
                "
              >
                {children}
              </pre>
            );
          },

          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="border-b border-slate-200 bg-slate-100">
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100">{children}</tbody>
          ),

          tr: ({ children }) => (
            <tr className="transition hover:bg-slate-50">{children}</tr>
          ),

          th: ({ children }) => (
            <th
              className="
                border-r
                border-slate-200
                px-4
                py-3
                text-left
                font-semibold
                text-slate-800
              "
            >
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-r border-slate-100 px-4 py-3 text-slate-700">
              {children}
            </td>
          ),

          hr: () => <hr className="my-6 border-slate-200" />,

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-1
                font-medium
                text-blue-600
                underline
                hover:text-blue-800
              "
            >
              {children}

              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),

          em: ({ children }) => (
            <em className="italic text-slate-700">{children}</em>
          ),

          del: ({ children }) => (
            <del className="text-slate-500 line-through">{children}</del>
          ),
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}

/* =========================================================
   THINKING INDICATOR
========================================================= */

export function ThinkingIndicator({ label = "Vyapar Sathi is thinking..." }) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        shadow-sm
      "
    >
      <AIAvatar streaming size={30} />

      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}

/* =========================================================
   TOOL CALL CARD
========================================================= */

const STATUS_META = {
  running: {
    Icon: Loader2,
    className: "text-blue-500 animate-spin",
    label: "Running",
  },
  completed: {
    Icon: CheckCircle2,
    className: "text-emerald-500",
    label: "Done",
  },
  error: {
    Icon: XCircle,
    className: "text-rose-500",
    label: "Failed",
  },
};

export function ToolCallCard({ name, args, result, status = "completed" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const meta = STATUS_META[status] || STATUS_META.completed;
  const StatusIcon = meta.Icon;

  const argEntries = args && typeof args === "object" ? Object.entries(args) : [];

  return (
    <details
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        transition
        hover:border-slate-300
      "
      onToggle={(event) => {
        setIsExpanded(event.currentTarget.open);
      }}
    >
      <summary
        className="
          flex
          cursor-pointer
          list-none
          items-center
          gap-3
          px-3
          py-2.5
        "
      >
        <span
          className="
            flex
            h-7
            w-7
            flex-shrink-0
            items-center
            justify-center
            rounded-lg
            bg-slate-100
            text-slate-500
          "
        >
          <Wrench className="h-3.5 w-3.5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <code className="truncate font-mono text-xs font-medium text-slate-700">
              {name}
            </code>

            <StatusIcon className={`h-3.5 w-3.5 flex-shrink-0 ${meta.className}`} />
          </span>

          {argEntries.length > 0 && (
            <span className="mt-1 flex flex-wrap gap-1">
              {argEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="
                    rounded
                    bg-slate-50
                    px-1.5
                    py-0.5
                    font-mono
                    text-[10px]
                    text-slate-500
                  "
                >
                  {key}: {formatValue(value)}
                </span>
              ))}
            </span>
          )}
        </span>

        <ChevronDown
          className={`
            h-4
            w-4
            flex-shrink-0
            text-slate-400
            transition-transform
            ${isExpanded ? "rotate-180" : ""}
          `}
        />
      </summary>

      <div className="border-t border-slate-200 bg-slate-50/60 p-3">
        {result !== undefined && result !== null ? (
          <ToolResultView result={result} />
        ) : (
          <p className="text-xs text-slate-500">
            {status === "running" ? "Waiting for the result…" : "No data returned."}
          </p>
        )}
      </div>
    </details>
  );
}

/* =========================================================
   AGENT TRACE

   The reasoning strip that sits ABOVE the answer: memory
   status chips and every tool the agent called. Collapsed
   by default once the answer has arrived, so the trace is
   available without competing with the response.
========================================================= */

function AgentTrace({ steps, toolCalls, isStreaming }) {
  const [isOpen, setIsOpen] = useState(false);

  const total = steps.length + toolCalls.length;

  if (total === 0) {
    return null;
  }

  const running = toolCalls.some((call) => call.status === "running");
  const expanded = isOpen || isStreaming;

  const summary = toolCalls.length
    ? `${toolCalls.length} ${toolCalls.length === 1 ? "tool" : "tools"} used`
    : "Context loaded";

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-slate-200
          bg-white
          px-3
          py-1
          text-xs
          font-medium
          text-slate-500
          transition
          hover:border-slate-300
          hover:text-slate-700
        "
      >
        {running ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
        ) : (
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
        )}

        {summary}

        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {steps.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {steps.map((step, index) => {
                const pending =
                  isStreaming && index === steps.length - 1 && step.endsWith("...");

                return (
                  <span
                    key={step}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-indigo-50
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium
                      text-indigo-600
                    "
                  >
                    {pending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    {step}
                  </span>
                );
              })}
            </div>
          )}

          {toolCalls.map((call, index) => (
            <ToolCallCard
              key={call.key || call.id || `${call.name}-${index}`}
              name={call.name || "Unknown tool"}
              args={call.args || call.arguments}
              result={call.result}
              status={call.status || "completed"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CHAT MESSAGE
========================================================= */

export function ChatMessage({
  message,
  isStreaming = false,
  onCopy,
  onRegenerate,
  onFeedback,
}) {
  const [feedback, setFeedback] = useState(null);

  const isUser = message.role === "user";

  /*
    Normalize once per render, not per child. This is where
    the "[object Object]" bug and the duplicated tool cards
    are both neutralized.
  */
  const { steps, content } = useMemo(
    () => splitStatusLines(sanitizeText(message.text)),
    [message.text],
  );

  const toolCalls = useMemo(
    () => mergeToolCalls(message.meta?.tool_calls),
    [message.meta?.tool_calls],
  );

  const handleFeedback = (type) => {
    setFeedback(type);

    if (onFeedback) {
      onFeedback(message.id, type);
    }
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.id);
      return;
    }

    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <div
      className={`
        flex
        w-full
        gap-3
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      {!isUser && <AIAvatar streaming={isStreaming} />}

      <div
        className={`
          min-w-0
          max-w-[85%]
          ${isUser ? "order-first" : ""}
        `}
      >
        {isUser ? (
          <div
            className="
              rounded-2xl
              rounded-tr-sm
              bg-slate-900
              px-4
              py-3
              text-white
            "
          >
            <p className="whitespace-pre-wrap break-words text-sm leading-7">
              {sanitizeText(message.text)}
            </p>
          </div>
        ) : (
          <div className="px-1">
            {/* REASONING TRACE — always above the answer */}

            <AgentTrace
              steps={steps}
              toolCalls={toolCalls}
              isStreaming={isStreaming}
            />

            {/* ANSWER */}

            {content ? (
              <MarkdownRenderer content={content} className="break-words text-sm" />
            ) : isStreaming ? (
              <div className="flex items-center gap-2 py-1 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating response...
              </div>
            ) : null}

            {/* ERROR */}

            {message.error && (
              <div
                className="
                  mt-3
                  flex
                  items-start
                  gap-2.5
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  px-3
                  py-2.5
                "
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-amber-800">
                    The response finished early
                  </p>

                  <p className="mt-0.5 break-words text-xs text-amber-700">
                    {sanitizeText(message.error)}
                  </p>

                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={() => onRegenerate(message.id)}
                      className="
                        mt-2
                        text-xs
                        font-medium
                        text-amber-800
                        underline
                        hover:text-amber-900
                      "
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}

        {!isUser && !isStreaming && content && (
          <div className="mt-2 flex items-center gap-1 px-1">
            <button
              type="button"
              onClick={handleCopy}
              className="
                rounded-lg
                p-1.5
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-700
              "
              title="Copy response"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={() => onRegenerate(message.id)}
                className="
                  rounded-lg
                  p-1.5
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
                title="Regenerate response"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleFeedback("like")}
              className={`
                rounded-lg
                p-1.5
                transition
                ${
                  feedback === "like"
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                }
              `}
              title="Good response"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleFeedback("dislike")}
              className={`
                rounded-lg
                p-1.5
                transition
                ${
                  feedback === "dislike"
                    ? "bg-rose-50 text-rose-600"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                }
              `}
              title="Bad response"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* TIMESTAMP */}

        {message.timestamp && (
          <p
            className={`
              mt-1.5
              text-xs
              text-slate-400
              ${isUser ? "text-right" : "text-left px-1"}
            `}
          >
            {formatTimestamp(message.timestamp)}
          </p>
        )}
      </div>

      {isUser && (
        <div
          className="
            flex
            h-9
            w-9
            flex-shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-600
          "
        >
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TIMESTAMP HELPER
========================================================= */

function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default ChatMessage;