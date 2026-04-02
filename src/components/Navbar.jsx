import React from 'react';

const navItems = ['Dashboard', 'Creators', 'Insights', 'Reports'];

export default function Navbar() {
  return (
    <header className="px-6 py-4 bg-white/80 backdrop-blur border-b border-purple-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
            CL
          </div>
          <div>
            <p className="text-sm text-purple-500 font-semibold">CreatorLens</p>
            <p className="text-xs text-slate-500">Insight OS</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
          {navItems.map((item) => (
            <button key={item} className="hover:text-purple-600 transition font-medium">
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <button className="text-slate-500 hover:text-purple-600 font-medium">My Brand</button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-300"></div>
        </div>
      </div>
    </header>
  );
}

