import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

      // 성공 → 메인으로
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
        <div className="bg-neutral-900/60 backdrop-blur rounded-2xl p-6 shadow-xl ring-1 ring-white/10">
          <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">이메일</label>
              <input
                type="email"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">비밀번호</label>
              <input
                type="password"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
              />
            </div>
            {msg && (
              <p className="text-sm text-red-400">{msg}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:hover:bg-sky-500 text-black font-semibold py-2 transition"
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4 text-sm">
            <a href="#" className="text-neutral-400 hover:text-white">회원가입</a>
            <a href="#" className="text-neutral-400 hover:text-white">비밀번호 재설정</a>
          </div>
        </div>
        <p className="text-xs text-neutral-500 text-center mt-4">
          BE node-backend v0.1.0 • React + Vite • Tailwind
        </p>
      </div>
    </div>
  );
}
