import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import api from '../lib/api';
import { toKoreanMessage } from '../lib/errors';

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api('/auth/register', { method:'POST', body:{ name, email, password } });
      nav('/login?registered=1', { replace: true });
    } catch (e) {
      setErr(toKoreanMessage(e));
    }
  }

  return (
    <AuthLayout
      title="회원가입"
      subtitle="이메일과 비밀번호로 로그인하세요."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="이름" value={name} onChange={setName} placeholder="홍길동" />
        <FormField label="이메일" value={email} onChange={setEmail} placeholder="you@example.com" />
        <FormField label="비밀번호" type="password" value={password} onChange={setPassword} />
        {err && <div className="text-sm text-red-500">{err}</div>}
        <PrimaryButton type="submit">가입하기</PrimaryButton>
      </form>

      <div className="pt-4 text-center text-neutral-500">
        이미 계정이 있으신가요? <Link to="/login" className="underline">로그인으로 돌아가기</Link>
      </div>
    </AuthLayout>
  );
}
