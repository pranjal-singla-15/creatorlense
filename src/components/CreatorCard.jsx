import React from 'react';

export default function CreatorCard({ creator, onSelect }) {
  const instagram = creator.platforms.find((p) => p.platform === 'instagram');
  const youtube = creator.platforms.find((p) => p.platform === 'youtube');

  return (
    <article
      className="bg-white/80 border border-purple-100 rounded-3xl p-5 shadow-lg shadow-purple-100/50 hover:-translate-y-1 transition cursor-pointer"
      onClick={() => onSelect?.(creator)}
    >
      <div className="flex items-center gap-3 mb-4">
        <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-2xl object-cover" />
        <div>
          <h3 className="text-slate-800 font-semibold">{creator.name}</h3>
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
  if (!stats) return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-3 text-center">
      <p className="text-slate-400">No data</p>
    </div>
  );
  return (
    <div className="rounded-2xl border border-purple-100 p-3 bg-gradient-to-br from-white to-purple-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className={`text-[10px] font-semibold text-white px-2 py-1 rounded-full bg-gradient-to-r ${color}`}>{badge}</span>
      </div>
      <p className="text-slate-900 font-semibold text-base">{(stats.followers / 1_000_000).toFixed(1)}M followers</p>
      <p className="text-slate-500 text-xs">Avg likes: {(stats.avgLikes / 1_000).toFixed(0)}k</p>
      <p className="text-emerald-500 mt-1">Growth {stats.growthRate}%</p>
    </div>
  );
}

