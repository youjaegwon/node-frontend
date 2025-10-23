import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (loading) return
    setErr(''); setLoading(true)
    try {
      const out = await api('/auth/login', { method:'POST', body:{ email, password: pw } })
      const token = out?.data?.accessToken || out?.accessToken
      if (token) localStorage.setItem('accessToken', token)
      nav('/home', { replace: true })
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" type="email" placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="비밀번호" value={pw} onChange={e=>setPw(e.target.value)} required />
        {err && <div className="text-sm text-red-400">{err}</div>}
        <button className="btn-primary" disabled={loading}>{loading ? '로그인 중…':'로그인'}</button>
      </form>
      <div className="mt-4 text-sm">
        처음이신가요? <Link to="/register" className="link-muted">회원가입</Link> · <Link to="/reset" className="link-muted">비밀번호 재설정</Link>
      </div>
    </div>
  )
}
