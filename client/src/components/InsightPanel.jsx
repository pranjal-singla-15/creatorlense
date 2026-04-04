import React from "react";

export default function InsightPanel({ creator, status, error }) {
  if (status === "loading") {
    return (
      <aside className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg shadow-purple-100/50">
        <p className="text-sm text-slate-500">Generating insights…</p>
      </aside>
    );
  }

  if (status === "error") {
    return (
      <aside className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg shadow-purple-100/50">
        <p className="text-sm text-rose-500">{error || "Unable to load insights."}</p>
      </aside>
    );
  }

  if (!creator) {
    return (
      <aside className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg shadow-purple-100/50">
        <p className="text-sm text-slate-500">Select a creator to view AI insights.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-lg shadow-purple-100/50">
      <div className="mb-4 flex items-center gap-3">
        <img src={creator.avatarUrl} alt={creator.name} className="h-12 w-12 rounded-2xl" />
        <div>
          <p className="text-xs text-slate-400">Insights Overview</p>
          <h3 className="text-lg font-semibold text-slate-800">{creator.name}</h3>
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        {creator.authenticityScore !== undefined && (
          <InsightBadge label="Trust" value={`${creator.authenticityScore}%`} color="text-emerald-500" />
        )}
        {creator.niche && <InsightBadge label="Primary Niche" value={creator.niche} />}
        {creator.insights && <InsightBadge label="Talking Points" value={creator.insights} />}
        {creator.aiSummary && <InsightBadge label="AI Summary" value={creator.aiSummary} />}
      </div>

      {(creator.decision || creator.flags?.length) && (
        <div className="mt-5 space-y-3 text-sm text-slate-600">
          {creator.decision && (
            <div className="rounded-2xl bg-purple-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-400">Decision</p>
              <div className="mt-2 grid gap-1">
                <KeyValue label="Trust" value={creator.decision.trustLevel} />
                <KeyValue label="Audience" value={creator.decision.audienceType} />
                <KeyValue label="Campaign" value={creator.decision.campaignFit} />
                <KeyValue label="ROI" value={creator.decision.roiLevel} />
                <KeyValue label="Confidence" value={creator.decision.confidence} />
              </div>
            </div>
          )}
          {creator.flags?.length > 0 && (
            <div className="rounded-2xl bg-purple-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-400">Flags</p>
              <p className="mt-2 text-sm font-semibold text-rose-500">{creator.flags.join(", ")}</p>
            </div>
          )}
        </div>
      )}

      {(creator.instagramMetrics || creator.youtubeMetrics) && (
        <div className="mt-5 space-y-3 text-sm text-slate-600">
          {creator.instagramMetrics && (
            <div className="rounded-2xl bg-purple-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-400">Instagram Metrics</p>
              <div className="mt-2 grid gap-1">
                <KeyValue label="Mean Likes" value={formatNumber(creator.instagramMetrics.mean_likes)} />
                <KeyValue label="Mean Comments" value={formatNumber(creator.instagramMetrics.mean_comments)} />
                <KeyValue label="Engagement Rate" value={formatPercent(creator.instagramMetrics.engagement_rate)} />
                <KeyValue label="Posting Frequency" value={creator.instagramMetrics.posting_frequency} />
              </div>
            </div>
          )}
          {creator.youtubeMetrics && (
            <div className="rounded-2xl bg-purple-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-400">YouTube Metrics</p>
              <div className="mt-2 grid gap-1">
                <KeyValue label="Subscribers" value={formatNumber(creator.youtubeMetrics.subscribers)} />
                <KeyValue label="Mean Views" value={formatNumber(creator.youtubeMetrics.mean_views)} />
                <KeyValue label="Mean Likes" value={formatNumber(creator.youtubeMetrics.mean_likes)} />
                <KeyValue label="Engagement Rate" value={formatPercent(creator.youtubeMetrics.engagement_rate)} />
              </div>
            </div>
          )}
        </div>
      )}

      <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 text-sm font-semibold text-white">
        View Full Report
      </button>
    </aside>
  );
}

function InsightBadge({ label, value, color = "text-slate-600" }) {
  return (
    <div className="rounded-2xl bg-purple-50 px-4 py-3">
      <p className="text-xs uppercase text-slate-400">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function KeyValue({ label, value }) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function formatNumber(value) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined;
  }
  return Intl.NumberFormat("en-US").format(Number(value));
}

function formatPercent(value) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined;
  }
  return `${(Number(value) * 100).toFixed(2)}%`;
}
