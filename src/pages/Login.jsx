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
      // 성공 애니메이션 (간단 페이드) 후 메인 이동
      document.body.classList.add('animate-[fadeOut_360ms_ease-in_forwards]')
      setTimeout(()=> nav('/home', { replace:true }), 300)
    } catch (e) {
      setErr(e.message) // 한글 메세지
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* 로고 영역 (심플 토스 느낌) */}
        <div className="flex items-center mb-8 select-none">
          <div className="w-8 h-8 rounded-xl bg-brand-500 mr-3" />
          <div className="text-xl font-semibold tracking-tight">YourApp</div>
        </div>

        <h1 className="text-3xl font-semibold mb-2">로그인</h1>
        <p className="text-neutral-400 mb-6">이메일과 비밀번호로 로그인하세요.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input className="input" type="email" placeholder="you@example.com"
                 value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="비밀번호"
                 value={pw} onChange={e=>setPw(e.target.value)} required />
          {err && <div className="error-text">{err}</div>}
          <button className="btn-primary" disabled={loading}>
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <div className="mt-4 text-sm text-neutral-400">
          처음이신가요? <Link to="/register" className="link-muted">회원가입</Link>
          <span className="mx-1">·</span>
          <Link to="/reset" className="link-muted">비밀번호 재설정</Link>
        </div>
      </div>
    </div>
  )
}
