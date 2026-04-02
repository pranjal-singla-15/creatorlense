import React from 'react';

export default function ReportList({ reports = [] }) {
  if (!reports.length) {
    return (
      <section className="bg-white/80 rounded-3xl border border-purple-100 p-6 shadow-lg shadow-purple-100/50">
        <p className="text-sm text-slate-500">No reports generated yet.</p>
      </section>
    );
  }

  return (
    <section className="bg-white/90 rounded-3xl border border-purple-100 p-6 shadow-lg shadow-purple-100/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Reports Overview</h3>
        <button className="text-sm text-purple-500 font-semibold">Generate New Report</button>
      </div>
      <div className="space-y-3 text-sm">
        {reports.map((report) => (
          <article key={report._id} className="flex items-center justify-between border border-purple-50 rounded-2xl px-4 py-3">
            <div>
              <p className="text-slate-800 font-medium">{report.creator?.name}</p>
              <p className="text-xs text-slate-400">{report.title}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(report.status)}`}>
              {report.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function statusColor(status) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-600';
    case 'processing':
      return 'bg-amber-50 text-amber-500';
    default:
      return 'bg-slate-100 text-slate-500';
  }
}

