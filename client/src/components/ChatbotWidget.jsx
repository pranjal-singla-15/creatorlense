import React, { useState } from "react";

export default function ChatbotWidget({ sessionId, apiBaseUrl = "http://localhost:8000" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me about creator insights or comparisons." },
  ]);

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);

    if (!sessionId) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Start an analysis first, then ask a question." },
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Chat service error (${response.status})`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data?.response || "I could not find an answer." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: error?.message || "Unable to reach the chat service." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-purple-100">Creator Copilot</p>
              <p className="text-sm font-semibold">Ask anything</p>
            </div>
            <button
              type="button"
              className="rounded-full bg-white/20 px-3 py-1 text-xs"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="max-h-64 space-y-3 overflow-y-auto px-4 py-3 text-sm text-slate-700">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-3 py-2 ${
                  message.role === "user"
                    ? "bg-purple-100 text-slate-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-500">Thinking...</div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-purple-100 px-3 py-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about engagement, ROI, or comparisons..."
              className="flex-1 rounded-2xl border border-purple-100 px-3 py-2 text-sm text-slate-700 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
        aria-label="Open creator chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 8h10M7 12h6m-5 8l-4 1 1-4A9 9 0 1 1 19 19l-4 1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
