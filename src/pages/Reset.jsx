import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Reset() {
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      await api('/auth/password/reset-request', { method: 'POST', body: { email } })
      setOk('재설정 링크를 이메일로 보냈습니다.')
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold">비밀번호 재설정</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="input" placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        {ok && <div className="text-emerald-400 text-sm">{ok}</div>}
        <button className="btn-primary">메일 보내기</button>
      </form>
      <div className="mt-4 text-sm">
        <Link to="/" className="link-muted">로그인으로 돌아가기</Link>
      </div>
    </div>
  )
}
