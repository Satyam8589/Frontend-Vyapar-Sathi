"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import {
  Bot,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ChevronDown,
  Settings,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";


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
      {/* HEADER */}

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
        <span className="font-mono text-xs text-slate-400">
          {language}
        </span>

        <CopyButton text={code} />
      </div>


      {/* CODE */}

      <pre
        className="
          overflow-x-auto
          p-4
          text-sm
          leading-relaxed
          text-slate-100
        "
      >
        <code className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
}


/* =========================================================
   MARKDOWN RENDERER
========================================================= */

function MarkdownRenderer({
  content,
  className = "",
}) {

  return (
    <div className={className}>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [
            rehypeHighlight,
            {
              ignoreMissing: true,
            },
          ],
        ]}

        components={{

          /* =============================================
             HEADINGS
          ============================================= */

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
            <h2
              className="
                mt-5
                mb-3
                text-xl
                font-bold
                text-slate-800
              "
            >
              {children}
            </h2>
          ),


          h3: ({ children }) => (
            <h3
              className="
                mt-4
                mb-2
                text-lg
                font-semibold
                text-slate-800
              "
            >
              {children}
            </h3>
          ),


          h4: ({ children }) => (
            <h4
              className="
                mt-3
                mb-2
                text-base
                font-semibold
                text-slate-700
              "
            >
              {children}
            </h4>
          ),


          /* =============================================
             PARAGRAPH
          ============================================= */

          p: ({ children }) => (
            <p
              className="
                mb-3
                leading-7
                text-slate-700
              "
            >
              {children}
            </p>
          ),


          /* =============================================
             LISTS
          ============================================= */

          ul: ({ children }) => (
            <ul
              className="
                mb-4
                ml-5
                list-disc
                space-y-1.5
                text-slate-700
              "
            >
              {children}
            </ul>
          ),


          ol: ({ children }) => (
            <ol
              className="
                mb-4
                ml-5
                list-decimal
                space-y-1.5
                text-slate-700
              "
            >
              {children}
            </ol>
          ),


          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),


          /* =============================================
             BLOCKQUOTE
          ============================================= */

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


          /* =============================================
             INLINE CODE + CODE BLOCK
          ============================================= */

          code: ({
            children,
            className,
          }) => {

            const isBlock =
              typeof className === "string" &&
              className.includes("language-");


            /* INLINE CODE */

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


            /*
              IMPORTANT:

              We return only code.

              The pre component below
              handles the code block container.
            */

            return (
              <code className={className}>
                {children}
              </code>
            );
          },


          /* =============================================
             PRE / CODE BLOCK
          ============================================= */

          pre: ({ children }) => {

            const child =
              Array.isArray(children)
                ? children[0]
                : children;


            if (
              child &&
              typeof child === "object" &&
              child.props
            ) {

              return (
                <CodeBlock
                  className={child.props.className}
                >
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


          /* =============================================
             TABLE
          ============================================= */

          table: ({ children }) => (
            <div
              className="
                my-4
                overflow-x-auto
                rounded-lg
                border
                border-slate-200
              "
            >
              <table
                className="
                  w-full
                  border-collapse
                  text-sm
                "
              >
                {children}
              </table>
            </div>
          ),


          thead: ({ children }) => (
            <thead
              className="
                border-b
                border-slate-200
                bg-slate-100
              "
            >
              {children}
            </thead>
          ),


          tbody: ({ children }) => (
            <tbody
              className="
                divide-y
                divide-slate-100
              "
            >
              {children}
            </tbody>
          ),


          tr: ({ children }) => (
            <tr
              className="
                transition
                hover:bg-slate-50
              "
            >
              {children}
            </tr>
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
            <td
              className="
                border-r
                border-slate-100
                px-4
                py-3
                text-slate-700
              "
            >
              {children}
            </td>
          ),


          /* =============================================
             HORIZONTAL RULE
          ============================================= */

          hr: () => (
            <hr
              className="
                my-6
                border-slate-200
              "
            />
          ),


          /* =============================================
             LINKS
          ============================================= */

          a: ({
            children,
            href,
          }) => (
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


          /* =============================================
             BOLD
          ============================================= */

          strong: ({ children }) => (
            <strong
              className="
                font-bold
                text-slate-900
              "
            >
              {children}
            </strong>
          ),


          /* =============================================
             ITALIC
          ============================================= */

          em: ({ children }) => (
            <em
              className="
                italic
                text-slate-700
              "
            >
              {children}
            </em>
          ),


          /* =============================================
             STRIKETHROUGH
          ============================================= */

          del: ({ children }) => (
            <del
              className="
                text-slate-500
                line-through
              "
            >
              {children}
            </del>
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

   THIS IS A NAMED EXPORT

   Your AskCopilotSection imports:

   import {
     ChatMessage,
     ThinkingIndicator
   } from "../ChatMessage";
========================================================= */

export function ThinkingIndicator() {

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        shadow-sm
      "
    >

      <div className="relative">

        <Loader2
          className="
            h-4
            w-4
            animate-spin
            text-slate-600
          "
        />

      </div>


      <div className="flex items-center gap-1">

        <span
          className="
            h-1.5
            w-1.5
            animate-bounce
            rounded-full
            bg-slate-400
          "
        />

        <span
          className="
            h-1.5
            w-1.5
            animate-bounce
            rounded-full
            bg-slate-400
            [animation-delay:150ms]
          "
        />

        <span
          className="
            h-1.5
            w-1.5
            animate-bounce
            rounded-full
            bg-slate-400
            [animation-delay:300ms]
          "
        />

      </div>


      <span
        className="
          text-sm
          text-slate-500
        "
      >
        Vyapar Sathi is thinking...
      </span>

    </div>
  );
}


/* =========================================================
   TOOL CALL CARD

   Optional component for displaying AI tool calls.
========================================================= */

export function ToolCallCard({
  name,
  args,
  result,
  status = "completed",
}) {

  const [isExpanded, setIsExpanded] =
    useState(false);


  const StatusIcon =
    status === "running"
      ? Loader2
      : status === "error"
        CheckCircle2;


  const statusColors = {

    running: "text-blue-500",

    completed: "text-emerald-500",

    error: "text-rose-500",

  };


  return (

    <details

      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-slate-50
      "

      onToggle={(event) => {
        setIsExpanded(
          event.currentTarget.open
        );
      }}

    >

      <summary

        className="
          flex
          cursor-pointer
          list-none
          items-center
          gap-3
          p-4
        "

      >

        <div
          className="
            flex
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            p-2
          "
        >

          <Settings
            className="
              h-4
              w-4
              text-slate-500
            "
          />

        </div>


        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <code
              className="
                truncate
                font-mono
                text-sm
                font-medium
                text-slate-700
              "
            >
              {name}
            </code>


            <StatusIcon

              className={`
                h-4
                w-4
                ${statusColors[status]}

                ${
                  status === "running"
                    ? "animate-spin"
                    : ""
                }
              `}

            />

          </div>


          {args && (

            <p
              className="
                mt-1
                truncate
                text-xs
                text-slate-500
              "
            >
              {JSON.stringify(args)}
            </p>

          )}

        </div>


        <ChevronDown

          className={`
            h-4
            w-4
            text-slate-400
            transition-transform

            ${
              isExpanded
                ? "rotate-180"
                : ""
            }
          `}

        />

      </summary>


      <div
        className="
          border-t
          border-slate-200
          bg-white
          p-4
        "
      >

        {args && (

          <div className="mb-4">

            <h4
              className="
                mb-2
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Arguments
            </h4>


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
              {JSON.stringify(
                args,
                null,
                2
              )}
            </pre>

          </div>

        )}


        {result !== undefined &&
          result !== null && (

            <div>

              <h4
                className="
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Result
              </h4>


              {typeof result === "string" ? (

                <MarkdownRenderer
                  content={result}
                />

              ) : (

                <pre
                  className="
                    overflow-x-auto
                    rounded-lg
                    bg-slate-50
                    p-3
                    text-xs
                    text-slate-700
                  "
                >
                  {JSON.stringify(
                    result,
                    null,
                    2
                  )}
                </pre>

              )}

            </div>

          )}

      </div>

    </details>

  );
}


/* =========================================================
   CHAT MESSAGE

   IMPORTANT:

   This is the export that your application
   currently cannot find.

   We explicitly export it.
========================================================= */

export function ChatMessage({
  message,
  isStreaming = false,
  onCopy,
  onRegenerate,
  onFeedback,
}) {

  const [feedback, setFeedback] =
    useState(null);


  const isUser =
    message.role === "user";


  const handleFeedback = (type) => {

    setFeedback(type);

    if (onFeedback) {
      onFeedback(
        message.id,
        type
      );
    }

  };


  const handleCopy = () => {

    if (onCopy) {
      onCopy(message.id);
      return;
    }


    if (message.text) {

      navigator.clipboard.writeText(
        message.text
      );

    }

  };


  return (

    <div
      className={`
        flex
        w-full
        gap-3

        ${
          isUser
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      {/* =============================================
          ASSISTANT AVATAR
      ============================================= */}

      {!isUser && (

        <div
          className="
            flex
            h-9
            w-9
            flex-shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-900
            text-white
            shadow-sm
          "
        >

          <Bot className="h-5 w-5" />

        </div>

      )}


      {/* =============================================
          MESSAGE CONTENT
      ============================================= */}

      <div
        className={`
          min-w-0
          max-w-[85%]

          ${
            isUser
              ? "order-first"
              : ""
          }
        `}
      >


        {/* ===========================================
            MESSAGE BUBBLE
        ============================================ */}

        <div

          className={`
            rounded-2xl
            px-4
            py-3

            ${
              isUser
                ? `
                  rounded-tr-sm
                  bg-slate-900
                  text-white
                `
                : `
                  rounded-tl-sm
                  border
                  border-slate-200
                  bg-white
                  text-slate-800
                  shadow-sm
                `
            }
          `}

        >


          {/* USER MESSAGE */}

          {isUser ? (

            <p
              className="
                whitespace-pre-wrap
                break-words
                text-sm
                leading-7
              "
            >
              {message.text}
            </p>

          ) : (

            <>
              {/* AI MESSAGE */}

              {message.text ? (

                <MarkdownRenderer
                  content={message.text}
                  className="
                    break-words
                    text-sm
                  "
                />

              ) : isStreaming ? (

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    py-1
                    text-sm
                    text-slate-500
                  "
                >

                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                    "
                  />

                  Generating response...

                </div>

              ) : null}


              {/* ERROR */}

              {message.error && (

                <div
                  className="
                    mt-3
                    rounded-lg
                    border
                    border-rose-200
                    bg-rose-50
                    px-3
                    py-2
                    text-sm
                    text-rose-600
                  "
                >
                  {message.error}
                </div>

              )}


              {/* TOOL CALLS */}

              {message.meta?.tool_calls &&
                Array.isArray(
                  message.meta.tool_calls
                ) && (

                  <div className="mt-4 space-y-3">

                    {message.meta.tool_calls.map(
                      (toolCall, index) => (

                        <ToolCallCard

                          key={
                            toolCall.id ||
                            `${toolCall.name}-${index}`
                          }

                          name={
                            toolCall.name ||
                            "Unknown Tool"
                          }

                          args={
                            toolCall.args ||
                            toolCall.arguments
                          }

                          result={
                            toolCall.result
                          }

                          status={
                            toolCall.status ||
                            "completed"
                          }

                        />

                      )
                    )}

                  </div>

                )}

            </>

          )}

        </div>


        {/* ===========================================
            ACTION BUTTONS
        ============================================ */}

        {!isUser && !isStreaming && message.text && (

          <div
            className="
              mt-2
              flex
              items-center
              gap-1
              px-1
            "
          >

            {/* COPY */}

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


            {/* REGENERATE */}

            {onRegenerate && (

              <button

                type="button"

                onClick={() =>
                  onRegenerate(message.id)
                }

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


            {/* LIKE */}

            <button

              type="button"

              onClick={() =>
                handleFeedback("like")
              }

              className={`
                rounded-lg
                p-1.5
                transition

                ${
                  feedback === "like"
                    ? `
                      bg-emerald-50
                      text-emerald-600
                    `
                    : `
                      text-slate-400
                      hover:bg-slate-100
                      hover:text-slate-700
                    `
                }
              `}

              title="Good response"

            >

              <ThumbsUp className="h-3.5 w-3.5" />

            </button>


            {/* DISLIKE */}

            <button

              type="button"

              onClick={() =>
                handleFeedback("dislike")
              }

              className={`
                rounded-lg
                p-1.5
                transition

                ${
                  feedback === "dislike"
                    ? `
                      bg-rose-50
                      text-rose-600
                    `
                    : `
                      text-slate-400
                      hover:bg-slate-100
                      hover:text-slate-700
                    `
                }
              `}

              title="Bad response"

            >

              <ThumbsDown className="h-3.5 w-3.5" />

            </button>


            {/* STREAM STATUS */}

            {isStreaming && (

              <span
                className="
                  ml-2
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-slate-400
                "
              >

                <Loader2
                  className="
                    h-3
                    w-3
                    animate-spin
                  "
                />

                Generating

              </span>

            )}

          </div>

        )}


        {/* ===========================================
            TIMESTAMP
        ============================================ */}

        {message.timestamp && (

          <p
            className={`
              mt-1.5
              text-xs
              text-slate-400

              ${
                isUser
                  ? "text-right"
                  : "text-left"
              }
            `}
          >

            {formatTimestamp(
              message.timestamp
            )}

          </p>

        )}

      </div>


      {/* =============================================
          USER AVATAR
      ============================================= */}

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

    const date =
      new Date(timestamp);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }


    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  } catch {

    return "";

  }

}


/* =========================================================
   DEFAULT EXPORT

   Optional.

   This allows:

   import ChatMessage from "../ChatMessage";

   while named exports allow:

   import {
     ChatMessage,
     ThinkingIndicator
   } from "../ChatMessage";
========================================================= */

export default ChatMessage; 