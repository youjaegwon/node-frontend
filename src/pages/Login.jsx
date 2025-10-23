import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api('/auth/login', { body: { email, password } });
      // token은 있을 수도/없을 수도 있게 안전 처리
      if (res.token) localStorage.setItem('token', res.token);
      // 필요 시 사용자 정보도 저장
      localStorage.setItem('user', JSON.stringify(res.user));
      // 메인으로 이동
      nav('/');
    } catch (e) {
      setErr(e.message || '요청을 처리하지 못했습니다.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-emerald-500"></div>
        <div className="text-2xl font-semibold">YourApp</div>
      </div>

      <h1 className="text-4xl font-extrabold mb-4">로그인</h1>
      <p className="text-zinc-500 mb-8">이메일과 비밀번호로 로그인하세요.</p>

      {err && <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full rounded-xl border px-4 py-3" placeholder="you@example.com"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <div className="flex items-center gap-3">
          <input className="flex-1 rounded-xl border px-4 py-3" type="password"
                 placeholder="비밀번호" value={password} onChange={e=>setPassword(e.target.value)} />
          <Link to="/reset" className="text-emerald-600">비밀번호 재설정</Link>
        </div>
        <button className="w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold shadow-lg">로그인</button>
      </form>

      <div className="mt-10 text-center text-zinc-500">
        처음이신가요? <Link to="/register" className="text-emerald-600">회원가입</Link>
      </div>
    </div>
  );
}
