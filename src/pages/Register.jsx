import { toMessage } from '../lib/errorMap';
import React,{useState} from 'react';
import AuthLayout from '../components/AuthLayout';
import { api } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register(){
  const nav = useNavigate();
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  async function handleSubmit(e){
    e.preventDefault();
    setErr('');
    try{
      await api('/auth/register',{method:'POST',body:{name,email,password}});
      nav('/login?registered=1'); // 가입 후 로그인 페이지로
    }catch(e){ setErr(e.message||'가입에 실패했습니다.'); }
  }
  return (
    <AuthLayout title="회원가입">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">이름</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="홍길동" required/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">비밀번호</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary" type="submit">가입하기</button>
        <p className="text-center text-sm text-zinc-600">이미 계정이 있으신가요? <Link to="/login" className="link">로그인으로 돌아가기</Link></p>
      </form>
    </AuthLayout>
  );
}
