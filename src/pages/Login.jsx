import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (loading) return
    setErr('')
    setLoading(true)
    try {
      const out = await api('/auth/login', { method: 'POST', body: { email, password: pw } })
      // accessToken 쿠키/헤더 방식과 상관없이 백엔드 응답에 맞춰 사용
      const token = out?.accessToken || out?.token
      if (token) localStorage.setItem('accessToken', token)
      // 성공 애니메이션 → 페이지 전환
      setLeaving(true)
      setTimeout(() => nav('/home', { replace: true }), 260)
    } catch (e) {
      setErr(e.message || '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-xl animate-fade-in ${leaving ? 'animate-fade-out' : ''}`}>
      <div className="mb-6 flex items-center gap-2">
        <div className="brand-dot" />
        <span className="text-sm text-zinc-400">안전한 로그인</span>
      </div>

      <div className="card">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          다시 만나서 반가워요 <span className="inline-block">👋</span>
        </h1>
        <p className="text-zinc-400 mt-3">이메일과 비밀번호로 로그인하세요.</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label className="text-sm text-zinc-400">이메일</label>
            <input
              className="input mt-2"
              type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">비밀번호</label>
              <Link to="/reset" className="link-muted text-sm">비밀번호 재설정</Link>
            </div>
            <input
              className="input mt-2"
              type="password" placeholder="••••••••"
              value={pw} onChange={e => setPw(e.target.value)} required
              autoComplete="current-password"
            />
          </div>

          {err && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded-lg p-3">
              {err}
            </div>
          )}

          <button className="btn-primary mt-3" disabled={loading}>
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-sm">
          <span className="text-zinc-400">처음이신가요? </span>
          <Link to="/register" className="link-muted">회원가입</Link>
        </div>
      </div>

      <footer className="mt-6 text-center text-xs text-zinc-500">
        © YourApp • React + Vite + Tailwind
      </footer>
    </div>
  )
}
