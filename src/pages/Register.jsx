import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Register() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pw, setPw] = useState('')
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      await api('/auth/register', { method: 'POST', body: { email, name, password: pw } })
      setOk('회원가입이 완료되었습니다 🎉')
      // 1초 후 로그인 페이지로 자동 이동
      setTimeout(() => nav('/', { replace: true }), 1000)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="card animate-scale-in">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          className="input"
          placeholder="이메일"
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="비밀번호"
          type="password"
          value={pw}
          onChange={e=>setPw(e.target.value)}
          required
        />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        {ok && <div className="text-emerald-400 text-sm">{ok}</div>}
        <button className="btn-primary">가입하기</button>
      </form>
      <div className="mt-4 text-sm">
        <Link to="/" className="link-muted">로그인으로 돌아가기</Link>
      </div>
    </div>
  )
}
