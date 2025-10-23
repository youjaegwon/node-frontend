import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api('/auth/register', { body: { name, email, password } });
      // 가입완료 → 로그인으로
      nav('/login');
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

      <h1 className="text-4xl font-extrabold mb-4">회원가입</h1>
      <p className="text-zinc-500 mb-8">이메일과 비밀번호로 로그인하세요.</p>

      {err && <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full rounded-xl border px-4 py-3" placeholder="이름"
               value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full rounded-xl border px-4 py-3" placeholder="you@example.com"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl border px-4 py-3" type="password" placeholder="비밀번호"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold shadow-lg">가입하기</button>
      </form>

      <div className="mt-10 text-center text-zinc-500">
        이미 계정이 있으신가요? <Link to="/login" className="text-emerald-600">로그인으로 돌아가기</Link>
      </div>
    </div>
  );
}
