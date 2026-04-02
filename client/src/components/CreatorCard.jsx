import React from "react";

export default function CreatorCard({ creator, onSelect }) {
  const instagram = creator.platforms.find((p) => p.platform === "instagram");
  const youtube = creator.platforms.find((p) => p.platform === "youtube");

  return (
    <article
      className="cursor-pointer rounded-3xl border border-purple-100 bg-white/80 p-5 shadow-lg shadow-purple-100/50 transition hover:-translate-y-1"
      onClick={() => onSelect?.(creator)}
    >
      <div className="mb-4 flex items-center gap-3">
        <img src={creator.avatarUrl} alt={creator.name} className="h-12 w-12 rounded-2xl object-cover" />
        <div>
          <h3 className="font-semibold text-slate-800">{creator.name}</h3>
          <p className="text-xs text-slate-500">{creator.niche}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-slate-500">Authenticity</p>
          <p className="text-lg font-semibold text-purple-600">{creator.authenticityScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
        <PlatformTile label="Instagram" stats={instagram} badge="IG" color="from-pink-400 to-orange-300" />
        <PlatformTile label="YouTube" stats={youtube} badge="YT" color="from-red-400 to-rose-400" />
      </div>
    </article>
  );
}

function PlatformTile({ label, stats, badge, color }) {
  if (!stats) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-3 text-center">
        <p className="text-slate-400">No data</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-slate-600">{label}</span>
        <span className={`rounded-full bg-gradient-to-r px-2 py-1 text-[10px] font-semibold text-white ${color}`}>
          {badge}
        </span>
      </div>
      <p className="text-base font-semibold text-slate-900">{(stats.followers / 1_000_000).toFixed(1)}M followers</p>
      <p className="text-xs text-slate-500">Avg likes: {(stats.avgLikes / 1_000).toFixed(0)}k</p>
      <p className="mt-1 text-emerald-500">Growth {stats.growthRate}%</p>
    </div>
  );
}

