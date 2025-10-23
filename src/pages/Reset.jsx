import React,{useState} from 'react';
import AuthLayout from '../components/AuthLayout';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Reset(){
  const [email,setEmail] = useState('');
  const [msg,setMsg] = useState('');
  const [err,setErr] = useState('');
  async function handleSubmit(e){
    e.preventDefault(); setMsg(''); setErr('');
    try{
      await api('/auth/reset-request',{method:'POST',body:{email}});
      setMsg('비밀번호 재설정 메일을 보냈습니다.');
    }catch(e){ setErr(e.message||'요청을 처리하지 못했습니다.'); }
  }
  return (
    <AuthLayout title="비밀번호 재설정">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/>
        </div>
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary" type="submit">재설정 링크 보내기</button>
        <p className="text-center text-sm text-zinc-600"><Link to="/login" className="link">로그인으로 돌아가기</Link></p>
      </form>
    </AuthLayout>
  );
}
