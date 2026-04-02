import React from 'react';

export default function InsightPanel({ creator }) {
  if (!creator) {
    return (
      <aside className="bg-white/80 rounded-3xl border border-purple-100 p-6 shadow-lg shadow-purple-100/50">
        <p className="text-sm text-slate-500">Select a creator to view AI insights.</p>
      </aside>
    );
  }

  return (
    <aside className="bg-white/90 rounded-3xl border border-purple-100 p-6 shadow-lg shadow-purple-100/50">
      <div className="flex items-center gap-3 mb-4">
        <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-2xl" />
        <div>
          <p className="text-xs text-slate-400">Insights Overview</p>
          <h3 className="text-lg font-semibold text-slate-800">{creator.name}</h3>
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <InsightBadge label="Trust" value={`${creator.authenticityScore}%`} color="text-emerald-500" />
        <InsightBadge label="Primary Niche" value={creator.niche} />
        <InsightBadge label="Talking Points" value={creator.insights} />
      </div>

      <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-2xl text-sm font-semibold">
        View Full Report
      </button>
    </aside>
  );
}

function InsightBadge({ label, value, color = 'text-slate-600' }) {
  return (
    <div className="bg-purple-50 rounded-2xl px-4 py-3">
      <p className="text-xs text-slate-400 uppercase">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}

