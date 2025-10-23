import React from 'react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 pt-10 pb-24">
        {/* 로고 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 shadow-lg" />
          <div className="text-2xl font-semibold tracking-tight">YourApp</div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{title}</h1>
        {subtitle && <p className="text-neutral-500 mb-8">{subtitle}</p>}

        {/* 컨텐츠 */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
