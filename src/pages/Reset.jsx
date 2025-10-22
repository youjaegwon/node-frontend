import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('요청 중…');
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || '요청 실패');
      setStatus('메일을 보냈습니다. 받은편지함을 확인하세요.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="min-h-svh bg-neutral-950 text-neutral-100 grid place-items-center px-4">
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur rounded-2xl p-6 shadow-xl ring-1 ring-white/10">
        <h1 className="text-2xl font-bold text-center mb-6">비밀번호 재설정</h1>
        <form onSubmit={onSubmit} className="space-y-4">
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
          {status && <p className="text-sm text-sky-300">{status}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold py-2.5 transition"
          >
            재설정 메일 보내기
          </button>
        </form>
        <div className="text-center text-sm mt-4">
          <Link to="/login" className="text-neutral-400 hover:text-white">로그인으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
