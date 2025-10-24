import React from 'react';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
      {tabs.map((t, idx) => (
        <button
          key={t}
          onClick={() => onChange(idx)}
          className={
            "flex-1 text-sm font-medium py-2 rounded-lg transition " +
            (active === idx
              ? "bg-white shadow text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700")
          }
        >
          {t}
        </button>
      ))}
    </div>
  );
}
