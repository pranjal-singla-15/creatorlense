import React from "react";

const navItems = ["Dashboard", "Creators", "Insights", "Reports"];

export default function Navbar() {
  return (
    <header className="border-b border-purple-100 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-semibold">
            CL
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-500">CreatorLens</p>
            <p className="text-xs text-slate-500">Insight OS</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
          {navItems.map((item) => (
            <button key={item} className="font-medium transition hover:text-purple-600">
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <button className="font-medium text-slate-500 hover:text-purple-600">My Brand</button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-300" />
        </div>
      </div>
    </header>
  );
}

