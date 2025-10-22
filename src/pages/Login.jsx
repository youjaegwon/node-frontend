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
      const token = out?.accessToken || out?.token
      if (token) localStorage.setItem('accessToken', token)
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
      {/* 상단 브랜드 로고 */}
      <div className="flex flex-col items-center mb-8 select-none">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-toss-blue flex items-center justify-center shadow-toss">
            {/* 번개 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M13 2L3 14h7v8l11-12h-8V2z" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            YourApp
          </span>
        </div>
        <p className="text-sm text-zinc-400 mt-2">간편하고 안전한 로그인</p>
      </div>

      <div className="card">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">
          로그인
        </h1>
        <p className="text-zinc-400 text-center mt-2">이메일과 비밀번호를 입력하세요</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label className="text-sm text-zinc-400">이메일</label>
            <input
              className="input mt-2"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
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
              type="password"
              placeholder="••••••••"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
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

        <div className="mt-6 text-center text-sm">
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
