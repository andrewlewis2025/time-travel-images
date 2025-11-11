
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-2xl border border-white/10">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-fuchsia-400 mb-2">Gemini Prototype</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug">
          Time-Travel Photo Generator
        </h1>
        <p className="mt-3 text-slate-200 max-w-2xl">
          Upload one portrait, lock in the face and body, and generate five faithful looks from the 1960s through the 2000s.
          Gemini applies localised edits only where you allow.
        </p>
      </div>
      <a href="#workspace" className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-full bg-fuchsia-500 text-slate-900 shadow-lg hover:bg-fuchsia-400 transition">
        Get Started
      </a>
    </div>
  </header>
);
