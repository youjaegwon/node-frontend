import { toMessage } from '../lib/errorMap';
import React, {useState} from 'react';
import AuthLayout from '../components/AuthLayout';
import { api } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

const errorMap = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  USER_NOT_FOUND: '가입 내역을 찾을 수 없습니다.',
  TOO_MANY_ATTEMPTS: '잠시 후 다시 시도해주세요.',
  UNKNOWN: '요청을 처리하지 못했습니다.'
};

export default function Login(){
  const nav = useNavigate();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    setErr('');
    try{
      const data = await api('/auth/login',{method:'POST',body:{email,password}});
      localStorage.setItem('token', data?.token||'');
      nav('/'); // 메인으로
    }catch(e){
      setErr(errorMap[e.code] || e.message || errorMap.UNKNOWN);
    }
  }

  return (
    <AuthLayout title="로그인">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">비밀번호</label>
            <Link to="/reset" className="link text-sm">비밀번호 재설정</Link>
          </div>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary" type="submit">로그인</button>
        <p className="text-center text-sm text-zinc-600">처음이신가요? <Link to="/register" className="link">회원가입</Link></p>
      </form>
    </AuthLayout>
  );
}
