import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await api('/auth/reset', { method: 'POST', body: { email } });
      setMsg('비밀번호 재설정 메일을 전송했어요.');
    } catch (e) {
      setErr(e.message || '요청을 처리하지 못했습니다.');
    }
  }

  return (
    <div className="min-h-screen bg-white sm:bg-zinc-50">
      <div className="max-w-xl mx-auto px-5 pt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30" />
          <span className="text-2xl font-semibold text-gray-900">YourApp</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">비밀번호 재설정</h1>
        <p className="mt-3 text-gray-500">가입하신 이메일을 입력해주세요.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {msg && <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{msg}</p>}
          {err && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>}

          <button className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600">
            메일 보내기
          </button>

          <p className="text-center text-gray-600 mt-3">
            <Link to="/login" className="text-emerald-600 hover:underline">로그인으로 돌아가기</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
