import React from 'react';
export default function AuthLayout({ title, children }){
  return (
    <div className="min-h-screen bg-white">
      <div className="page-wrap">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500"></div>
          <div className="text-2xl font-semibold">YourApp</div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">{title}</h1>
        <p className="text-zinc-600 mb-8">이메일과 비밀번호로 로그인하세요.</p>
        {children}
      </div>
    </div>
  );
}
