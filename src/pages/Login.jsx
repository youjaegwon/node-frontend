import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || '로그인 실패');
      nav('/main', { replace: true });
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-neutral-950 text-neutral-100 grid place-items-center px-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 ring-1 ring-sky-500/30 text-sky-300 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
            안전한 로그인
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">다시 만나서 반가워요 👋</h1>
          <p className="text-neutral-400 mt-1">이메일과 비밀번호로 로그인하세요.</p>
        </div>

        {/* 카드 */}
        <div className="bg-neutral-900/60 backdrop-blur rounded-2xl p-6 shadow-xl ring-1 ring-white/10">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">이메일</label>
              <input
                type="email"
                className="w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex justify-between items-end">
                <label className="block text-sm mb-1">비밀번호</label>
                <Link to="/reset" className="text-xs text-sky-400 hover:text-sky-300">비밀번호 재설정</Link>
              </div>
              <input
                type="password"
                className="w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {msg && <p className="text-sm text-red-400">{msg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:hover:bg-sky-500 text-black font-semibold py-2.5 transition"
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>

          {/* 하단 액션 */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm">
            <span className="text-neutral-400">처음이신가요?</span>
            <Link
              to="/register"
              className="inline-flex items-center gap-1 text-sky-300 hover:text-white font-medium"
            >
              회원가입
              <svg width="14" height="14" viewBox="0 0 20 20" className="fill-current">
                <path d="M12.293 3.293a1 1 0 011.414 0L19 8.586l-1.414 1.414L14 6.414V17a1 1 0 11-2 0V6.414l-3.586 3.586L7 8.586l5.293-5.293z"/>
              </svg>
            </Link>
          </div>
        </div>

        <p className="text-xs text-neutral-500 text-center mt-4">
          © YourApp • React + Vite + Tailwind
        </p>
      </div>
    </div>
  );
}
