import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const inputClass =
    'w-full h-12 rounded-xl border border-zinc-300 px-4 text-[16px] outline-none ' +
    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition';

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (!res.ok || !res.user) {
        throw new Error(res.message || '로그인에 실패했습니다.');
      }
      // 토큰/유저 저장 후 메인으로
      if (res.token) localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      nav('/', { replace: true });
    } catch (e) {
      setErr(e.message || '요청을 처리하지 못했습니다.');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 pt-10 pb-24">
        {/* 로고 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500 shadow-lg" />
          <span className="font-semibold text-2xl text-zinc-800">YourApp</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900">로그인</h1>
        <p className="mt-4 text-zinc-600">이메일과 비밀번호로 로그인하세요.</p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          {/* 이메일 */}
          <div>
            <label className="block mb-2 text-[15px] font-medium text-zinc-800">이메일</label>
            <input
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 라벨 행 + 재설정 링크 */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[15px] font-medium text-zinc-800">비밀번호</label>
              <Link
                to="/reset"
                className="text-[14px] text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                비밀번호 재설정
              </Link>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 에러 메시지 */}
          {err && (
            <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-[14px]">
              {err}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 text-white text-[16px] font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:bg-emerald-800 transition"
          >
            로그인
          </button>

          {/* 하단 링크 */}
          <p className="text-center text-zinc-500 mt-2">
            처음이신가요?{' '}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
