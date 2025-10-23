import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { token, user } = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', user?.name || '');
        navigate('/', { replace: true });
      } else {
        setErr('로그인에 실패했습니다.');
      }
    } catch (e) {
      setErr(e.message || '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white sm:bg-zinc-50">
      <div className="max-w-xl mx-auto px-5 pt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30" />
          <span className="text-2xl font-semibold text-gray-900">YourApp</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">로그인</h1>
        <p className="mt-3 text-gray-500">이메일과 비밀번호로 로그인하세요.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">이메일</span>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <div className="flex items-end justify-between gap-3">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700">비밀번호</span>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                value={password}
                onChange={(e) => setPwd(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <Link
              to="/reset"
              className="mb-1 text-sm font-medium text-emerald-600 hover:underline"
            >
              비밀번호 재설정
            </Link>
          </div>

          {err && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? '로그인 중…' : '로그인'}
          </button>

          <p className="text-center text-gray-600 mt-3">
            처음이신가요?{' '}
            <Link to="/register" className="text-emerald-600 hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
