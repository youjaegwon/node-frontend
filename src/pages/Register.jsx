import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || '회원가입 실패');
      nav('/login', { replace: true });
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-neutral-950 text-neutral-100 grid place-items-center px-4">
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur rounded-2xl p-6 shadow-xl ring-1 ring-white/10">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">이름</label>
            <input
              className="w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">이메일</label>
            <input
              type="email"
              className="w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">비밀번호</label>
            <input
              type="password"
              className="w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
              placeholder="8자 이상"
            />
          </div>
          {msg && <p className="text-sm text-red-400">{msg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-black font-semibold py-2.5 transition"
          >
            {loading ? '가입 중…' : '가입하기'}
          </button>
        </form>
        <div className="text-center text-sm mt-4">
          <Link to="/login" className="text-neutral-400 hover:text-white">로그인으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
