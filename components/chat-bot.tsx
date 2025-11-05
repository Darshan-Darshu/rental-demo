"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState, useEffect, useRef } from "react";

function OnlineCustomerChatbot() {
  const { messages, sendMessage, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      // reuse the store-customer chat route for online customers
      api: "/api/chat",
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      // placeholder for dynamic tool handling if the assistant uses tools
      if (toolCall.dynamic) return;
    },
  });

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [mockProperties, setMockProperties] = useState<any[]>([]);

  useEffect(() => {
    try {
      const items = localStorage.getItem("items");
      setMockProperties(items ? JSON.parse(items) : []);
    } catch (e) {
      // If parsing fails or access is denied, fallback to empty array
      // and log the error for debugging.
      // eslint-disable-next-line no-console
      console.error("Failed to read/parse localStorage items:", e);
      setMockProperties([]);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(messages);

  return (
    <>
      {/* Floating chat toggle button for online customer */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((s) => !s)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: "#06b6d4",
          color: "white",
          border: "none",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Online customer chat"
          style={{
            position: "fixed",
            right: 20,
            bottom: 92,
            width: 800,
            maxWidth: "calc(100% - 40px)",
            height: 650,
            background: "white",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <strong>Online Assistant</strong>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat panel"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  {/* show label on left for AI, on right for user */}
                  {!isUser && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#666",
                        minWidth: 48,
                      }}
                    >
                      AI
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: 14,
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        background: isUser ? "#06b6d4" : "#f3f4f6",
                        color: isUser ? "white" : "#111827",
                        padding: 10,
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {message.parts.map((part: any, index) => {
                        // Most parts are text
                        if (
                          part.type === "text" &&
                          typeof part.text === "string"
                        ) {
                          return (
                            <div key={index} style={{ whiteSpace: "pre-wrap" }}>
                              {part.text}
                            </div>
                          );
                        }

                        if (part.type === "tool-inventoryProductTool") {
                          switch (part.state) {
                            case "input-available":
                              return <div key={index}>Loading...</div>;
                            case "output-available":
                              return (
                                <div key={index}>
                                  {/* <ProductSearch {...part.output} /> */}
                                </div>
                              );
                            case "output-error":
                              return (
                                <div key={index}>Error: {part.errorText}</div>
                              );
                            default:
                              return null;
                          }
                        }

                        return null;
                      })}
                    </div>
                  </div>

                  {/* show label on right for user */}
                  {isUser && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#666",
                        minWidth: 48,
                        textAlign: "right",
                      }}
                    >
                      You
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                // online customers don't have a storeid; send plain message
                sendMessage({ text: input }, { body: { mockProperties } });
                setInput("");
              }
            }}
            style={{
              padding: 12,
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
              placeholder="Ask the online assistant..."
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <button
              type="submit"
              disabled={status !== "ready"}
              style={{
                background: "#06b6d4",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: status === "ready" ? "pointer" : "not-allowed",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default OnlineCustomerChatbot;
