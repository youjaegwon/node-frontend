import React from 'react';

export default function PrimaryButton({ children, disabled, onClick, type="button" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-xl bg-emerald-500 text-white font-semibold py-3 shadow-[0_8px_24px_rgba(16,185,129,0.35)] disabled:opacity-50"
    >
      {children}
    </button>
  );
}
