import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (_) {}
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-lg bg-emerald-500 shadow-sm" />
            <span className="text-lg font-semibold text-zinc-900">YourApp</span>
          </Link>

          {/* Right: hamburger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="열기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer / Overlay */}
      {open && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* panel */}
          <aside className="fixed right-0 top-0 z-50 h-full w-72 max-w-[80vw] bg-white shadow-2xl">
            {/* panel header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm text-zinc-500">로그인 사용자</div>
                <div className="truncate font-medium text-zinc-900">
                  {user?.name || '게스트'}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 hover:bg-zinc-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* actions */}
            <div className="border-b border-zinc-200 px-4 py-3">
              <button
                onClick={logout}
                className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 active:scale-[0.99]"
              >
                로그아웃
              </button>
            </div>

            {/* sample menu */}
            <nav className="px-2 py-2">
              <MenuItem to="/">대시보드</MenuItem>
              <MenuItem to="/profile">내 프로필</MenuItem>
              <MenuItem to="/settings">설정</MenuItem>
              <MenuItem to="/help">도움말</MenuItem>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}

function MenuItem({ to, children }) {
  return (
    <Link
      to={to}
      className="block rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
    >
      {children}
    </Link>
  );
}
