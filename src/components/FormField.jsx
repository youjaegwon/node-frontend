import React from 'react';

export default function FormField({ label, type="text", value, onChange, placeholder }) {
  return (
    <label className="block">
      {label && <div className="text-sm text-neutral-600 mb-1">{label}</div>}
      <input
        className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-70 transition"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
