import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  const name = localStorage.getItem('userName') || '사용자';

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    nav('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="max-w-5xl mx-auto h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 shadow shadow-emerald-500/30" />
            <span className="font-semibold text-gray-900">YourApp</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{name}님</span>
            <button
              onClick={logout}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">메인</h2>
          <p className="mt-2 text-gray-600">로그인 후 보이는 메인 화면입니다.</p>
        </div>
      </main>
    </div>
  );
}
