import React from 'react';
export default function Header({ user, onLogout, onToggleMenu }){
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-100">
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500"></div>
          <span className="font-semibold">YourApp</span>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-zinc-600">{user.name}</span>}
          {user && (
            <button onClick={onLogout} className="text-sm text-zinc-500 hover:text-zinc-900">로그아웃</button>
          )}
          <button aria-label="menu" onClick={onToggleMenu} className="p-2 rounded-lg hover:bg-zinc-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
