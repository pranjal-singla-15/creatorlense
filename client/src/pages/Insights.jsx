import React from "react";
import InsightPanel from "../components/InsightPanel.jsx";
import ChatbotWidget from "../components/ChatbotWidget.jsx";

export default function Insights({ creator, status, error, onBack, query, sessionId }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-purple-100 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-400">Insights</p>
            <h1 className="text-2xl font-semibold text-slate-800">Creator analysis</h1>
            {query && <p className="mt-1 text-sm text-slate-500">Search: {query}</p>}
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-600"
          >
            Back to dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid min-h-[calc(100vh-120px)] gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="flex max-h-[calc(100vh-120px)] rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-lg shadow-purple-100/50">
            <ChatbotWidget sessionId={sessionId} variant="embedded" />
          </section>

          <InsightPanel creator={creator} status={status} error={error} />
        </div>
      </main>
    </div>
  );
}
