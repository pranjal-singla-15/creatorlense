import React from 'react';

export default function SearchBar({ placeholder, onChange, className = '' }) {
  return (
    <label className={`flex items-center gap-3 bg-white/80 border border-purple-100 rounded-2xl px-4 py-2 shadow-sm ${className}`}>
      <span className="text-purple-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4a7 7 0 0 1 5.657 11.314l3.514 3.515a1 1 0 0 1-1.415 1.414l-3.514-3.514A7 7 0 1 1 11 4Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" fill="currentColor" />
        </svg>
      </span>
      <input
        type="text"
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent flex-1 outline-none text-sm text-slate-600"
      />
    </label>
  );
}

