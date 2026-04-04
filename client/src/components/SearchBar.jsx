import React from "react";

export default function SearchBar({
  placeholder,
  onChange,
  onSearch,
  value = "",
  isLoading = false,
  className = "",
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/80 px-4 py-2 shadow-sm">
        <span className="text-purple-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4a7 7 0 0 1 5.657 11.314l3.514 3.515a1 1 0 0 1-1.415 1.414l-3.514-3.514A7 7 0 1 1 11 4Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" fill="currentColor" />
          </svg>
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </label>
    </form>
  );
}
