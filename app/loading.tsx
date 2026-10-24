import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Top utility skeleton */}
      <div className="h-9 bg-slate-900/80 border-b border-slate-800 animate-pulse px-4 flex items-center justify-between">
        <div className="h-3 w-40 bg-slate-800 rounded"></div>
        <div className="h-3 w-48 bg-slate-800 rounded"></div>
      </div>

      {/* Main Navbar skeleton */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/30 animate-pulse"></div>
          <div className="h-6 w-36 bg-slate-800 rounded"></div>
        </div>
        <div className="h-8 w-64 bg-slate-800/60 rounded-full hidden md:block"></div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-slate-800 rounded-lg"></div>
          <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
        </div>
      </div>

      {/* Category Tabs skeleton */}
      <div className="h-11 bg-slate-900/60 border-b border-slate-800 px-4 sm:px-8 flex items-center gap-3 overflow-hidden">
        {[80, 72, 96, 64, 88, 104, 76].map((w, idx) => (
          <div
            key={idx}
            className="h-6 bg-slate-800/80 rounded-md animate-pulse"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Main Content Layout Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breaking ticker placeholder */}
        <div className="h-10 bg-slate-900/70 border border-slate-800 rounded-xl animate-pulse"></div>

        {/* Hero Card Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 sm:p-6 animate-pulse">
          <div className="lg:col-span-7 h-64 sm:h-80 bg-slate-800/50 rounded-xl"></div>
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 py-2">
            <div className="space-y-3">
              <div className="h-5 w-28 bg-red-500/20 rounded-full"></div>
              <div className="h-8 w-full bg-slate-800 rounded-lg"></div>
              <div className="h-8 w-3/4 bg-slate-800 rounded-lg"></div>
              <div className="h-4 w-full bg-slate-800/60 rounded"></div>
              <div className="h-4 w-5/6 bg-slate-800/60 rounded"></div>
            </div>
            <div className="h-10 w-full bg-slate-800/80 rounded-xl"></div>
          </div>
        </div>

        {/* 3-Column Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-4 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-44 bg-slate-800/50 rounded-xl"></div>
                <div className="h-4 w-20 bg-slate-800 rounded"></div>
                <div className="h-6 w-full bg-slate-800 rounded"></div>
                <div className="h-4 w-4/5 bg-slate-800/60 rounded"></div>
              </div>
              <div className="h-8 bg-slate-800/80 rounded-lg mt-4"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
