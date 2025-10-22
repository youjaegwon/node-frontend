import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Main() {
  const nav = useNavigate()

  async function logoutAll() {
    try { await api('/auth/logout-all', { method: 'POST' }) } catch {}
    localStorage.removeItem('accessToken')
    nav('/', { replace: true })
  }

  return (
    <div className="w-full max-w-3xl animate-slide-up">
      <div className="bg-gradient-to-br from-toss-blue/20 to-blue-400/10 border border-white/10 rounded-2xl p-8">
        <h2 className="text-3xl font-bold">메인 페이지</h2>
        <p className="text-zinc-300 mt-2">로그인 성공! 필요한 UI를 여기에 구성하세요.</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => nav('/', { replace: true })}
            className="px-4 py-2 rounded-xl bg-zinc-800 border border-white/10 hover:bg-zinc-700 transition"
          >
            돌아가기
          </button>
          <button
            onClick={logoutAll}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
          >
            전체 로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}
